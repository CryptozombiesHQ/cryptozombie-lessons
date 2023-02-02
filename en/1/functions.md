---
title: Function Declarations
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

          let dna_modulus = 10usize.pow(self.dna_digits().get());
          self.dna_modulus().set(dna_modulus);
        }

          // start here

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("dna_modulus")]
        fn dna_modulus(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("zombies")]
        fn zombies(&self) -> UnorderedSetMapper<Zombie>;
      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string memory _name, uint _dna) public {

          }

      }
---

A function declaration in Rust looks like the following:

```
public function eat_hamburgers(&self, amount: usize) {

}
```

This is a function named `eat_hamburgers` that takes 2 parameters: a reference to `self` and a `usize`. For now the body of the function is empty. Note that we're specifying the function visibility as `public`. 

What is a reference type you ask?

Well, there are three ways in which you can pass an argument to a Rust function:

 * By value, which means that the ownership over the parameter's value is passes to your function. This blocks the use of the initial parameter once the function call had ended since having it consummed by the function.
 * By reference, which means that your function is borrowing the value of the parameter. Thus, this doesn't allow the function to change the value of the parameter since it is just `borrowed`. Once the function call finished, the ownership of the parameter returns to its initial owner.
 * By mutable reference, which means that your function is borrowing the value of the parameter and gets the permission to change it. Once the function call finished, the ownership of the parameter returns to its initial owner keeping all changes done inside the function.


> Note: It's convention (but not required) to start function parameter variable names with an underscore (`_`) if the parameter is not used within the function. We'll use that convention throughout our tutorial.

You would call this function like so:

```
person.eat_hamburgers(100);
```

# Put it to the test

In our app, we're going to need to be able to create some zombies. Let's create a function for that.

1. Create a `public` function named `create_zombie`. It should take two parameters: **\_name** (a `ManagedBuffer`), and **\_dna** (a `usize`).

Leave the body empty for now — we'll fill it in later.
