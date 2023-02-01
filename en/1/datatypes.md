---
title: State Variables & Integers
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      #![no_std]

      mx_sc::imports!();

      // start here

      #[mx_sc::contract]
      pub trait ZombieFactory {}

      
    answer: >
      #![no_std]

      mx_sc::imports!();

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<usize>;
      }
---

Great job! Now that we've got a shell for our contract, let's learn about how Rust deals with variables.

**_State variables_** are permanently stored in contract storage. This means they're written to the MultiversX blockchain. Think of them like writing to a DB. The **MultiversX** Rust framework provides various storage mappers you can use. Deciding which one to use for every situation is critical for performance.

For this step we will use a `SingleValueMapper`, but feel free to check the documentation https://docs.multiversx.com/developers/developer-reference/storage-mappers/ if curious about other types.

##### Example:
```
#[mx_sc::contract]
pub trait Example {

  #[init]
  fn init(&self) {
    self.my_size().set(100);
  }

  #[storage_mapper("my_size")]
  fn my_size(&self) -> SingleValueMapper<usize>;
}
```

In this example contract, we stored in our storage a `usize` under the name `my_size` and set it equal to 100. You can spot out that we use a procedural macro `#[storage_mapper("dna_digits")]`that defines our dna_digits function as a storage mapper

## Unsigned Integers: `usize`

The `usize` data type is an unsigned integer, meaning **its value must be non-negative**. 

> Note: In Rust, `usize` is actually an alias for `u32` or `u64` depending on the architecture, a 32 respectively 64-bit unsigned integer. You can declare usize with less bits — `u8`, `u16`, `u32`, etc.. But in general you want to simply use `usize` except in specific cases, which we'll talk about in later lessons.

There are also a couple integer data type for signed integers such as `i8`, `i16`, `i32`, etc..

# Put it to the test

Our Zombie DNA is going to be determined by a 16-digit number.

Declare a `SingleValueMapper<usize>` constant named `DNA_DIGITS`, and set it equal to `16`.
