---
title: Function Declarations
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          // start here

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

A function declaration in solidity looks like the following:

```
function eatHamburgers(string _name, uint _amount) {

}
```

This is a function named `eatHamburgers` that takes 2 parameters: a `string` and a `uint`. For now the body of the function is empty.

> Note: It's convention (but not required) to start function parameter variable names with an underscore (`_`) in order to differentiate them from global variables. We'll use that convention throughout our tutorial.

You would call this function like so:

```
eatHamburgers("vitalik", 100);
```

# Put it to the test

In our app, we're going to need to be able to create some zombies. Let's create a function for that.

1. Create a function named `createZombie`. It should take two parameters: **\_name** (a `string`), and **\_dna** (a `uint`).

Leave the body empty for now — we'll fill it in later.
