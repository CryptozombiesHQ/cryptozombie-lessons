---
title: Struktúrák
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

      }
---

Néha összetettebb adattípusra van szükséged. Erre a Solidity **_struktúrákat_** biztosít:

```
struct Person {
  uint age;
  string name;
}

```

A struktúrák lehetővé teszik, hogy összetettebb adattípusokat hozz létre több tulajdonsággal.

> Figyeld meg, hogy most mutattunk be egy új típust, a `string`-et. A stringek tetszőleges hosszúságú UTF-8 adatokhoz használatosak. Pl. `string greeting = "Hello world!"`

# Tegyük próbára

Az alkalmazásunkban szeretnénk létrehozni néhány zombit! És a zombiknak több tulajdonságuk lesz, tehát ez tökéletes használati eset egy struktúrához.

1. Hozz létre egy `struct`-ot `Zombie` néven.

2. A `Zombie` struktúránk 2 tulajdonsággal fog rendelkezni: `name` (egy `string`), és `dna` (egy `uint`).
