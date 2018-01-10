---
title: Gas
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        // Start here

      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          function feedAndMultiply(uint _zombieId, uint _targetDna, string species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
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

            function _createZombie(string _name, uint _dna) internal {
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

      }
---

Up until now, Solidity has looked quite similar to other languages like JavaScript. But there are a number of ways that Ethereum DApps are actually quite different from normal applications. 

First is a very important concept in Ethereum: **_gas_**.

## What is Gas?

In Solidity, your DApp burns a small amount of a currency called "gas" for every line of code it executes.

Writing a variable to storage costs gas. Reading the contents of a variable also costs gas, but significantly less than writing. Doing mathematical operations like `+` and `*` cost a tiny amount of gas, as do comparison operators like `<` and `==`. And so on.

Each operation has a fixed **_gas cost_** based roughly on how much computing power will be required for that operation. The total **_gas cost_** of your function is a sum of the gas costs of its individual steps. So the more complex your function logic is, the more gas needs to be paid to execute it.

## Who pays for gas?

Whoever calls a function on your contract needs to send enough gas to execute it. This means the costs of running your DApp falls on your users. Gas is priced in Ether (the currency on Ethereum), so users can't interact with your DApp without having an Ethereum account and some Ether.

Why is paying gas necessary? Because Ethereum is like a big and slow but extremely secure computer. When you execute a function, every single node on the network needs to run that same function to verify its output — thousands of nodes verifying each function execution is what makes Ethereum decentralized, and its data immutable and censorship-resistant.

The creators of Ethereum wanted to make sure someone couldn't clog up the network with an infinite loop, or hog all the network resources with really intensive computations. So they made it so transactions aren't free, and users have to pay for compute and storage.

> Note: This isn't necessarily true for side chains, like the ones the CryptoZombies authors are building at Loom Network. If users have to pay money for every function they execute on your contract, things can get very expensive very quickly, and some types of games or programs just don't make sense (like DApps with free trials). We'll talk more about what types of DApps you would want to deploy on sidechains vs the Ethereum mainnet in a future lesson.

## Put it to the test

Let's get started with our code for Lesson 3.

We've created a new file for you called `zombiehelper.sol`, which imports from `zombiefeeding.sol`. We'll use this file to add some useful helper methods to our contract throughout Lesson 3.

To start off, create an empty contract called `ZombieHelper` that inherits from `ZombieFeeding`. You can look back at `zombiefeeding.sol` if you don't remember how to do this from Lesson 2.
