---
title: Połączmy wszystko
actions: ['zaznacz odpowiedź', 'podpowiedź']
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

          // zacznij tutaj

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

Jesteśmy blisko stworzenia losowego generatora Zombie! Stwórzmy publiczną funkcję która powiąże wszystko razem.

Zamierzamy stworzyś publiczna funkcję która na wejściu dostanie imi zombie. Następnie użyje tego imienia do stworzenia zombie z losowym DNA.

# Zadanie do wykonania

1. Stwórz `public` funkcję o nazwie `createPseudoRandomZombie`. Powinna przyjmować jeden parametr `_name` (`string`). _(Notatka: Zadeklaruj tą funkcję jako `public` tak samo jak deklarowałeś poprzednie funkcje typu `private`)_

2. Pierwsza linijka funkcji powinna wywołać funkcję `_generatePseudoRandomDna` na zmiennej `_name`, oraz zapisać ją jako `uint` o nazwie `randDna`.

3. Druga linijka powinna wywołaś funkcję `_createZombie` ze zmiennymi `_name` oraz `randDna`.

4. Rozwiązanie powinno być napisane w 4 linijkach kodu (włączając w to zamykający tag `}`).
