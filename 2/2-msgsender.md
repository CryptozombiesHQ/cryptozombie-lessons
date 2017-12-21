---
title: Msg.sender
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

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              // start here
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
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
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

Now that we have our mappings, we'll want to update our `_createZombie` method to assign the zombie to the person who called the function that created it.

In order to do this, we need to use something called `msg.sender`.

## msg.sender

In Solidity, there are certain global variables that are available to all functions. One of these is `msg.sender`, which refers to the `address` of caller of the function.

A function in our contract need to be called from somewhere — either from a user, or from another smart contract. Otherwise our contract wouldn't take any action.  And `msg.sender` lets us access the address of the caller of that function.

```
mapping (address => uint) numbers;

function setMyNumber(uint _myNumber) public {
  // update our `numbers` mapping to store `_myNumber` under `msg.sender`
  numbers[msg.sender] = _myNumber;
}

function whatIsMyNumber() public returns (uint) {
  // retrieve the value stored in the sender's address
  // will be `0` if the sender hasn't called `setMyNumber` yet
  return numbers[msg.sender];
}
```

In this example, anyone could call `setMyNumber` and store a `uint` in our contract, which would be tied to their address. Then when they called `whatIsMyNumber`, they would be returned the `uint` that they stored.

# Put it to the test

Let's update our `_createZombie` method to assign ownership of the zombie to whoever called the function.

1. First, after we get back the new zombie's `id`, let's update our `zombieToOwner` mapping to store `msg.sender` under that `id`.

2. Second, let's increase `ownerZombieCount` for this `msg.sender`. 

In Solidity, you can increase a `uint` just like you can in javascript and other languages:

```
uint number = 0;
number++;
// `number` is now `1`
```

Your final answer for this chapter should be 2 lines of code.
