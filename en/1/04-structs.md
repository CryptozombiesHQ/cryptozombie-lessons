---
title: Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode: |
      #![no_std]

      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      // start here

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;
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

      #[mx_sc::contract]
      pub trait ZombieFactory {

        #[init]
        fn init(&self) {
          self.dna_digits().set(16u8);
        }

        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;
      }
---

# The dynamic allocation problem

Many basic Rust types (like String and Vec<T>) are dynamically allocated on the heap. In simple terms, it means the program (in this case, the smart contract) keeps asking for more and more memory from the runtime environment (the VM). For small collections, this doesn't matter much, but for bigger collection, this can become slow and the VM might even stop the contract and mark the execution as failed.

The managed types work by only storing a handle within the contract memory, which is a u32 index, while the actual payload resides in reserved VM memory. More information about this can be found in **MultiversX**'s documentation https://docs.multiversx.com/developers/best-practices/the-dynamic-allocation-problem/

> Note that we just introduced a new type, `ManagedBuffer` which is **MultiversX**s approach of dealing with datatypes such as `string`. Ex. `let greeting = ManagedBuffer::from(b"Hello world!");`

# Structs

Sometimes you need a more complex data type. For this, Rust provides **_structs_**:

```
#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
struct Person<M: ManagedTypeApi> {
  age: u8;
  name: ManagedBuffer<M>;
}

```

Structs allow you to create more complicated data types that have multiple properties.
You will also notice that our struct has a generic argument `<M: ManagedTypeApi>` with a restriction, which is telling us that this structure uses a managed data type. What we can say for now is that whenever a struct or another datatype that contains managed data types is defined this generic with the restriction needs to be added, since the managed type also requires it as seed in the example above.

The scarry part of this declaration though is the procedural macro `#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]`. You can just take it as it is, since it is just a set of implementations for our stucture type to help with the serialization and deserialization. what we can say is that for now we will just add it to every structure type or enumerator written by smart contract developers. 

> Note that the contract already is aware of managed types, reason why using the generic to indicate it is not required.

# Put it to the test

In our app, we're going to want to create some zombies! And zombies will have multiple properties, so this is a perfect use case for a struct.

1. Create a `struct` named `Zombie`.

2. Our `Zombie` struct will have 2 properties: `name` (a `ManagedBuffer`), and `dna` (a `u64`).
