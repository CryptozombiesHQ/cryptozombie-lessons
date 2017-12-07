---
title: Function Declarations
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

        // start here

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

        }

      }
---

An empty function declaration in solidity looks like the following:

```
function eatHamburgers(string _name, uint _amount) {

}
```

This is a function named `eatHamburgers` that takes 2 parameters: a `string` and a `uint`. For now the body of the function is empty.

It's convention (but not required) to put an underscore before the names of function parameter variables to differentiate them from global variables. We'll use that convention throughout our tutorial.

You would call this function like so:

```
eatHamburgers("vitalik", 100);
```

# Put it to the test

In our app, we're going to need to be able to create some zombies.

Create an empty function named `createZombie`. It should take two paramenters: **__name_** (a `string`), and **__dna_** (a `uint`).
