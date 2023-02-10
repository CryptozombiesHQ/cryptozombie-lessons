---
title: Storage vs Memory (Data location)
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

        // start here

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

        mod storage;
        mod zombie;
        mod zombiefactory;
        mod zombiefeeding;

        #[multiversx_sc::contract]
        pub trait ZombiesContract:
            zombiefactory::ZombieFactory + zombiefeeding::ZombieFeeding + storage::Storage
        {
            #[init]
            fn init(&self) {
                self.dna_digits().set(16u8);
            }
        }
    answer: >
      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      use crate::{storage, zombie::Zombie};

      #[multiversx_sc::module]
      pub trait ZombieFactory: storage::Storage {
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

---

In MultiversX Rust framework, there are two locations you can store variables — in `storage` and in `memory`.

**_Storage_** refers to variables stored permanently on the blockchain. **_Memory_** variables are temporary, and are erased between external function calls to your contract. Think of it like your computer's hard disk vs RAM.

Most of the time you don't need to use these keywords because Solidity handles them by default. State variables (variables declared outside of functions) are by default `storage` and written permanently to the blockchain, while variables declared inside functions are `memory` and will disappear when the function call ends.

The great part in MyltiversX Rust framework is that the variables within storage are easily distinguished from memory variables doe the special annotations.

## Giving access within another module 

When not in that file that manages the solution (`lib.rs`) or the contract trait file giving access to another file is done by also including the `crate` annotation, which indicates that we are refering to the current root folder. A general rule is that if we import a structure inside a module, another module that implements that module will have it recognised, but not usable. 

In other words if we imported the `Zombie` structure inside the Storage module, and `ZombieFactory` would implement `Storage` the Zombie struct type will be deduced inside `ZombieFactory` as well, but `self.zombies(id).set(Zombie { name, dna });` will throw an error by simple fact that `ZombieFactory` doesn't have it itself included.

```
use crate::{my_module, my_other_module, my_struct::MyStruct};

#[multiversx_sc::module]
pub trait NewModule : my_module::MyModule + my_other_module::MyOtherModule {

}
```

# Put it to the test

Since our contract it has been separated into modules and in the future all the modules will require access to the storage in a way or another we separated the storage mappers into another file. This file though doesn't have access to our ZOmbies structure yet. 

1. Import the Zombie structure and the storages trait in `zombiefactory.rs`.

2. Make `ZombieFactory` a supertrait by adding the `Storage` trait to its definition
