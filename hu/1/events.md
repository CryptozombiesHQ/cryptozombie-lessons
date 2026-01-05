---
title: Események
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          // 1. Deklaráld az eseményt itt

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna)); // 2. Tárold a `zombies.push(...) - 1` eredményét egy `id` nevű `uint`-ban
              // 3. Tüzesd az új eseményt
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
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              emit NewZombie(id, _name, _dna);
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

A szerződésünk majdnem kész! Most adjunk hozzá egy **_eseményt_**.

Az **_események_** egy módja annak, hogy a szerződésed kommunikáljon arról, hogy valami történt a blockchainen az alkalmazás frontend-jének, amely "hallgathat" bizonyos eseményekre és cselekedhet, amikor megtörténnek.

Példa:

```
// deklaráljuk az eseményt
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public returns (uint) {
  uint result = _x + _y;
  // tüzesd az eseményt, hogy az alkalmazás tudja, hogy a függvény meghívódott:
  emit IntegersAdded(_x, _y, result);
  return result;
}
```

Az alkalmazás frontend-je ekkor hallgathat az eseményre. Egy JavaScript implementáció így nézne ki:

```
YourContract.IntegersAdded(function(error, result) {
  // csinálj valamit az eredménnyel
})
```

# Tegyük próbára

Szeretnénk egy eseményt, amely értesíti a frontend-et minden alkalommal, amikor egy új zombi létrejött, hogy az alkalmazás megjeleníthesse.

1. Deklarálj egy `event`-et `NewZombie` néven. Át kell adnia a `zombieId`-t (egy `uint`), a `name`-t (egy `string`), és a `dna`-t (egy `uint`).

2. Módosítsd a `_createZombie` függvény első sorát. Szükséged lesz a zombi `id`-jára. Az `array.push()` függvény egy `uint`-ot ad vissza a tömb új hosszával - és mivel a tömb első elemének indexe 0, az `array.push() - 1` lesz az imént hozzáadott zombi indexe. Tárold a `zombies.push() - 1` eredményét egy `id` nevű `uint`-ban, hogy használhasd ezt a `NewZombie` eseményben a következő sorban.

3. A következő sorban tüzesd a `NewZombie` eseményt.

