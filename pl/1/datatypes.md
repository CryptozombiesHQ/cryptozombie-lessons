---
title: Zmienne stanu & liczby całkowite (integers)
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      // zacznij tutaj
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16;
      }
---
Dobra robota! Teraz, kiedy mamy już podstawową komórkę naszego kontraktu, poznajmy zmienne w języku Solidity.

***Zmienne stanu*** są trwale przechowywane w pamięci kontraktu. Oznacza to, że są wpisywane do blockchain'u Ethereum. Pomyśl o nich jak o wpisaniu do baz danych.

##### Przykład:

    contract Example {
      // Zostanie to zapisane na stałe w blockchain'ie
      uint myUnsignedInteger = 100;
    }
    

W tym przykładowym kontrakcie, utworzyliśmy zmienną typu `uint` o nazwie `myUnsignedInteger` i ustawiliśmy ją równą liczbie 100.

## Liczby całkowite bez znaku (Unsigned Integers): `uint`

The `uint` data type is an unsigned integer, meaning **its value must be non-negative**. There's also an `int` data type for signed integers.

> Note: In Solidity, `uint` is actually an alias for `uint256`, a 256-bit unsigned integer. You can declare uints with less bits — `uint8`, `uint16`, `uint32`, etc.. But in general you want to simply use `uint` except in specific cases, which we'll talk about in later lessons.

# Put it to the test

Our Zombie DNA is going to be determined by a 16-digit number.

Declare a `uint` named `dnaDigits`, and set it equal to `16`.