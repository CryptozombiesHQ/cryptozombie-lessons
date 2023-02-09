---
title: Inheritance
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
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
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
          self.zombies_count().set(1usize);
        }

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies_count().update(|id| {
              self.new_zombie_event(*id, &name, dna);
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
            let caller = self.blockchain().get_caller();
            require!(self.zombies(&caller).len() == 0, "You already own a zombie");
            let rand_dna = self.generate_random_dna();
            self.create_zombie(&caller, name, rand_dna);
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
      }

      // Start here

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
      pub trait ZombieFactory : ZombieFeeding{

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
          self.zombies_count().set(1usize);
        }

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies_count().update(|id| {
              self.new_zombie_event(*id, &name, dna);
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
            let caller = self.blockchain().get_caller();
            require!(self.zombies(&caller).len() == 0, "You already own a zombie");
            let rand_dna = self.generate_random_dna();
            self.create_zombie(&caller, name, rand_dna);
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
      }

      #[multiversx_sc::module]
      pub trait ZombieFeeding {

      }

---

Our game code is getting quite long. Rather than making one extremely long contract, sometimes it makes sense to split your code logic across multiple files to organize the code.

One feature of Rust that makes this more manageable is contract modules:

```
#[multiversx_sc::contract]
pub trait Doge: BabyDoge {
  fn catchphrase(&self) -> ManagedBuffer{
    ManagedBuffer::from(b"So Wow CryptoDoge")
  }
}

#[multiversx_sc::module]
pub trait BabyDoge {
  fn another_catchphrase(&self) -> ManagedBuffer {
    ManagedBuffer::from(b"Such Moon BabyDoge")
  }
}
```

`BabyDoge` is a module of `Doge`. That means when youcompile and deploy `Doge` you will have access to what `BabyDoge` offers as well.

This can be used for trait inheritance (such as with a subclass, a `Cat` is an `Animal`). But it can also be used simply for organizing your code by grouping similar logic together into different contracts.

# Put it to the test

In the next chapters, we're going to be implementing the functionality for our zombies to feed and multiply. Let's put this logic into its own module.

1. Make a module called `ZombieFeeding` below `ZombieFactory`. This module should be empty for now

2. Add `ZombieFeeding` the implementation to the ZombieFactory contract.
