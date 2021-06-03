---
title: Function Declarations
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

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
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string memory _name, uint _dna) public {

          }

      }
---

A function declaration in solidity looks like the following:

```
function eatHamburgers(string memory _name, uint _amount) public {

}
```

This is a function named `eatHamburgers` that takes 2 parameters: a `string` and a `uint`. For now the body of the function is empty. Note that we're specifying the function visibility as `public`. We're also providing instructions about where the `_name` variable should be stored- in `memory`. This is required for all reference types such as arrays, structs, mappings, and strings.

What is a reference type you ask?

Well, there are two ways in which you can pass an argument to a Solidity function:

 * By value, which means that the Solidity compiler creates a new copy of the parameter's value and passes it to your function. This allows your function to modify the value without worrying that the value of the initial parameter gets changed.
 * By reference, which means that your function is called with a... reference to the original variable. Thus, if your function changes the value of the variable it receives, the value of the original variable gets changed.


> Note: It's convention (but not required) to start function parameter variable names with an underscore (`_`) in order to differentiate them from global variables. We'll use that convention throughout our tutorial.

You would call this function like so:

```
eatHamburgers("vitalik", 100);
```

# Put it to the test

In our app, we're going to need to be able to create some zombies. Let's create a function for that.

1. Create a `public` function named `createZombie`. It should take two parameters: **\_name** (a `string`), and **\_dna** (a `uint`). Don't forget to pass the first argument by value by using the `memory` keyword

Leave the body empty for now — we'll fill it in later.
