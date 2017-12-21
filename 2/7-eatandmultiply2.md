---
title: Data Types
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            Zombie storage myZombie = zombies[_zombieId];
            // start here
          }

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
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Let's finish writing the `feedAndMultiply` function.

Now that we have `myZombie` as a reference to our zombie, we can use it to access the different variables in the struct like:

```
myZombie.name;
myZombie.dna;
```

The formula for calculating a new zombie's DNA is simple: It's simply that average between the feeding zombie's DNA and the target's DNA. For example:

```
zombieDna = 2222222222222222;
targetDna = 4444444444444444;
newZombieDna = (zombieDna + targetDna) / 2;
// ^ will be equal to 3333333333333333

# Put it to the test

1. Our function will create a `uint` named `newDna`, and set it equal to the average of `myZombie`'s DNA and `_targetDna`.

2. Once we have the new DNA, let's call `_createZombie`. You can look at the `zombiefactory.sol` tab if you forget which parameters this function needs to call it. Note that it requires a name, so let's set our new zombie's name to "NoName" for now — we can write a function to change zombies' names later.

> Note: For you Solidity whizzes, you may notice a problem with our code here! Don't worry, we'll fix this in the next chapter ;)
