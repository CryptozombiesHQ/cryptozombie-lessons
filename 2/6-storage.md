---
title: Storage vs Memory
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Start here

        }
      "zombiefactory.sol": |
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
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

In Solidity, there are two place you can store variables — in `storage` and in `memory`.

**_Storage_** refers to variables stored permanently on the blockchain. **_Memory_** variables are temporary, and are erased between external function calls to your contract. Think of it like your computer's hard disk vs RAM.

Most of the time you don't need to use these keywords, because they're implied by default depending on where you use the variables:

```
contract Sandwiches {
  // variables declared at the contract level are stored permanently in storage
  string theBestSandwich;

  // function parameter `_sandwich` is stored in memory. Will disappear after
  // this function call ends.
  function setTheBest(string _sandwich) {
    // variables declared inside a function are also stored in memory, and will
    // disappear after the function call ends
    string temp = _sandwich + " AND BACON";

    // updates storage variable `theBestSandwich`, saved permanently on the blockchain:
    theBestSandwich = _sandwich;
  }
}
```

However, there are times when you do need to use these keywords, namely when dealing with **_structs_** and **_arrays_** within functions. 

We're not going to go into all the intricacies right now, but here's one case where this issue will come up:

```
contract Sandwiches {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    Sandwich mySandwich = sandwiches[_index];
    // ^ Seems pretty straightforward, but solidity will give you a warning
    // telling you you should explicitly declare `storage` or `memory`.

    // Instead, you should write:
    Sandwich storage mySandwich = sandwiches[_index];
  }
}
```

Notice the `storage` keyword — this tells the Solidity compiler to use a **_storage pointer_** for `mySandwich`. In other words, the variable `mySandwich` is now pointing to `sandwiches[_index]`, and so any changes you make to `mySandwich` will permanently affect what's stored in `sandwiches[_index]`.

Don't worry if you don't fully understand the difference yet — throughout this tutorial we'll tell you when to use `storage` and when to use `memory`, and the Solidity compiler will also give you warnings when you should be using one of these keywords.

# Put it to the test

It's time to give our zombies the ability to feed and multiply!

When a zombie feeds on some other lifeform, its DNA will combine with the other lifeform's DNA to create a new zombie.

1. Create a function called `feedAndMultiply`. It will take two parameters: `_zombieId` (a `uint`) and `_targetDna` (also a `uint`). This function should be `public`.

2. In our function, we're going to need to get this zombie's DNA. So the first thing our function should do is declare a local `Zombie` named `myZombie` (which will be a `storage` pointer). We want to set this variable to be equal to the zombie with ID `_zombieId` in our `zombies` array.

We'll continue fleshing out this function in the next chapter!
