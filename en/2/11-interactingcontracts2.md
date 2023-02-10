---
title: Using an Interface
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode:
      "zombiefeeding.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::{storage, zombiefactory};

        mod crypto_kitties_proxy {
            multiversx_sc::imports!();
            multiversx_sc::derive_imports!();

            #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
            pub struct Kitty {
                is_gestating: bool,
                is_ready: bool,
                cooldown_index: u64,
                next_action_at: u64,
                siring_with_id: u64,
                birth_time: u64,
                matron_id: u64,
                sire_id: u64,
                generation: u64,
                genes: u64,
            }

            #[multiversx_sc::proxy]
            pub trait CryptoKitties {
                #[endpoint]
                fn get_kitty(&self, id: usize) -> Kitty;
            }
        }

        #[multiversx_sc::module]
        pub trait ZombieFeeding: storage::Storage + zombiefactory::ZombieFactory {
            #[endpoint]
            fn feed_and_multiply(&self, zombie_id: usize, target_dna: u64) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You can only feed your own zombie"
                );
                let my_zombie = self.zombies(&zombie_id).get();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                let verified_target_dna = target_dna % max_dna_value;
                let new_dna = (my_zombie.dna + verified_target_dna) / 2;
                self.create_zombie(caller, ManagedBuffer::from(b"NoName"), new_dna);
            }

            #[proxy]
            fn kitty_proxy(&self, to: ManagedAddress) -> crypto_kitties_proxy::Proxy<Self::Api>;
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
      "storage.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::zombie::Zombie;

        #[multiversx_sc::module]
        pub trait Storages {
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
            #[storage_mapper("crypto_kitties_sc_address")]
            fn crypto_kitties_sc_address(&self) -> SingleValueMapper<ManagedAddress>;

            #[view]
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

      use crate::{storage, zombiefactory};
      use crypto_kitties_proxy::Kitty;

      mod crypto_kitties_proxy {
          multiversx_sc::imports!();
          multiversx_sc::derive_imports!();

          #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
          pub struct Kitty {
              pub is_gestating: bool,
              pub is_ready: bool,
              pub cooldown_index: u64,
              pub next_action_at: u64,
              pub siring_with_id: u64,
              pub birth_time: u64,
              pub matron_id: u64,
              pub sire_id: u64,
              pub generation: u64,
              pub genes: u64,
          }

          #[multiversx_sc::proxy]
          pub trait CryptoKitties {
              #[endpoint]
              fn get_kitty(&self, id: usize) -> Kitty;
          }
      }

      #[multiversx_sc::module]
      pub trait ZombieFeeding: storage::Storage + zombiefactory::ZombieFactory {
          #[endpoint]
          fn feed_and_multiply(&self, zombie_id: usize, target_dna: u64) {
              let caller = self.blockchain().get_caller();
              require!(
                  self.owned_zombies(&caller).is_empty(),
                  "You can only feed your own zombie"
              );
              let my_zombie = self.zombies(&zombie_id).get();
              let dna_digits = self.dna_digits().get();
              let max_dna_value = u64::pow(10u64, dna_digits as u32);
              let verified_target_dna = target_dna % max_dna_value;
              let new_dna = (my_zombie.dna + verified_target_dna) / 2;
              self.create_zombie(caller, ManagedBuffer::from(b"NoName"), new_dna);
          }

          #[callback]
          fn get_kitty_callback(
            &self, 
            #[call_result] result: ManagedAsyncCallResult<Kitty>,
            zombie_id: usize
          ) {
              match result {
                  ManagedAsyncCallResult::Ok(kitty) => {},
                  ManagedAsyncCallResult::Err(_) => {},
              }
          }

          #[endpoint]
          fn feed_on_kitty(
            &self, 
            zombie_id: usize,
            kitty_id: usize,
          ) {
            let crypto_kitties_sc_address = self.crypto_kitties_sc_address().get();
              self.kitty_proxy(crypto_kitties_sc_address)
                  .get_kitty(kitty_id)
                  .async_call()
                  .with_callback(self.callbacks().get_kitty_callback(zombie_id))
                  .call_and_exit();
          }
          #[proxy]
          fn kitty_proxy(&self, to: ManagedAddress) -> crypto_kitties_proxy::Proxy<Self::Api>;
      }
---

Continuing our previous example with `NumberInterface`, once we've defined the interface as:

A part of our contract that used this proxy would look like this:

```
    #[endpoint]
    fn call_adder_and_save_sum(&self) {
      let caller = self.blockchain().get_caller();
      let adder_contract_address = self.adder_contract_address().get();
      self.adder_proxy(adder_contract_address)
          .add(Biguint::from(2u32), Biguint::from(2u32))
          .async_call()
          .with_callback(self.callbacks().add_callback(&caller))
          .call_and_exit();
    }

    #[callback]
    fn add_callback(
      &self, 
      #[call_result] result: ManagedAsyncCallResult<BigUint>,
      caller: &ManagedAddress
    ) {
        match result {
            ManagedAsyncCallResult::Ok(sum) => {
                self.sum(caller).set(sum);
            },
            ManagedAsyncCallResult::Err(_) => {
                // this can only fail if the adder contract address is invalid
                // nothing to revert in case of error
            },
        }
    }

    #[view(getSum)]
    #[storage_mapper("sum")]
    fn adder_contract_address(&self) -> SingleValueMapper<ManagedAddress>;

    #[view(getSum)]
    #[storage_mapper("sum")]
    fn sum(&self, caller: &ManagedAddress) -> SingleValueMapper<BigUint>;

```

When calling another contract depending if both contracts are on same shard or on diferent shards we can make a direct call or a asynchronus call to one of their endpoints. In this context we can assume that the contracts are on diferent shards, reason why we used `async_call`.

Since we are talking about asynchronus call we have no idea when we will recieve a response from the other contract (or if we will), reason why we will attach to this call another type of function defined by us, a callback which when will receive the result he will do something with it. The result is basically a fancy looking option with the result type of the called endpoint as a content or an error which in this case we will just ignore. A callback is just a basic function having the `#[callback]` annotation.

# Put it to the test

Let's set up our contract to read from the CryptoKitties smart contract!
I've created a storage mapper named `crypto_kitties_sc_address` in which the address of the CryptoKitties contract will be saved. 

1. Under the `feed_and_multiply` endpoint create a callback called `get_kitty_callback` that will take 1 `usize` parameter `zombie_id` (besides the result marked with `#[call_result]` of course). Fill the match just like in the example abuve but by leaving both case block empty for now. Be careful for the return type of the result  `#[call_result] result: ManagedAsyncCallResult<Kitty>` and to import the `Kitty` struct inside the zombiefeeding module (add `use crypto_kitties_proxy::Kitty;` just under `use crate::{storage, zombiefactory};`)
   
2. create another endpoint called `feed_on_kitty`. It will take 2 `usize` parameters, `zombie_id` and `kitty_id`.

3. Inside this function get the address of the crypto kitties contract and call the `get_kitty` proxy function  (giving it `kitty_id` as parameter) with asynchronus call and callback on the callback defined before (giving it `zombie_id` as parameter).

