---
title: Tömbök
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

      }
---

Amikor valaminek egy gyűjteményére van szükséged, használhatsz egy **_tömböt_**. Két típusú tömb van a Solidity-ben: **_fix_** tömbök és **_dinamikus_** tömbök:

```
// Tömb fix 2 elem hosszúsággal:
uint[2] fixedArray;
// egy másik fix tömb, 5 stringet tartalmazhat:
string[5] stringArray;
// egy dinamikus tömb - nincs fix mérete, folyamatosan növekedhet:
uint[] dynamicArray;
```

Létrehozhatsz tömböt **_struktúrákból_** is. Az előző fejezet `Person` struktúráját használva:

```
Person[] people; // dinamikus tömb, folyamatosan hozzáadhatunk hozzá
```

Emlékszel, hogy az állapot változók véglegesen tárolódnak a blockchainben? Tehát egy ilyen struktúrákból álló dinamikus tömb létrehozása hasznos lehet strukturált adatok tárolásához a szerződésedben, egyfajta adatbázisként.

## Nyilvános tömbök

Egy tömböt `public`-ként deklarálhatsz, és a Solidity automatikusan létrehoz egy **_getter_** metódust hozzá. A szintaxis így néz ki:

```
Person[] public people;
```

Más szerződések ekkor olvashatnák, de nem írhatnák ezt a tömböt. Tehát ez egy hasznos minta nyilvános adatok tárolásához a szerződésedben.

# Tegyük próbára

Az alkalmazásunkban egy zombi sereget szeretnénk tárolni. És szeretnénk bemutatni az összes zombinkat más alkalmazásoknak, tehát nyilvánosnak kell lennie.

1. Hozz létre egy nyilvános tömböt `Zombie` **_struktúrákból_**, és nevezd el `zombies`-nek.
