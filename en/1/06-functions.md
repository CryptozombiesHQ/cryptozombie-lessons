---
title: Function Declarations
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

          // start here

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

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

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[storage_mapper("zombies")]
        fn zombies(&self) -> UnorderedSetMapper<Zombie<Self::Api>>;
      }
---

## Functions in Rust

A function declaration in Rust looks like the following:

```
pub function eat_hamburgers(&self, amount: u32) {

}
```

This is a function named `eat_hamburgers` that takes 2 parameters: a reference to `self` and a `u32`. For now the body of the function is empty. Note that we're specifying the function visibility as `public`. Without the `pub` keyword the function would be private, visible only within the entity that implements it.

What is a reference type you ask?

Well, there are three ways in which you can pass an argument to a Rust function:

 * By value, which means that the ownership over the parameter's value is passes to your function. This blocks the use of the initial parameter once the function call had ended since having it consummed by the function.
 * By reference, which means that your function is borrowing the value of the parameter. Thus, this doesn't allow the function to change the value of the parameter since it is just `borrowed`. Once the function call finished, the ownership of the parameter returns to its initial owner.
 * By mutable reference, which means that your function is borrowing the value of the parameter and gets the permission to change it. Once the function call finished, the ownership of the parameter returns to its initial owner keeping all changes done inside the function.


> Note: It's convention (but not required) to start function parameter variable names with an underscore (`_`) if the parameter is not used within the function. We'll use that convention throughout our tutorial.

You would call this function like so from within trait / struct that implements it:

```
self.eat_hamburgers(100);
```

Like this from outside the trait that implements it:

```
Person::eat_hamburgers(100);
```

Or like this from outside the struct that implements it:

```
person.eat_hamburgers(100);
```

## Creating a structure type object

In Rust creating a structure type object is done very easy:

```
let given_name = ManagedBuffer::from{b"Bob"};
let given_age = 30u32;
let person = Person { name: given_name, age: given_age };
```

If for example you have a variable whose name is matching the structure fiend's than the syntax can be simplified:


```
let name = ManagedBuffer::from{b"Bob"};
let age = 30u32;
let person = Person { name, age };
```
## Putting elements into a UnorderedSetMapper

Adding an element to an `UnorderedSetMapper` is done by the method `insert`:


```
self.persons().insert(new_person);
```

# Put it to the test

In our app, we're going to need to be able to create some zombies. Let's create a function for that.

1. Create a `private` function named `create_zombie`. It should take two parameters: **\_name** (a `ManagedBuffer`), and **\_dna** (a `u64`).

2. Inside the body create a new zombie and put it inside the storage.
