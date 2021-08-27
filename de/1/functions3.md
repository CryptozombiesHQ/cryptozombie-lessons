---
title: More on Functions
actions:
  - 'checkAnswer'
  - 'hints'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;
      
      struct Zombie {
      string name;
      uint dna;
      }
      
      Zombie[] public zombies;
      
      function _createZombie(string _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      }
      
      // start here
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generatePseudoRandomDna(string _str) private view returns (uint) {
      }
      }
---
In this chapter, we're going to learn about Function ***return values***, and function modifiers.

## Return Values

To return a value from a function, the declaration looks like this:

    string greeting = "What's up dog";
    
    function sayHello() public returns (string) {
      return greeting;
    }
    

In Solidity, the function declaration contains the type of the return value (in this case `string`).

## Function modifiers

The above function doesn't actually change state in Solidity — e.g. it doesn't change any values or write anything.

So in this case we could declare it as a ***view*** function, meaning it's only viewing the data but not modifying it:

    function sayHello() public view returns (string) {
    

Solidity also contains ***pure*** functions, which means you're not even accessing any data in the app. Consider the following:

    function _multiply(uint a, uint b) private pure returns (uint) {
      return a * b;
    }
    

This function doesn't even read from the state of the app — its return value depends only on its function parameters. So in this case we would declare the function as ***pure***.

> Note: It may be hard to remember when to mark functions as pure/view. Luckily the Solidity compiler is good about issuing warnings to let you know when you should use one of these modifiers.

# Put it to the test

We're going to want a helper function that generates a pseudo-random DNA number from a string. 

1. Create a `private` function called `_generatePseudoRandomDna`. It will take one parameter named `_str` (a `string`), and return a `uint`.

2. This function will view some of our contract's variables but not modify them, so mark it as `view`.

3. The function body should be empty at this point — we'll fill it in later.
