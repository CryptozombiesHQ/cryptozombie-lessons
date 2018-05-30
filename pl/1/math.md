---
title: Operacje Matematyczne
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      uint dnaDigits = 16;
      // zacznij tutaj
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      }
---
Matematyka w Solidity jest całkiem prosta. Następujące operacje są takie same, jak w większości języków programowania:

* Dodawanie: `x + y`
* Odejmowanie: `x - y`,
* Mnożenie: `x * y`
* Dzielenie: `x / y`
* Reszta z dzielenia (modulo) `x % y` *(na przykład, `13 % 5` jest równe `3`, ponieważ jeśli podzielisz 13 przez 5 to zostanie 3 reszty*

Solidity also supports an ***exponential operator*** (i.e. "x to the power of y", x^y):

    uint x = 5 ** 2; // equal to 5^2 = 25
    

# Put it to the test

To make sure our Zombie's DNA is only 16 characters, let's make another `uint` equal to 10^16. That way we can later use the modulus operator `%` to shorten an integer to 16 digits.

1. Create a `uint` named `dnaModulus`, and set it equal to **10 to the power of `dnaDigits`**.