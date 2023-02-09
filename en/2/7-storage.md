---
title: Storage vs Memory (Data location)
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode:
      " zombiefeeding.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        #[multiversx_sc::module]
        pub trait ZombieFeeding {

        }
      "zombie.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();
        
        #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
        pub struct Zombie<M: ManagedTypeApi> {
            pub name: ManagedBuffer<M>,
            pub dna: u64,
        }

        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        mod zombiefeeding;
        mod zombie;

        use zombie::Zombie;

        #[multiversx_sc::contract]
        pub trait ZombieFactory : zombiefeeding::ZombieFeeding{

          #[init]
          fn init(&self) {
            self.dna_digits().set(16u8);
            self.zombies_count().set(1usize);
          }

          fn create_zombie(&self, name: ManagedBuffer, dna: u64) {
              self.zombies_count().update(|id| {
                self.new_zombie_event(*id, &name, dna);
                self.zombies(id).set(Zombie { name, dna });
                *id +=1;
              });
          }

          #[view]
          fn generate_random_dna(&self) -> u64{
              let mut rand_source = RandomnessSource::new();
              let dna_digits = self.dna_digits().get();
              let max_dna_value = u64::pow(10u64, dna_digits as u32);
              rand_source.next_u64_in_range(0u64, max_dna_value)
          }

          #[endpoint]
          fn create_random_zombie(&self, name: ManagedBuffer){
              let caller = self.blockchain().get_caller();
              require!(self.zombies(&caller).len() == 0, "You already own a zombie");
              let rand_dna = self.generate_random_dna();
              self.create_zombie(&caller, name, rand_dna);
          }

          #[event("new_zombie_event")]
          fn new_zombie_event(
              &self, 
              #[indexed] name: &ManagedBuffer, 
              #[indexed] dna: u64,
          );

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
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

In Solidity, there are two locations you can store variables — in `storage` and in `memory`.

**_Storage_** refers to variables stored permanently on the blockchain. **_Memory_** variables are temporary, and are erased between external function calls to your contract. Think of it like your computer's hard disk vs RAM.

Most of the time you don't need to use these keywords because Solidity handles them by default. State variables (variables declared outside of functions) are by default `storage` and written permanently to the blockchain, while variables declared inside functions are `memory` and will disappear when the function call ends.

However, there are times when you do need to use these keywords, namely when dealing with **_structs_** and **_arrays_** within functions:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Seems pretty straightforward, but solidity will give you a warning
    // telling you that you should explicitly declare `storage` or `memory` here.

    // So instead, you should declare with the `storage` keyword, like:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...in which case `mySandwich` is a pointer to `sandwiches[_index]`
    // in storage, and...
    mySandwich.status = "Eaten!";
    // ...this will permanently change `sandwiches[_index]` on the blockchain.

    // If you just want a copy, you can use `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...in which case `anotherSandwich` will simply be a copy of the 
    // data in memory, and...
    anotherSandwich.status = "Eaten!";
    // ...will just modify the temporary variable and have no effect 
    // on `sandwiches[_index + 1]`. But you can do this:
    sandwiches[_index + 1] = anotherSandwich;
    // ...if you want to copy the changes back into blockchain storage.
  }
}
```

Don't worry if you don't fully understand when to use which one yet — throughout this tutorial we'll tell you when to use `storage` and when to use `memory`, and the Solidity compiler will also give you warnings to let you know when you should be using one of these keywords.

For now, it's enough to understand that there are cases where you'll need to explicitly declare `storage` or `memory`!

# Put it to the test

It's time to give our zombies the ability to feed and multiply!

When a zombie feeds on some other lifeform, its DNA will combine with the other lifeform's DNA to create a new zombie.

1. Create a function called `feedAndMultiply`. It will take two parameters: `_zombieId` (a `uint`) and `_targetDna` (also a `uint`). This function should be `public`.

2. We don't want to let someone else feed our zombie! So first, let's make sure we own this zombie. Add a `require` statement to verify that `msg.sender` is equal to this zombie's owner (similar to how we did in the `createRandomZombie` function).

 > Note: Again, because our answer-checker is primitive, it's expecting `msg.sender` to come first and will mark it wrong if you switch the order. But normally when you're coding, you can use whichever order you prefer — both are correct.

3. We're going to need to get this zombie's DNA. So the next thing our function should do is declare a local `Zombie` named `myZombie` (which will be a `storage` pointer). Set this variable to be equal to index `_zombieId` in our `zombies` array.

You should have 4 lines of code so far, including the line with the closing `}`.

We'll continue fleshing out this function in the next chapter!
