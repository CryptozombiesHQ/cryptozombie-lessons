---
title: Data Types: Mappings and Addresses
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          // declare mappings here

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna));
              NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna));
              NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Let's add ownership to our app, so we can have multiple players in our app who each owns zombies.

To do this, we'll need 2 new data types: `mapping` and `address`.

## Addresses

In Ethereum, an **_address_** points to an account on the Ethereum blockchain. You can think of it like a bank account number — Ethereum accounts can have a balance of Ether (the currency used on the Ethereum blockchain), and they can send and receive Ether to other addresses.

In Ethereum, addresses look like long hexidecimal strings that start with `0x`. Here's an example address:

```
0x0eb818... // TODO: put our address here
// This address belongs to the CryptoZombies team. If you're enjoying
// CryptoZombies you can send us some Ether! ;)
```

We'll get into the nitty gritty of addresses in a later lesson, but for now you only need to understand that **an address is owned by a specific user** (or a smart contract — we'll talk about that later). So we can use it as a unique ID for ownership of our zombies. When a user creates new zombies by interacting with our app, we'll set ownership of those zombies to that Ethereum address.

## Mappings

In Lesson 1 we looked at **_structs_** and **_arrays_**. **_Mappings_** are another way of storing organized data in Solidity.

Defining a `mapping` looks like this:

```
// For a financial app, storing a user's account balance:
mapping(address => uint) public accountBalance;
// could be used to store / lookup usernames based on userId
mapping(uint => string) userIdToName;
```

A mapping is essentially a key-value store for storing and looking up data. In the first example, the key is an `address` and the value is a `uint`, and in the second example the key is a `uint` and the value a `string`.

# Put it to the test

To store zombie ownership, we're going to want 2 mappings: one that keeps track of the address that owns a zombie, and another that keeps track of how many zombies an owner has.

1. Create a mapping called `zombieToOwner`. The key will be a `uint` (we'll store and look up the zombie based on its id) and the value an `address`.

2. Create a mapping called `ownerZombieCount`, where the key is an `address` and the value a `uint`.
