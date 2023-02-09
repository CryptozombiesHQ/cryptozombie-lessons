---
title: Import
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode:
      "zombiefeeding.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        #[multiversx_sc::module]
        pub trait ZombieFeeding {

        }
      "zombie.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();
        
        #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
        pub struct Zombie<M: ManagedTypeApi> {
            pub name: ManagedBuffer<M>,
            pub dna: u64,
        }
      "zombiefactory.rs": |
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        // start here

        #[multiversx_sc::contract]
        pub trait ZombieFactory : ZombieFeeding{

          #[init]
          fn init(&self) {
            self.dna_digits().set(16u8);
            self.zombies_count().set(1usize);
          }

          fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
              self.zombies_count().update(|id| {
                self.new_zombie_event(*id, &name, dna);;
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
    answer: >
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        mod zombiefeeding;
        mod zombie;

        use zombie::Zombie;

        #[multiversx_sc::contract]
        pub trait ZombieFactory : zombiefeeding::ZombieFeeding{

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

---

Whoa! You'll notice we just cleaned up the code to the right, and you now have tabs at the top of your editor. Go ahead, click between the tabs to try it out.

Our code was getting pretty long, so we split it up into multiple files to make it more manageable. This is normally how you will handle long codebases in your Rust projects.

When you have multiple files and you want to import one file into another, Rust uses the `mod` keyword:

```
mod some_other_module;

#[multiversx_sc::contract]
pub trait NewContract : some_other_module::SomeOtherModule {

}
```

So if we had a file named `some_other_module.rs` in the same directory as this contract (that's what the `./` means), it would get imported by the compiler.

in case of our `Zombie` struct just importing the file will not be enough since we will not use it for inheritance, but we simply just use it within our trait, reason why additionally we will need to write `use zombie::Zombie;`, this since our `Zombie` struct will be inside `zombie.rs`.


> Notice : separating our struct and module trait in separate files still requires us to add `multiversx_sc::imports!();` and `multiversx_sc::derive_imports!();` since they use managed types which are not basic rust elements, but provided by the MultiversX Rust framework.
> Notice : the fields of our `Zombie` struct the `name` and the `dna` require now to be public since they are not part of the same file, so their visibility is no longer ensured.


# Put it to the test

Now that we've set up a multi-file structure, we need to import the contents of the other files:

1. Import `zombiefeeding` and `zombie` into our contract file , `zombiefactory.rs`. 

2. Remember to add the file name of `zombiefeeding` also to the contract's implementation of `ZombieFeeding` 
