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
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        #[multiversx_sc::module]
        pub trait ZombieFactory{
            fn create_zombie(&self, owner: ManagedAddress, name: ManagedBuffer, dna: u64) {
                self.zombies_count().update(|id| {
                    self.new_zombie_event(*id, &name, dna);
                    self.zombies(id).set(Zombie { name, dna });
                    self.owned_zombies(&owner).insert(*id);
                    self.zombie_owner(id).set(owner);
                    *id += 1;
                });
            }

            #[view]
            fn generate_random_dna(&self) -> u64 {
                let mut rand_source = RandomnessSource::new();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                rand_source.next_u64_in_range(0u64, max_dna_value)
            }

            #[endpoint]
            fn create_random_zombie(&self, name: ManagedBuffer) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You already own a zombie"
                );
                let rand_dna = self.generate_random_dna();
                self.create_zombie(caller, name, rand_dna);
            }

            #[event("new_zombie_event")]
            fn new_zombie_event(
                &self,
                #[indexed] zombie_id: usize,
                name: &ManagedBuffer,
                #[indexed] dna: u64,
            );
        }
      "storage.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        #[multiversx_sc::module]
        pub trait Storages {
            #[storage_mapper("dna_digits")]
            fn dna_digits(&self) -> SingleValueMapper<u8>;

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
      "lib.rs": |
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        #[multiversx_sc::contract]
        pub trait ZombieContract
        {
            #[init]
            fn init(&self) {
                self.dna_digits().set(16u8);
            }
        }

    answer: >
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        mod storage;
        mod zombie;
        mod zombiefactory;
        mod zombiefeeding;

        #[multiversx_sc::contract]
        pub trait ZombieContract:
            zombiefactory::ZombieFactory + zombiefeeding::ZombieFeeding + storage::Storage
        {
            #[init]
            fn init(&self) {
                self.dna_digits().set(16u8);
            }
        }

---

Whoa! You'll notice we just cleaned up the code to the right, and you now have tabs at the top of your editor. Go ahead, click between the tabs to try it out.

Our code was getting pretty long, so we split it up into multiple files to make it more manageable. This is normally how you will handle long codebases in your Rust projects.

When you have multiple files and you want to import one file into another, Rust uses the `mod` keyword:

```
mod some_module;
mod some_other_module;
mod my_struct;

use my_struct::MyStruct;

#[multiversx_sc::contract]
pub trait NewContract : some_module::SomeModule +  some_other_module::SomeOtherModule {

}
```

So if we had 2 files named `some_module.rs` and `some_other_module.rs` in the same directory as this contract (that's what the `./` means), it would get imported by the compiler.

In case of our `Zombie` struct just importing the file will not be enough since we will not use it for inheritance, but we simply just use it within our trait, reason why additionally we will need to write `use zombie::Zombie;`, this since our `Zombie` struct will be inside `zombie.rs`.

An important aspect is that inside a crate (solution folder) there must always be 1 and only 1 file that gathers all other ones. A rule for this is to be either `lib.rs` in case of a library usable outside, or the contract trait file in our case.

> Notice : separating our struct and module trait in separate files still requires us to add `multiversx_sc::imports!();` and `multiversx_sc::derive_imports!();` since they use managed types which are not basic Rust elements, but provided by the MultiversX Rust framework.
> Notice: structures don't need to be implemented by the trait, reason why we will not add `zombie::Zombie` to the contract trait definition.
> Notice : the fields of our `Zombie` struct the `name` and the `dna` require now to be public since they are not part of the same file, so their visibility is no longer ensured.


# Put it to the test

Now that we've set up a multi-file structure, we need to import the contents of the other files:

1. Import the other modules into `lib.rs`
   
2. Update the definition of our `ZombieContract` contract supertrait to contain all the other module traits
