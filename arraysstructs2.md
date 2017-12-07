---
title: Working With Arrays and Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 10;
        uint dnaModulus = 10 ** dnaDigits;

        struct Zombie {
          uint dna;
          string name;
        }

        Zombie[] public zombies;

        function createZombie(string _name, uint _dna) {
          // start here
        }

      }
    answer: >
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 10;
        uint dnaModulus = 10 ** dnaDigits;

        struct Zombie {
          uint dna;
          string name;
        }

        Zombie[] public zombies;

        function createZombie(string _name, uint _dna) {
          zombies.push(Zombie(_name, _dna));
        }

      }
---

Solidity's code is encapsulated in contracts. A contract is basically...

```
// Interacting with fixed-length arrays:
fixedArray[0] = 2;
fixedArray[1] = 3; // fixedArray is now [2, 3]
fixedArray[2] = 4; // throws an error, since array is fixed
fixedArray.length; // equal to 2
fixedArray[1]; // equal to 3

// Interacting with dynamic arrays:
dynamicArray[0] = 2; // this will fail...
dynamicArray.length; // ...because this is equal to 0
dynamicArray.length = 3; // this is legal with dynamic arrays
dynamicArray[0] = 2; // this works now!
dynamicArray.push(3); // this also works
// dynamicArray now equal to [2, 3]
dynamicArray.length; // now equal to 2
```

```
// Both of the following are valid ways to create a struct;
Person satoshi = Person(172, "Satoshi");
Person vitalik = Person({name: "Vitalik", age: 16});

// How to access the data:
uint age = satoshi.age;
string name = satoshi.name;
```


# Put it to the test

