---
title: Private / Public Functions
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
          self.zombies_count().set(1usize);
        }

        fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
            self.zombies_count().update(|id| {
              self.zombies(id).set(Zombie { name, dna });
              *id +=1;
            });
        }

        #[view]
        fn generate_random_dna(&self) -> u64{

        }

        #[view]
        #[storage_mapper("dna_digits")]
        fn dna_digits(&self) -> SingleValueMapper<u8>;

        #[view]
        #[storage_mapper("zombies_count")]
        fn zombies_count(&self) -> SingleValueMapper<usize>;

        #[view]
        #[storage_mapper("zombies")]
        fn zombies(&self, id: &usize) -> SingleValueMapper<Zombie<Self::Api>>;
      }
---

In this chapter, we're going to learn about function **_return values_**, and function modifiers.

## Return Values

To return a value from a function, the declaration looks like this:

```

fn say_hello() -> ManagedBuffer {
  let greeting = ManagedBuffer::from(b"What's up dog");
  return greeting;
}

```
Alternativelly you can leave the returned element as the last line of the function without the delimiter `;` having the same effect as the classic format:

```

function say_hello() -> ManagedBuffer {
  ManagedBuffer::from(b"What's up dog")
}

```

In Rust, the function declaration contains the type of the return value (in this case `ManagedBuffer`) indicated by `->`

## Function modifiers

The above function doesn't actually change state in Rust — e.g. it doesn't change any values or write anything.

So in this case we could declare it as a **#[view]** function, meaning it's only viewing the data but not modifying it. As a good practice storage values usually are declared as **#[view]** as well. Since in Rust the code writing convention is `snake_case` if you desire the name of a certain element be different on blockchain you can always set it so inside the view:

```
#[view(sayHello)]
function say_hello() -> ManagedBuffer {
  ManagedBuffer::from(b"What's up dog")
}
```

# Put it to the test

We're going to want a helper function that generates a random DNA number from a string.

1. Create a `private` function called `generate_random_dna`. It will take no parameter (except the `self`).

2. This function will view some of our contract's variables but not modify them, so mark it as `#[view]`.

3. The function body should be empty at this point — we'll fill it in later.

4. Set the storage values declared before as `#[view]` as well
