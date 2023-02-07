---
title: Keccak256 and Typecasting
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
            // start here
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
          
          // todo
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

We want our `generate_random_dna` function to return a random `u32`. How can we accomplish this?

Rust has the hash function `keccak256` built in, which is a version of SHA3. A hash function basically maps an input into a random 256-bit hexadecimal number. A slight change in the input will cause a large change in the hash. This function can be accessed like this:

```
let my_keccak = self.crypto().keccak256(my_str);
```
Where `my_str` is a `ManagedBuffer`. The return type of this function is a `ManagedByteArray<Self::Api, 32>` which can be further processed by making into a byte array with `my_keccak.to_byte_array()`. from here we can do a straigth up conversion to  `u32` with `u32::from_be_bytes(my_keccak)` si that we can extract the dna from it.

It's useful for many purposes in MultiversX Rust framework, but for right now we're just going to use it for pseudo-random number generation.


```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
self.crypto().keccak256(ManagedBuffer::from(b"aaaab"));
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
self.crypto().keccak256(ManagedBuffer::from(b"aaaac"));
```

As you can see, the returned values are totally different despite only a 1 character change in the input.

> Note: **Secure** random-number generation in blockchain is a very difficult problem. Our method here is insecure, but since security isn't top priority for our Zombie DNA, it will be good enough for our purposes.

# Put it to the test

Let's fill in the body of our `generate_random_dna` function! Here's what it should do:

1. The first line of code should take the `keccak256` hash of the given ManagedBuffer parameter `str` to generate a pseudo-random hexadecimal, typecast it as a byte array further converting it to a `u32`, and finally store the result in a `u32` called `rand`.

2. We want our DNA to only be 16 digits long (remember our `dna_modulus`?). So the next step in our code should `return` the above value modulus (`%`) `dna_modulus`.
