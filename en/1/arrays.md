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
          dna: usize;
      }

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16);

          let dna_modulus = 10usize.pow(self.dna_digits().get())
          self.dna_modulus().set(dna_modulus);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("dna_modulus")]
        fn dna_modulus(&self) -> SingleValueMapper<usize>;
      }
    answer: >
      #![no_std]

      mx_sc::imports!();

      struct Zombie<M: ManagedTypeApi> {
          name: ManagedBuffer<M>;
          dna: usize;
      }

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16);

          let dna_modulus = 10usize.pow(self.dna_digits().get())
          self.dna_modulus().set(dna_modulus);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("dna_modulus")]
        fn dna_modulus(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("zombies")]
        fn zombies(&self) -> SingleValueMapper<ManagedVec<Zombie>>;
      }
---

When you want a collection of something, you can use an **_array_**. There are two types of safe-to-use arrays in Rust: **_fixed_** arrays and **_dynamic_** arrays:

```
// Array with a fixed length of 2 elements:
let fixed_array: ArrayVec<u8, 2>;
// another fixed Array, can contain 5 strings:
let string_array: ArrayVec<ManagedBuffer, 5>;
// a dynamic Array - has no fixed size, can keep growing:
let dynamic_array: ManagedVec<usize>;
```

You can also create an array of **_structs_**. Using the previous chapter's `Person` struct:

```
let people: ManagedVec<People>; // dynamic Array, we can keep adding to it
```

Always remember that Rust uses generics to define the type of data an array holds.


## Putting it inside storage

When it comes to putting complex data types into storage we can still use a `SingleValueMapper` for this job. Keep in mind though that we can do better, but more of that in the future.

```
  #[storage_mapper("my_list_of_people")]
  fn my_list_of_people(&self) -> SingleValueMapper<ManagedVec<People>>;
```

# Put it to the test

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create an array of `Zombie` **_structs_**, and store it inside a storage named `zombies`.
