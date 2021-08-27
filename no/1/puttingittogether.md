---
title: Sett alt sammen
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

          // start her

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

Vi er nesten ferdig med vår tilfeldige Zombie generator! La oss lage en offentlig funksjon som setter alt sammen.

Vi skal lage en offentlig funksjon som tar inn en input, zombiens navn, og bruker det samme navnet til å lage et tilfeldig DNA.

# Test det

1. Lag en `public` funksjon kalt `createPseudoRandomZombie`. Den kommer til å ta ett parameter kalt  `_name` (en `string`). _(Noter: Deklarer denne funksjonen `public` akkurat som du tidligere deklarerte funksjoner `private`)_

2. Den første linjen med kode burde kjøre  `_generatePseudoRandomDna` funksjonen med `_name`, og lagre den som en  `uint` kalt `randDna`.

3. Den andre linjen bør kjøre `_createZombie` funksjonen og gi den `_name` og `randDna`.

4. Løsningen bør ha 4 linjer med kode (inkludert lukker-braketten `}` til funksjonen).
