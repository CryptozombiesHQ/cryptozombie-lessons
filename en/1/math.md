---
title: Math Operations
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode: |
      #![no_std]

      mx_sc::imports!();

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16);
          // set up the storage value here
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u32>;

        // write your storage function here

      }
    answer: >
      #![no_std]

      mx_sc::imports!();

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16);

          let dna_modulus = 10u32.pow(self.dna_digits().get());
          self.dna_modulus().set(dna_modulus);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u32>;

        #[storage_mapper("dna_modulus")]
        fn dna_modulus(&self) -> SingleValueMapper<u32>;
      }

---

Math in Rust is pretty straightforward. The following operations are the same as in most programming languages:

* Addition: `x + y`
* Subtraction: `x - y`,
* Multiplication: `x * y`
* Division: `x / y`
* Modulus / remainder: `x % y` _(for example, `13 % 5` is `3`, because if you divide 5 into 13, 3 is the remainder)_

For raising to a power the operation is done straigth up from the numeric type method `pow` :

```
let x = u32::pow(5, 2); // equal to 5^2 = 25
```

This can alternatively be written

```
let x = 5u32.pow(2); // equal to 5^2 = 25
```

In Rust a very easy way to express the type of a numeric value is by putting the type straigth after the value (for example `10u64`, `42i32`, `5u8`, etc..)

# Reading from storage

Once we have a value set inside the storage we can access it via `.get()`

```
let x = self.my_stored_value().get();
```

# Put it to the test

To make sure our Zombie's DNA is only 16 characters, let's make another `u32` equal to 10^16. That way we can later use the modulus operator `%` to shorten an integer to 16 digits.

1. Create a `SingleValueMapper<u32>`  named `dna_modulus`, and set it equal to **10 to the power of `dna_digits`**.
