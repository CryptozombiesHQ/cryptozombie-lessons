---
title: Putting It Together
actions: ['checkAnswer', 'hints']
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          // začni písať tu

      }
    answer: >
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

Náš generátor nahodných zombie je takmer dokončený. Poďme vytvoriť verejnú funkciu ktorá to všetko prepojí dohromy.
We're close to being done with our random Zombie generator! Let's create a public function that ties everything together.

Teraz ideme vytvoriť public funkciu ktorá príjma vstup vo forme mena zombie. Na základe mena potom vytvorí nového zombie s náhodným DNA. 
We're going to create a public function that takes an input, the zombie's name, and uses the name to create a zombie with random DNA.

# Vyskúšaj si to sám
# Put it to the test

1. Vytvor `public` funkciu pomenovanú `createRandomZombie`. Táto bude príjmať jediný parameter `_name` (typu `string`). _(Poznámka: Deklaruj túto funkciu `public` rovnkým spôsobom ako si doposiaľ deklaroval ostatné funkcie `private`)_ 
1. Create a `public` function named `createRandomZombie`. It will take one parameter named `_name` (a `string`). _(Note: Declare this function `public` just as you declared previous functions `private`)_

2. Prvý riadok funkcie by mal zavolať funkciu `_generateRandomDna` s podsunutým argumentom `_name` a uložiť výsledok v `uint`e pomenovanom `randDna`. 
2. The first line of the function should run the `_generateRandomDna` function on `_name`, and store it in a `uint` named `randDna`.

3. Druhý riadok by mal zavolať funkciu  `_createZombie` a predať jej argumenty `_name` a `randDna`.
3. The second line should run the `_createZombie` function and pass it `_name` and `randDna`.

4. Riešenie by malo byť 4 riadky kódu dlhé (včetne uzatváracích `}` závoriek na konci funkcie).
4. The solution should be 4 lines of code (including the closing `}` of the function).
