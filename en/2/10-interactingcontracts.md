---
title: What Do Zombies Eat?
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode:
      "zombiefactory.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::{storages, zombiefactory};

        // start here

        #[multiversx_sc::module]
        pub trait ZombieFeeding: storages::Storages + zombiefactory::ZombieFactory {
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
        }
      "zombiefactory.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::{storages, zombie::Zombie};

        #[multiversx_sc::module]
        pub trait ZombieFactory: storages::Storages {
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
            #[storage_mapper("owned_zombies")]
            fn owned_zombies(&self, owner: &ManagedAddress) -> UnorderedSetMapper<usize>;
        }
      "lib.rs": |
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        mod storages;
        mod zombie;
        mod zombiefactory;
        mod zombiefeeding;

        #[multiversx_sc::contract]
        pub trait ZombiesContract:
            zombiefactory::ZombieFactory + zombiefeeding::ZombieFeeding + storages::Storages
        {
            #[init]
            fn init(&self) {
                self.dna_digits().set(16u8);
            }
        }
    answer: >
      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      use crate::{storages, zombiefactory};

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
      pub trait ZombieFeeding: storages::Storages + zombiefactory::ZombieFactory {
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
---

It's time to feed our zombies! And what do zombies like to eat most?

Well it just so happens that CryptoZombies love to eat...

**CryptoKitties!** 😱😱😱

(Yes, I'm serious 😆 )

In order to do this we'll need to read the kittyDna from the CryptoKitties smart contract. We can do that because the CryptoKitties data is stored openly on the blockchain. Isn't the blockchain cool?!

Don't worry — our game isn't actually going to hurt anyone's CryptoKitty. We're only *reading* the CryptoKitties data, we're not able to actually delete it 😉

## Interacting with other contracts

For our contract to talk to another contract on the blockchain that we don't own, first we need to define an **_Proxy_**.

Let's look at a simple example. Say there was a contract on the blockchain that looked like this:

```
#[multiversx_sc::contract]
pub trait Adder {
   
    ...

    #[endpoint]
    fn add(&self, a: BigUint, b: BigUint) -> BigUint {
        a + b
    }
}
```

This would be a simple contract where you would sum up 2 numbers and returns their sum.

Now let's say we had an external contract that wanted to read the data in this contract using the `add` function. 

First we'd have to define an **_Proxy_** of the `Adder` contract:

```
mod my_adder_proxy {
    multiversx_sc::imports!();

    #[multiversx_sc::proxy]
    pub trait Adder {        
      #[endpoint]
      fn add(&self, a: BigUint, b: BigUint) -> BigUint
    }
}

#[multiversx_sc::contract]
pub trait MyContract {
    
    ...

    #[proxy]
    fn adder_proxy(&self, to: ManagedAddress) -> my_adder_proxy::Proxy<Self::Api>;
}
```
Notice that this looks like defining a contract except the `#[multiversx_sc::proxy]` annotation of the trait and a few other differences. For one, we're only declaring the functions we want to interact with — in this case `add` — and we don't mention any of the other functions or state variables.

Secondly, we're not defining the function bodies. Instead of curly braces (`{` and `}`), we're simply ending the function declaration with a semi-colon (`;`).

So it kind of looks like a contract skeleton. This is how the compiler knows it's an interface.

By including this interface in our dapp's code our contract knows what the other contract's functions look like, how to call them, and what sort of response to expect.

Next we might see inside our contract / module another function with the `#[proxy]` annotation. It looks kind of similar to how we define a storage mapper, except the return type being of type `Proxy` from our proxy module defined before.


# Put it to the test

We've sketched some CryptoKitties source code for you showing how a function `get_kitty` would look like. From here we are interested of its return type which includes its "genes" (which is what our zombie game needs to form a new zombie!).

The `CryptoKitties` contract and our function looks like this:

```
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

[multiversx_sc::contract]
pub trait CryptoKitty {

  ...

  fn get_kitty(&self, id: usize) -> Kitty {
    ...
  }
}
```

The function looks a bit different than we're used to. You can see it returns... a bunch of different values. If you're coming from a programming language like JavaScript, this is different — in Rust you can return more than one value from a function. 

Now that we know what this function looks like, we can use it to create an proxy:

1. Define a module proxy called `crypto_kitties_proxy` and put the `get_kitty` endpoint inside it. Don't forget to add also `multiversx_sc::imports!();` and `multiversx_sc::derive_imports!();` to the proxy module wigether with the `#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]` macro to the `Kitty` struct.

2. Write the proxy function inside the ZombieFeeding module and call it `kitty_proxy`.
