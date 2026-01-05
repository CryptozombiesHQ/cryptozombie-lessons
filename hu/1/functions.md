---
title: Függvény deklarációk
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

          function createZombie(string memory _name, uint _dna) public {

          }

      }
---

Egy függvény deklaráció a Solidity-ben így néz ki:

```
function eatHamburgers(string memory _name, uint _amount) public {

}
```

Ez egy `eatHamburgers` nevű függvény, amely 2 paramétert vesz: egy `string`-et és egy `uint`-ot. Egyelőre a függvény törzse üres. Figyeld meg, hogy a függvény láthatóságát `public`-ként adtuk meg. Azt is megadjuk, hogy hol kell tárolni a `_name` változót - a `memory`-ben. Ez minden referencia típusnál kötelező, mint például tömbök, struktúrák, mapping-ek és stringek.

Mi az a referencia típus, kérdezed?

Nos, két módon adhatsz át argumentumot egy Solidity függvénynek:

 * Érték szerint, ami azt jelenti, hogy a Solidity fordító létrehoz egy új másolatot a paraméter értékéről és átadja a függvényednek. Ez lehetővé teszi, hogy a függvényed módosítsa az értéket anélkül, hogy attól kellene tartanod, hogy a kezdeti paraméter értéke megváltozik.
 * Referencia szerint, ami azt jelenti, hogy a függvényedet egy... referencia hívja az eredeti változóhoz. Így ha a függvényed megváltoztatja a kapott változó értékét, az eredeti változó értéke is megváltozik.


> Megjegyzés: Konvenció (de nem kötelező), hogy a függvény paraméter változó neveket aláhúzással (`_`) kezdjük, hogy megkülönböztessük őket a globális változóktól. Ezt a konvenciót használjuk az oktatóanyag során.

Így hívnád ezt a függvényt:

```
eatHamburgers("vitalik", 100);
```

# Tegyük próbára

Az alkalmazásunkban képesnek kell lennünk néhány zombi létrehozására. Hozzunk létre egy függvényt erre.

1. Hozz létre egy `public` függvényt `createZombie` néven. Két paramétert kell vennie: **\_name** (egy `string`), és **\_dna** (egy `uint`). Ne felejtsd el az első argumentumot érték szerint átadni a `memory` kulcsszó használatával

Hagyd üresen a törzset egyelőre — később kitöltjük.
