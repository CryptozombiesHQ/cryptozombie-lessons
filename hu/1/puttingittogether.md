---
title: Összerakás
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity  >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          // kezdj itt

      }
    answer: >
      pragma solidity  >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string memory _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Közel vagyunk a véletlenszerű Zombie generátorunk befejezéséhez! Hozzunk létre egy nyilvános függvényt, amely mindent összeköt.

Létre fogunk hozni egy nyilvános függvényt, amely egy bemenetet vesz, a zombi nevét, és a nevet használja egy véletlenszerű DNS-szel rendelkező zombi létrehozásához.

# Tegyük próbára

1. Hozz létre egy `public` függvényt `createRandomZombie` néven. Egy paramétert vesz `_name` néven (egy `string` az adat helyével `memory`-re beállítva). _(Megjegyzés: Deklaráld ezt a függvényt `public`-ként, ahogy az előző függvényeket `private`-ként deklaráltad)_

2. A függvény első sora futtassa a `_generateRandomDna` függvényt a `_name`-en, és tárolja egy `randDna` nevű `uint`-ban.

3. A második sor futtassa a `_createZombie` függvényt és adja át neki a `_name`-t és a `randDna`-t.

4. A megoldásnak 4 sor kódnak kell lennie (beleértve a függvény záró `}`-ját).
