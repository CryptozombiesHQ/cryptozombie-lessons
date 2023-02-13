---
title: Zombie Loss 😞
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: rust
    startingCode:
      "zombieattack.rs": |
        multiversx_sc::imports!();

        use crate::{storage, zombie::Zombie, zombiefactory, zombiefeeding, zombiehelper};

        #[multiversx_sc::module]
        pub trait ZombieAttack:
            storage::Storage + zombiefeeding::ZombieFeeding + zombiefactory::ZombieFactory + zombiehelper::ZombieHelper
        {
            fn rand_mod(&self, modulus: usize) -> usize {
                let mut rand_source = RandomnessSource::new();
                rand_source.next_usize() % modulus
            }

            #[endpoint]
            fn attack(&self, zombie_id: usize, target_id: usize) {
                let caller = self.blockchain().get_caller();
                self.check_zombie_belongs_to_caller(zombie_id, &caller);
                let rand = self.rand_mod(100u8);
                let attack_victory_probability = self.attack_victory_probability().get();
                if rand <= attack_victory_probability {
                    self.zombies(&zombie_id).update(|my_zombie| {
                        my_zombie.win_count += 1;
                        my_zombie.level += 1;
                    });

                    let mut enemy_dna = 0;
                    self.zombies(&target_id).update(|enemy_zombie| {
                        enemy_zombie.loss_count += 1;
                        enemy_dna = enemy_zombie.dna;
                    });
                    self.feed_and_multiply(zombie_id, enemy_dna, ManagedBuffer::from(b"zombie"));
                } else {
                    self.zombies(&zombie_id).update(|my_zombie| {
                        my_zombie.loss_count += 1;
                    });

                    self.zombies(&target_id).update(|enemy_zombie| {
                        enemy_zombie.win_count += 1;
                    });
                    self.trigger_cooldown(zombie_id);
                }
            }
        }
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
        pub trait ZombieFeeding: storage::Storage + zombiefactory::ZombieFactory + zombiehelper: ZombieHelper{
            fn feed_and_multiply(&self, zombie_id: usize, target_dna: u64, species: ManagedBuffer) {
                let caller = self.blockchain().get_caller();
                self.check_zombie_belongs_to_caller(zombie_id, &caller);
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
            #[storage_mapper("dna_digits")]
            fn dna_digits(&self) -> SingleValueMapper<u8>;

            #[storage_mapper("zombies_count")]
            fn zombies_count(&self) -> SingleValueMapper<usize>;

            #[view]
            #[storage_mapper("zombies")]
            fn zombies(&self, id: &usize) -> SingleValueMapper<Zombie<Self::Api>>;

            #[storage_mapper("zombie_owner")]
            fn zombie_owner(&self, id: &usize) -> SingleValueMapper<ManagedAddress>;

            #[storage_mapper("crypto_kitties_sc_address")]
            fn crypto_kitties_sc_address(&self) -> SingleValueMapper<ManagedAddress>;

            #[storage_mapper("owned_zombies")]
            fn owned_zombies(&self, owner: &ManagedAddress) -> UnorderedSetMapper<usize>;
            
            #[storage_mapper("level_up_fee")]
            fn level_up_fee(&self) -> SingleValueMapper<BigUint>;

            #[storage_mapper("collected_fees")]
            fn collected_fees(&self) -> SingleValueMapper<BigUint>;

            #[storage_mapper("cooldown_time")]
            fn cooldown_time(&self) -> SingleValueMapper<u64>;

            #[storage_mapper("attack_victory_probability")]
            fn attack_victory_probability(&self) -> SingleValueMapper<u8>;
        }
      "lib.rs": |
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        mod storage;
        mod zombie;
        mod zombiefactory;
        mod zombiefeeding;
        mod zombiehelper;
        mod zombieattack;

        #[multiversx_sc::contract]
        pub trait Adder:
            zombiefactory::ZombieFactory
            + zombiefeeding::ZombieFeeding
            + storage::Storage
            + zombiehelper::ZombieHelper
            + zombieattack::ZombieAttack
        {
            #[init]
            fn init(&self) {
                self.dna_digits().set(16u8);
                self.cooldown_time().set(86400u64);
                self.level_up_fee().set(BigUint::from(1000000000000000u64));
                self.attack_victory_probability().set(70u8);
            }

            #[only_owner]
            #[endpoint]
            fn set_crypto_kitties_sc_address(&self, address: ManagedAddress) {
                self.crypto_kitties_sc_address().set(address);
            }
        }
      "zombiehelper.rs": |
        multiversx_sc::imports!();

          use crate::storage;

          #[multiversx_sc::module]
          pub trait ZombieHelper: storage::Storage {
            fn check_above_level(&self, level: u16, zombie_id: usize) {
                let my_zombie = self.zombies(&zombie_id).get();
                require!(my_zombie.level >= level, "Zombie is too low level");
            }
          
            fn check_zombie_belongs_to_caller(&self, zombie_id: usize, caller: &ManagedAddress) {   
              require!(
                  caller == &self.zombie_owner(&zombie_id).get(),
                  "Only the owner of the zombie can perform this operation"
              );
            }

            #[endpoint]
            fn change_name(&self, zombie_id: usize, name: ManagedBuffer) {
                self.check_above_level(2u16, zombie_id);
                let caller = self.blockchain().get_caller();
                self.check_zombie_belongs_to_caller(zombie_id, &caller);
                self.zombies(&zombie_id)
                    .update(|my_zombie| my_zombie.name = name);
            }

            #[endpoint]
            fn change_dna(&self, zombie_id: usize, dna: u64) {
                self.check_above_level(20u16, zombie_id);
                let caller = self.blockchain().get_caller();
                self.check_zombie_belongs_to_caller(zombie_id, &caller);
                self.zombies(&zombie_id)
                    .update(|my_zombie| my_zombie.dna = dna);
            }
            
            #[payable("EGLD")]
            #[endpoint]
            fn level_up(&self, zombie_id: usize){
                let payment_amount = self.call_value().egld_value();
                let fee = self.level_up_fee().get();
                require!(payment_amount == fee, "Payment must be must be 0.001 EGLD");
                self.zombies(&zombie_id).update(|my_zombie| my_zombie.level += 1);
            }

            #[only_owner]
            #[endpoint]
            fn withdraw(&self) {
            let caller_address = self.blockchain().get_caller();
            let collected_fees = self.collected_fees().get();
            self.send().direct_egld(&caller_address, &collected_fees);
            self.collected_fees().clear();
            }
          }

    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombiehelper.sol";

      contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;
        uint attackVictoryProbability = 70;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        }

        function attack(uint _zombieId, uint _targetId) external ownerOf(_zombieId) {
          Zombie storage myZombie = zombies[_zombieId];
          Zombie storage enemyZombie = zombies[_targetId];
          uint rand = randMod(100);
        }
      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombiehelper.sol";

      contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;
        uint attackVictoryProbability = 70;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        }

        function attack(uint _zombieId, uint _targetId) external ownerOf(_zombieId) {
          Zombie storage myZombie = zombies[_zombieId];
          Zombie storage enemyZombie = zombies[_targetId];
          uint rand = randMod(100);
          if (rand <= attackVictoryProbability) {
            myZombie.winCount++;
            myZombie.level++;
            enemyZombie.lossCount++;
            feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
          } else {
            myZombie.lossCount++;
            enemyZombie.winCount++;
            _triggerCooldown(myZombie);
          }
        }
      }
---

Now that we've coded what happens when your zombie wins, let's figure out what happens when it **loses**.

In our game, when zombies lose, they don't level down — they simply add a loss to their `lossCount`, and their cooldown is triggered so they have to wait a day before attacking again.

To implement this logic, we'll need an `else` statement.

`else` statements are written just like in JavaScript and many other languages:

```
if (zombieCoins[msg.sender] > 100000000) {
  // You rich!!!
} else {
  // We require more ZombieCoins...
}
```

## Put it to the test

1. Add an `else` statement. If our zombie loses:

  a. Increment `myZombie`'s `lossCount`.

  b. Increment `enemyZombie`'s `winCount`.

  c. Run the `_triggerCooldown` function on `myZombie`. This way the zombie can only attack once per day. (Remember, `_triggerCooldown` is already run inside `feedAndMultiply`. So the zombie's cooldown will be triggered whether he wins or loses.)
