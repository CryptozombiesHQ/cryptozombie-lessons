---
title: Arrays
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode: |
      #![no_std]

      mx_sc::imports!();

      struct Zombie<M: ManagedTypeApi> {
          name: ManagedBuffer<M>;
          dna: u32;
      }

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u32>;

      }
    answer: >
      #![no_std]

      mx_sc::imports!();

      struct Zombie<M: ManagedTypeApi> {
          name: ManagedBuffer<M>;
          dna: u32;
      }

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u32>;

        #[storage_mapper("zombies")]
        fn zombies(&self) -> UnorderedSetMapper<Zombie>;
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

You can also create an array of **_structs_**. Using the previous chapter's `Person` struct:

```
let people: ManagedVec<People>; // dynamic Array, we can keep adding to it
```

Always remember that Rust uses generics to define the type of data an array holds.


## Putting it inside storage

When it comes to putting arrays into storage `SingleValueMapper` might not be the bets option for the job, since every time we need something from our list we need to read it all and if an item needs to be changed the whole list needs to be rewritten.

For this kind of situations mappers such as `SetMapper` and `UnorderedSetMapper` were introduced. These mappers behave like arrays and allow access on elements they contain by index and value. The diference between them is that `UnorderedSetMapper` is far more efficient since it stores internally each element's index to provide a `O(1)` search complexity, but the cost of using it relies on the fact that it doesn't provide a sorting of the elements within.

```
  #[storage_mapper("my_list_of_people")]
  fn my_list_of_people(&self) -> UnorderedSetMapper<People>;
```

# Put it to the test

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create storage for a list of `Zombie` **_structs_**, named `zombies`.
