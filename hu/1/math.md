---
title: Matematikai műveletek
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //kezdj itt

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

A matematika a Solidity-ben elég egyszerű. A következő műveletek ugyanazok, mint a legtöbb programozási nyelvben:

* Összeadás: `x + y`
* Kivonás: `x - y`,
* Szorzás: `x * y`
* Osztás: `x / y`
* Modulus / maradék: `x % y` _(például `13 % 5` az `3`, mert ha 13-at elosztod 5-tel, a maradék 3)_

A Solidity támogatja a **_hatványozási operátort_** is (azaz "x az y-adik hatványon", x^y):

```
uint x = 5 ** 2; // egyenlő 5^2 = 25
```

# Tegyük próbára

Hogy biztosak legyünk, hogy a Zombie DNS-e csak 16 karakter, készítsünk egy másik `uint`-ot, amely egyenlő 10^16-tal. Így később használhatjuk a modulus operátort `%` egy egész szám 16 számjegyre való rövidítéséhez.

1. Hozz létre egy `uint` típusú változót `dnaModulus` néven, és állítsd be **10 a `dnaDigits` hatványára**.
