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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Náš generátor nahodných zombie je takmer dokončený. Poďme vytvoriť verejnú funkciu ktorá to všetko prepojí dokopy.

Teraz ideme vytvoriť verejnú funkciu ktorá príjma vstup vo forme mena zombie. Na základe mena potom vytvorí nového zombie s náhodným DNA. 

# Vyskúšaj si to sám

1. Vytvor `public` funkciu pomenovanú `createPseudoRandomZombie`. Tá bude príjmať jediný parameter `_name` (typu `string`). _(Poznámka: Deklaruj túto funkciu `public` rovnkým spôsobom, akým si doposiaľ deklaroval ostatné funkcie `private`)_ 

2. Prvý riadok funkcie by mal zavolať funkciu `_generatePseudoRandomDna` s podsunutým argumentom `_name` a uložiť výsledok v `uint`e s názvom `randDna`. 

3. Druhý riadok by mal zavolať funkciu  `_createZombie` a predať jej argumenty `_name` a `randDna`.

4. Riešenie by malo byť 4 riadky kódu dlhé (včetne uzatváracích `}` závoriek na konci funkcie).
