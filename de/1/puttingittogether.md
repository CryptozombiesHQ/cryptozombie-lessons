---
title: Putting It Together
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
      
      function _generatePseudoRandomDna(string _str) private view returns (uint) {
      uint rand = uint(keccak256(_str));
      return rand % dnaModulus;
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
      function _generatePseudoRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createPseudoRandomZombie(string _name) public { uint randDna = _generatePseudoRandomDna(_name); _createZombie(_name, randDna); }
      }
---
We're close to being done with our pseudo-random Zombie generator! Let's create a public function that ties everything together.

We're going to create a public function that takes an input, the zombie's name, and uses the name to create a zombie with pseudo-random DNA.

# Put it to the test

1. Create a `public` function named `createPseudoRandomZombie`. It will take one parameter named `_name` (a `string`). *(Note: Declare this function `public` just as you declared previous functions `private`)*

2. The first line of the function should run the `_generatePseudoRandomDna` function on `_name`, and store it in a `uint` named `randDna`.

3. The second line should run the `_createZombie` function and pass it `_name` and `randDna`.

4. The solution should be 4 lines of code (including the closing `}` of the function).
