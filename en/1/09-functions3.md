---
title: More on Functions
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode: |
      #![no_std]

      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
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

        fn create_zombie(&self, name: ManagedBuffer, dna: u32){
            self.zombies().insert(Zombie{ name, dna })
        }

        #[view]
        fn generate_random_dna(&self, str: ManagedBuffer) -> u32{

        }

        // start here

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u32>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(&self) -> UnorderedSetMapper<Zombie>;
      }
    answer: >
      #![no_std]

      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
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

        fn create_zombie(&self, name: ManagedBuffer, dna: u32){
            self.zombies().insert(Zombie{ name, dna })
        }

        #[view]
        fn generate_random_dna(&self, str: ManagedBuffer) -> u32{

        }

        #[endpoint]
        fn create_random_zombie(&self, name: ManagedBuffer){

        }

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u32>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(&self) -> UnorderedSetMapper<Zombie>;
      }
---

In the MultiversX Rust framework there is another anotation called `#[endpoint]` which is the only way to display a function public for interacting with the contract.

An endpoint would look similar to a basic function but has the `#[endpoint]` proc macro above:

```
#[endpoint]
fn say_hello() -> ManagedBuffer {
  ManagedBuffer::from(b"What's up dog")
}
```

# Put it to the test

We would like to have a way a user to use the contract to create a random dna zombie

1. Create an endpoint named `create_random_zombie`. It will take one parameter named `name` (a `ManagedBuffer`).

2. The function body should be empty at this point — we'll fill it in later.
