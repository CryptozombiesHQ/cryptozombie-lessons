---
title: Mettere Tutto Insieme
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          // inizia qui

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Abbiamo quasi finito con il nostro generatore casuale di zombi! Creiamo adesso una funzione pubblica che legherà tutto insieme.

Creeremo una funzione pubblica che accetta un input, il nome dello zombi, ed usa il nome per creare un DNA casuale di zombi.

# Facciamo una prova

1. Creare una funzione `public` chiamata `createPseudoRandomZombie`. Ci vorrà un parametro chiamato `_name` (una `string`). _(Nota: dichiara questa funzione `public` proprio come hai dichiarato le funzioni precedenti `private`)_

2. La prima riga dovrebbe eseguire la funzione `_generatePseudoRandomDna` passandogli una stringa `_name` e memorizzarla in un `uint` chiamato `randDna`.

3. La seconda riga dovrebbe eseguire la funzione `_createZombie` passandogli `_name` e `randDna`.

4. La soluzione dovrebbe essere di 4 righe di codice (inclusa la chiusura `}` della funzione).
