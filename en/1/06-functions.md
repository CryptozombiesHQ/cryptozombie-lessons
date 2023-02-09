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
      pub trait ZombiesContract {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
          self.zombies_count().set(1usize);
        }

          // start here

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[storage_mapper("zombies_count")]
        fn zombies_count(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("zombies")]
        fn zombies(&self, id: usize) -> SingleValueMapper<Zombie<Self::Api>>;
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

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies_count().update(|id| {
              self.zombies(id).set(Zombie { name, dna });
              *id +=1;
            });
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;
        
        #[storage_mapper("zombies_count")]
        fn zombies_count(&self) -> SingleValueMapper<usize>;

        #[storage_mapper("zombies")]
        fn zombies(&self, id: &usize) -> SingleValueMapper<Zombie<Self::Api>>;
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
## Using an indexed mapper

Adding an element to an indexed mapper is done just like adding the an element to the normal one, the only difference being the requirement of the index


```
self.persons(id).set(new_person);

```
## Reading the value of a mapper

In order to read the value of a `singleValueMapper` we will use the method `get`:


```
let my_person = self.persons(id).get();

```
## Updating a mapper value

For updating the value of a mapper we can use the `update` method which expects a closure as parameter. You can see the closure as a no name function which we use to access or to process elements in an advaned way within a data type.

```
let name = ManagedBuffer::from{b"Joe"};
let age = 35u32;
let new_person = Person { name, age };

self.persons(id).update(|stored_person| *stored_person = new_person );
```
Here between `||` we will have the storage type which we can access it under what name we waht, following the operation we want to do to it. Inside the closure we can use variables declared outside. 

> Notice: stored_person is a `&Person` (reference to a Person) reason why in order to access its value we need to dereference it with `*`

Note that you can make a more complex closure in which you can make more operations. An example of it would be:

```
let new_number = 42u32;
let mut old_favorite_number = 0u32;

self.favorite_number(id).update(|number| { 
  old_favorite_number = *number;
  *stored_person = new_person;
});
```

The benefit of doing something like this is that we will be more efficient with storage reading and writing since we access the storage of `person` just once for update in stead of 2 times for reading the old value and again for updating it.

# Put it to the test

In our app, we're going to need to be able to create some zombies. Let's create a function for that.
The id of the introduced zombie should be stored in a separate storage of type `SingleValueMapper<usize>` called `zombie_count` that increases every time a new zombie is being added. 
2. Create a function named `create_zombie`. It should take two parameters: **\_name** (a `ManagedBuffer`), and **\_dna** (a `u64`).

3. Inside the body the first line  we will write the update for `zombies_count` which will access its value as `id`. Here id doesn't need to be dereferenced, since we access it as `&usize` for the index of `zombies`.
  
4. Next we create a new zombie and put it inside the storage inder the `id` index.

5. And finally we increase the value of `id` by one, and after we close the closure of the update function.

