---
title: Arrays
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
      pub trait ZombiesContract {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
        }
    
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        // start here
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

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[storage_mapper("zombies_count")]
        fn zombies_count(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("zombies")]
        fn zombies(&self, id: usize) -> SingleValueMapper<Zombie<Self::Api>>;
      }
---

When you want a collection of something, you can use an **_array_**. There are two types of safe-to-use arrays in Rust: **_fixed_** arrays and **_dynamic_** arrays:

```
// Array with a fixed length of 2 elements:
let fixed_array: ArrayVec<u8, 2>;
// another fixed Array, can contain 5 strings:
let string_array: ArrayVec<ManagedBuffer, 5>;
// a dynamic Array - has no fixed size, can keep growing:
let dynamic_array: ManagedVec<u32>;
```

You can also create an array of **_struct_**. Using the previous chapter's `Person` struct:

```
let people: ManagedVec<Person>; // dynamic Array, we can keep adding to it
```

Always remember that Rust uses generics to define the type of data an array holds.


## Putting it inside storage

When it comes to putting arrays into storage, a simple `SingleValueMapper` can be enough if we introduce an index that gives us the id of the entity. In this way we can use a simple storage value as an indexed element to access any data type..

```
  #[storage_mapper("my_people")]
  fn people(&self, id: usize) -> SingleValueMapper<Person<Self::Api>>;
```

Remember we mentioned the contract already is aware of managed types? It can be accessed wth: `Self::Api` in stead of `M: ManagedTypeApi`.

# Put it to the test

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create another unindexed `SingleValueMapper` storage named `zombies_count`and set it up with `1usize` the init

2. Create a indexed storage for a `Zombie` **_structs_**, named `zombies`.

