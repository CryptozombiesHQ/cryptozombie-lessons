---
title: Zombie Cooldowns
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: rust
    startingCode:
      "zombiefeeding.rs": |
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
            fn feed_and_multiply(&self, zombie_id: usize, target_dna: u64, species: ManagedBuffer) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You can only feed your own zombie"
                );
                let my_zombie = self.zombies(&zombie_id).get();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                let verified_target_dna = target_dna % max_dna_value;
                let mut new_dna = (my_zombie.dna + verified_target_dna) / 2;
                if species == ManagedBuffer::from(b"kitty") {
                  new_dna = new_dna - new_dna % 100 + 99
                }
                self.create_zombie(caller, ManagedBuffer::from(b"NoName"), new_dna);
            }

            #[callback]
            fn get_kitty_callback(
              &self, 
              #[call_result] result: ManagedAsyncCallResult<Kitty>,
              zombie_id: usize
            ) {
                match result {
                    ManagedAsyncCallResult::Ok(kitty) => {
                      let kitty_dna = kitty.genes;
                      self.feed_and_multiply(zombie_id, kitty_dna, ManagedBuffer::from(b"kitty"));
                    },
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
      "zombie.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
        pub struct Zombie<M: ManagedTypeApi> {
            pub name: ManagedBuffer<M>,
            pub dna: u64,
            pub level: u16,
            pub ready_time: u64,
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
                    let cooldown_time = self.cooldown_time().get();
                    self.zombies(id).set(Zombie {
                        name,
                        dna,
                        level: 1u16,
                        ready_time: self.blockchain().get_block_timestamp(),
                    });
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
            #[storage_mapper("cooldown_time")]
            fn cooldown_time(&self) -> SingleValueMapper<u64>;

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
                self.cooldown_time().set(86400u64);
            }

            #[only_owner]
            #[endpoint]
            fn set_crypto_kitties_sc_address(&self, address: ManagedAddress) {
                self.crypto_kitties_sc_address().set(address);
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
            fn feed_and_multiply(&self, zombie_id: usize, target_dna: u64, species: ManagedBuffer) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You can only feed your own zombie"
                );
                let my_zombie = self.zombies(&zombie_id).get();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                let verified_target_dna = target_dna % max_dna_value;
                let mut new_dna = (my_zombie.dna + verified_target_dna) / 2;
                if species == ManagedBuffer::from(b"kitty") {
                  new_dna = new_dna - new_dna % 100 + 99
                }
                self.create_zombie(caller, ManagedBuffer::from(b"NoName"), new_dna);
            }

            fn trigger_cooldown(&self, zombie_id: usize) {
                let cooldown_time = self.cooldown_time().get();
                self.zombies(&zombie_id).update(|my_zombie| {
                    my_zombie.ready_time = self.blockchain().get_block_timestamp() + cooldown_time
                });
            }

            #[view]
            fn is_ready(&self, zombie_id: usize) -> bool {
                let my_zombie = self.zombies(&zombie_id).get();
                my_zombie.ready_time <= self.blockchain().get_block_timestamp()
            }

            #[callback]
            fn get_kitty_callback(
              &self, 
              #[call_result] result: ManagedAsyncCallResult<Kitty>,
              zombie_id: usize
            ) {
                match result {
                    ManagedAsyncCallResult::Ok(kitty) => {
                      let kitty_dna = kitty.genes;
                      self.feed_and_multiply(zombie_id, kitty_dna, ManagedBuffer::from(b"kitty"));
                    },
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

Now that we have a `ready_time` property on our `Zombie` struct, let's jump to `zombiefeeding.rs` and implement a cooldown timer.

We're going to modify our `feed_and_multiply` such that:

1. Feeding triggers a zombie's cooldown, and

2. Zombies can't feed on kitties until their cooldown period has passed

This will make it so zombies can't just feed on unlimited kitties and multiply all day. In the future when we add battle functionality, we'll make it so attacking other zombies also relies on the cooldown.

First, we're going to define some helper functions that let us set and check a zombie's `ready_time`.

## Put it to the test 

1. Start by defining a `trigger_cooldown` function. It will take 1 argument, `zombie_id` of type `usize`, 

2. The function body should update the zombies storage setting set `ready_time` to `self.blockchain().get_block_timestamp() + cooldown_time`, where `cooldown_time` is a variable in which we read the value from inside the `cooldown_time` storage mapper

3. Next, create a view called `is_ready`. This function will also take a `zombie_id` of type `usize`. THis function will only have the `#[view]` annotation and return a `bool`.

4. The function body should read inside a variable called `my_zombie` the indicated zombie by `zombie_id` and return `my_zombie.ready_time <= self.blockchain().get_block_timestamp()`, which will evaluate to either `true` or `false`. This function will tell us if enough time has passed since the last time the zombie fed.
