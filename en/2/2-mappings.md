---
title: Mappings and Addresses
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
        }

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies().insert(Zombie { name, dna });
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
            let rand_dna = self.generate_random_dna();
            self.create_zombie(name, rand_dna);
        }

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(&self) -> UnorderedSetMapper<Zombie<Self::Api>>;
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
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
        }

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies().insert(Zombie { name, dna });
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
            let rand_dna = self.generate_random_dna();
            self.create_zombie(name, rand_dna);
        }

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(
            &self,
            owner: &ManagedAddress
        ) -> UnorderedSetMapper<Zombie<Self::Api>>;
      }
---

Let's make our game multi-player by giving the zombies in our database an owner.

To do this, we'll need a way to link zombies to users.

## Addresses

The MultiversX blockchain is made up of **_accounts_**, which you can think of like bank accounts. An account has a balance of **_EGLD_** (the currency used on the MultiversX blockchain), and you can send and receive EGLD payments to other accounts, just like your bank account can wire transfer money to other bank accounts.

Each account has an `address`, which you can think of like a bank account number. It's a unique identifier that points to that account, and it looks like this:

`erd1njqj2zggfup4nl83x0nfgqjkjserm7mjyxdx5vzkm8k0gkh40ezqtfz9lg`

We'll get into the nitty gritty of addresses in a later lesson, but for now you only need to understand that **an address is owned by a specific user** (or a smart contract).

So we can use it as a unique ID for ownership of our zombies. When a user creates new zombies by interacting with our app, we'll set ownership of those zombies to the Ethereum address that called the function.

## Mappings

In Lesson 1 we looked at **structs** and **storages**. When it comes to mapping an address to an entity storages are the best way to do this as well.
This element looks like:

```
// For a financial app, storing a uint that holds the user's account balance:
#[storage_mapper("account_balance")]
    fn account_egld_balance(
        &self,
        user: &ManagedAddress,
    ) -> SingleValueMapper<BigUint>;
// Or could be used to store / lookup usernames (herotags)
#[storage_mapper("herotag")]
    fn herotag(
        &self,
        user: &ManagedAddress,
    ) -> SingleValueMapper<ManagedBuffer>;
```

A mapping is essentially a key-value store for storing and looking up data. In the first example, the key is an `address` and the value is a `BigUint`, and in the second example the key is a `address` and the value a `ManagedBuffer`.

Addresses in MultiversX Rust framework are used with the ManagedAddress data type as seen in the example above. Notice that we are not accessing an account by bey being straigth up a `ManagedAddress`, but rather a reference to it. In Rust ownership is important as we discussed in lesson 1 so we will try as much as possible not to clone unnecessary data when it can be reused.

# Put it to the test

To store zombie ownership, we're going to use two mappings: one that keeps track of the address that owns a zombie, and another that keeps track of how many zombies an owner has.

1. Update the `zombies` storage setting an account to it. For now on we will have an `UnorderedStorageMapper` for each account.

> Note: at any time one may call `self.zombies(&address).len()` to see the number of zombies an account has.
