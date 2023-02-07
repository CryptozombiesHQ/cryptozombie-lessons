---
title: Putting It Together
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

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies().insert(Zombie { name, dna });
        }

        #[view]
        fn generate_random_dna(&self) -> u64{
            let rand_source = RandomnessSource::new();
            let dna_digits = self.dna_digits().get();
            let max_dna_value = u64::pow(10u64, dna_digits as u32);
            rand_source.next_u64_in_range(0u64, max_dna_value)
        }

        #[endpoint]
        fn create_random_zombie(&self, name: ManagedBuffer){
            // start here
        }

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[view]
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

        #[view]
        fn generate_random_dna(&self) -> u64{
            let rand_source = RandomnessSource::new();
            let dna_digits = self.dna_digits().get();
            let max_dna_value = u64::pow(10u64, dna_digits as u32);
            rand_source.next_u64_in_range(0u64, max_dna_value)
        }

        #[endpoint]
        fn create_random_zombie(&self, name: ManagedBuffer){
            let rand_dna = self.generate_random_dna();
            self.create_zombie(name, rand_dna);
        }

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(&self) -> UnorderedSetMapper<Zombie<Self::Api>>;
      }
---

We're close to being done with our random Zombie generator! Let's create a public function that ties everything together.

We're going to create a public function that takes an input, the zombie's name, to create a zombie with random DNA and that given name.

# Put it to the test

Lets populate the `create_random_zombie` endpoint

1. The first line of the function should run the `generate_random_dna` function on, and store it in an `u64` varialble named `rand_dna`.

2. The second line should run the `create_z_ombie` function and pass it `name` and `rand_dna`.

3. The solution should be 5 lines of code (including the closing `}` of the function and the `#[endpoint]` annotation).
