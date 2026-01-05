---
title: További információk a függvényekről
actions: ['checkAnswer', 'hints']
requireLogin: true
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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          // kezdj itt

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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {

          }

      }
---

Ebben a fejezetben a függvény **_visszatérési értékeiről_** és a függvény módosítóiról fogunk tanulni.

## Visszatérési értékek

Egy függvényből érték visszaadásához a deklaráció így néz ki:

```
string greeting = "What's up dog";

function sayHello() public returns (string memory) {
  return greeting;
}
```

A Solidity-ben a függvény deklaráció tartalmazza a visszatérési érték típusát (ebben az esetben `string`).

## Függvény módosítók

A fenti függvény valójában nem változtatja meg az állapotot a Solidity-ben — pl. nem változtat meg semmilyen értéket vagy nem ír semmit.

Tehát ebben az esetben **_view_** függvényként deklarálhatjuk, ami azt jelenti, hogy csak megtekinti az adatokat, de nem módosítja őket:

```
function sayHello() public view returns (string memory) {
```

A Solidity tartalmaz **_pure_** függvényeket is, ami azt jelenti, hogy még az alkalmazás adatait sem éred el. Nézd meg a következőt:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Ez a függvény még az alkalmazás állapotát sem olvassa — a visszatérési értéke csak a függvény paramétereitől függ. Tehát ebben az esetben a függvényt **_pure_**-ként deklarálnánk.

> Megjegyzés: Nehéz lehet megjegyezni, mikor jelöljük meg a függvényeket pure/view-ként. Szerencsére a Solidity fordító jó figyelmeztetéseket ad, hogy tudasd, mikor kellene használnod ezeket a módosítókat.

# Tegyük próbára

Szeretnénk egy segédfüggvényt, amely egy véletlenszerű DNS számot generál egy stringből.

1. Hozz létre egy `private` függvényt `_generateRandomDna` néven. Egy paramétert vesz `_str` néven (egy `string`), és egy `uint`-ot ad vissza. Ne felejtsd el beállítani a `_str` paraméter adat helyét `memory`-re.

2. Ez a függvény megtekinti a szerződésünk néhány változóját, de nem módosítja őket, tehát jelöld meg `view`-ként.

3. A függvény törzse egyelőre üres legyen — később kitöltjük.
