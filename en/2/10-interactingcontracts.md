---
title: What Do Zombies Eat?
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: rust
    startingCode:
      "zombiefactory.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::{storages, zombiefactory};

        #[multiversx_sc::module]
        pub trait ZombieFeeding: storages::Storages + zombiefactory::ZombieFactory {
            #[endpoint]
            fn feed_and_multiply(&self, zombie_id: usize, target_dna: u64) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You can only feed your own zombie"
                );
                let my_zombie = self.zombies(&zombie_id).get();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                let verified_target_dna = target_dna % max_dna_value;
                let new_dna = (my_zombie.dna + verified_target_dna) / 2;
                self.create_zombie(caller, ManagedBuffer::from(b"NoName"), new_dna);
            }
        }
      "zombiefactory.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::{storages, zombie::Zombie};

        #[multiversx_sc::module]
        pub trait ZombieFactory: storages::Storages {
            fn create_zombie(&self, owner: ManagedAddress, name: ManagedBuffer, dna: u64) {
                self.zombies_count().update(|id| {
                    self.new_zombie_event(*id, &name, dna);
                    self.zombies(id).set(Zombie { name, dna });
                    self.owned_zombies(&owner).insert(*id);
                    self.zombie_owner(id).set(owner);
                    *id += 1;
                });
            }

            #[view]
            fn generate_random_dna(&self) -> u64 {
                let mut rand_source = RandomnessSource::new();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                rand_source.next_u64_in_range(0u64, max_dna_value)
            }

            #[endpoint]
            fn create_random_zombie(&self, name: ManagedBuffer) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You already own a zombie"
                );
                let rand_dna = self.generate_random_dna();
                self.create_zombie(caller, name, rand_dna);
            }

            #[event("new_zombie_event")]
            fn new_zombie_event(
                &self,
                #[indexed] zombie_id: usize,
                name: &ManagedBuffer,
                #[indexed] dna: u64,
            );
        }
      "storage.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::zombie::Zombie;

        #[multiversx_sc::module]
        pub trait Storages {
            #[view]
            #[storage_mapper("dna_digits")]
            fn dna_digits(&self) -> SingleValueMapper<u8>;

            #[view]
            #[storage_mapper("zombies_count")]
            fn zombies_count(&self) -> SingleValueMapper<usize>;

            #[view]
            #[storage_mapper("zombies")]
            fn zombies(&self, id: &usize) -> SingleValueMapper<Zombie<Self::Api>>;

            #[view]
            #[storage_mapper("zombie_owner")]
            fn zombie_owner(&self, id: &usize) -> SingleValueMapper<ManagedAddress>;

            #[view]
            #[storage_mapper("owned_zombies")]
            fn owned_zombies(&self, owner: &ManagedAddress) -> UnorderedSetMapper<usize>;
        }
      "lib.rs": |
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        mod storages;
        mod zombie;
        mod zombiefactory;
        mod zombiefeeding;

        #[multiversx_sc::contract]
        pub trait ZombiesContract:
            zombiefactory::ZombieFactory + zombiefeeding::ZombieFeeding + storages::Storages
        {
            #[init]
            fn init(&self) {
                self.dna_digits().set(16u8);
            }
        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

It's time to feed our zombies! And what do zombies like to eat most?

Well it just so happens that CryptoZombies love to eat...

**CryptoKitties!** 😱😱😱

(Yes, I'm serious 😆 )

In order to do this we'll need to read the kittyDna from the CryptoKitties smart contract. We can do that because the CryptoKitties data is stored openly on the blockchain. Isn't the blockchain cool?!

Don't worry — our game isn't actually going to hurt anyone's CryptoKitty. We're only *reading* the CryptoKitties data, we're not able to actually delete it 😉

## Interacting with other contracts

For our contract to talk to another contract on the blockchain that we don't own, first we need to define an **_interface_**.

Let's look at a simple example. Say there was a contract on the blockchain that looked like this:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

This would be a simple contract where anyone could store their lucky number, and it will be associated with their Ethereum address. Then anyone else could look up that person's lucky number using their address.

Now let's say we had an external contract that wanted to read the data in this contract using the `getNum` function. 

First we'd have to define an **_interface_** of the `LuckyNumber` contract:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Notice that this looks like defining a contract, with a few differences. For one, we're only declaring the functions we want to interact with — in this case `getNum` — and we don't mention any of the other functions or state variables.

Secondly, we're not defining the function bodies. Instead of curly braces (`{` and `}`), we're simply ending the function declaration with a semi-colon (`;`).

So it kind of looks like a contract skeleton. This is how the compiler knows it's an interface.

By including this interface in our dapp's code our contract knows what the other contract's functions look like, how to call them, and what sort of response to expect.

We'll get into actually calling the other contract's functions in the next lesson, but for now let's declare our interface for the CryptoKitties contract.

# Put it to the test

We've looked up the CryptoKitties source code for you, and found a function called `getKitty` that returns all the kitty's data, including its "genes" (which is what our zombie game needs to form a new zombie!).

The function looks like this:

```
function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
) {
    Kitty storage kit = kitties[_id];

    // if this variable is 0 then it's not gestating
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

The function looks a bit different than we're used to. You can see it returns... a bunch of different values. If you're coming from a programming language like JavaScript, this is different — in Solidity you can return more than one value from a function.

Now that we know what this function looks like, we can use it to create an interface:

1. Define an interface called `KittyInterface`. Remember, this looks just like creating a new contract — we use the `contract` keyword.

2. Inside the interface, define the function `getKitty` (which should be a copy/paste of the function above, but with a semi-colon after the `returns` statement, instead of everything inside the curly braces).
