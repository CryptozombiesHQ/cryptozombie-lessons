---
title: Állapot változók és egész számok
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          //kezdj itt

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Remek munka! Most, hogy van egy vázunk a szerződésünkhöz, tanuljuk meg, hogyan kezeli a Solidity a változókat.

Az **_állapot változók_** véglegesen tárolódnak a szerződés tárolójában. Ez azt jelenti, hogy az Ethereum blockchainre íródnak. Gondolj rájuk úgy, mintha egy adatbázisba írnál.

##### Példa:
```
contract Example {
  // Ez véglegesen tárolódik a blockchainben
  uint myUnsignedInteger = 100;
}
```

Ebben a példa szerződésben létrehoztunk egy `uint` típusú változót `myUnsignedInteger` néven, és 100-ra állítottuk.

## Előjel nélküli egész számok: `uint`

A `uint` adattípus egy előjel nélküli egész szám, ami azt jelenti, hogy **az értéke nem lehet negatív**. Van egy `int` adattípus is előjeles egész számokhoz.

> Megjegyzés: A Solidity-ben a `uint` valójában egy alias a `uint256`-ra, egy 256 bites előjel nélküli egész számra. Kisebb bites uint-okat is deklarálhatsz — `uint8`, `uint16`, `uint32`, stb. De általában egyszerűen a `uint`-ot használd, kivéve specifikus esetekben, amelyekről a későbbi leckékben fogunk beszélni.

# Tegyük próbára

A Zombie DNS-t egy 16 számjegyű szám fogja meghatározni.

Deklarálj egy `uint` típusú változót `dnaDigits` néven, és állítsd be 16-ra.
