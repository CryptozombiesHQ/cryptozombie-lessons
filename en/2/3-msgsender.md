---
title: Msg.sender
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust by:
    startingCode: |
      #![no_std]

      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
      pub struct Zombie<M: ManagedTypeApi> {
          name: ManagedBuffer<M>,
          dna: u64,
      }

      #[multiversx_sc::contract]
      pub trait ZombiesContract {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
          self.zombies_count().set(1usize);
        }

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies_count().update(|id| {
              self.new_zombie_event(*id, &name, dna);

              // write storages here

              self.zombies(id).set(Zombie { name, dna });
              *id +=1;
            });
        }

        #[view]
        fn generate_random_dna(&self) -> u64{
            let mut rand_source = RandomnessSource::new();
            let dna_digits = self.dna_digits().get();
            let max_dna_value = u64::pow(10u64, dna_digits as u32);
            rand_source.next_u64_in_range(0u64, max_dna_value)
        }

        #[endpoint]
        fn create_random_zombie(&self, name: ManagedBuffer){
            
            // start here

            let rand_dna = self.generate_random_dna();
            self.create_zombie(name, rand_dna);
        }

        #[event("new_zombie_event")]
        fn new_zombie_event(
            &self, 
            #[indexed] name: &ManagedBuffer, 
            #[indexed] dna: u64,
        );

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[view]
        #[storage_mapper("zombies_count")]
        fn zombies_count(&self) -> SingleValueMapper<usize>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(&self, id: &usize) -> SingleValueMapper<Zombie<Self::Api>>;

        #[storage_mapper("zombie_owner")]
        fn zombie_owner(&self, id: &usize) -> SingleValueMapper<ManagedAddress>;
        
        #[storage_mapper("owned_zombies")]
        fn owned_zombies(&self, owner: &ManagedAddress) -> UnorderedSetMapper<usize>;
      }
    answer: >
      #![no_std]

      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
      pub struct Zombie<M: ManagedTypeApi> {
          name: ManagedBuffer<M>,
          dna: u64,
      }

      #[multiversx_sc::contract]
      pub trait ZombiesContract {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
          self.zombies_count().set(1usize);
        }

        fn create_zombie(&self, owner: ManagedAddress, name: ManagedBuffer, dna: u64) {
            self.zombies_count().update(|id| {
                self.new_zombie_event(*id, &name, dna);
                self.zombies(id).set(Zombie { name, dna });
                self.owned_zombies(&owner).insert(id);
                self.zombie_owner(id).set(owner);
                *id += 1;
            });
        }

        #[view]
        fn generate_random_dna(&self) -> u64{
            let mut rand_source = RandomnessSource::new();
            let dna_digits = self.dna_digits().get();
            let max_dna_value = u64::pow(10u64, dna_digits as u32);
            rand_source.next_u64_in_range(0u64, max_dna_value)
        }

        #[endpoint]
        fn create_random_zombie(&self, name: ManagedBuffer){
            let caller = self.blockchain().get_caller();
            let rand_dna = self.generate_random_dna();
            self.create_zombie(caller, name, rand_dna);
        }

        #[event("new_zombie_event")]
        fn new_zombie_event(
            &self, 
            #[indexed] name: &ManagedBuffer, 
            #[indexed] dna: u64,
        );

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[view]
        #[storage_mapper("zombies_count")]
        fn zombies_count(&self) -> SingleValueMapper<usize>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(&self, id: &usize) -> SingleValueMapper<Zombie<Self::Api>>;

        #[view]
        #[storage_mapper("zombie_owner")]
        fn zombie_owner(&self, id: &usize) -> SingleValueMapper<ManagedAddress>;
        
        #[view]
        #[storage_mapper("owned_zombies")]
        fn owned_zombies(&self, owner: &ManagedAddress) -> UnorderedSetMapper<usize>;
      }
---

Now that we have our mapping to keep track of who owns a zombie, we'll want to update the `create_zombie` so that the zombie created to be stored by the caller address.

## Getting the caller

In the MultiversX Rust framework is done very easy by:

```
let caller = self.blockchain().get_caller();
```

## Working with references

You will experience that while working in Rust many of the times we will have to deal the reference the proper way. Certain functions will be optimized if have a certain element as a reference, just borrowing it from the caller and after their code block is executed returning it back.  

```
fn say_hello(&self) -> ManagedBuffer {
    let person = ManagedBuffer::from(b"Bob");
    self.say_hello_to_person(person)
}

#[endpoint]
fn say_hello_to_person(&self, name: &ManagedBuffer) -> ManagedBuffer{
    let mut message = ManagedBuffer::from(b"Hello ");
    message.append(name);
    message
}
```

## Putting elements into a UnorderedSetMapper

Adding an element to an `UnorderedSetMapper` is done by the method `insert`:

```
self.persons().insert(new_person);
```

# Put it to the test

Let's update our `create_random_zombie` endpoint from lesson 1 to assign ownership of the zombie to whoever called the function. 
We will want to store a list of zombie ids inside `owned_zombies` for each caller that creates the zombie and the owner for each zombie inside `zombie_owner`.

1. Starting with `create_random_zombie`, we need to get the caller of the endpoint.

2. Second, we will pass the address as a parameter to the function `create_zombie` which sets the `owned_zombies`, and the `zombie_owner` storages. We will have something similar to how we set the zombie insize the `zombies` storage.
