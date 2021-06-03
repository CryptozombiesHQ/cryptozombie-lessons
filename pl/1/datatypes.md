---
title: Zmienne stanu & liczby całkowite (integers)
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      //start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16;
      }
---

Dobra robota! Teraz, kiedy mamy już podstawowy szablon naszego kontraktu, poznajmy zmienne w języku Solidity.

***Zmienne stanu*** są trwale przechowywane w pamięci kontraktu. Oznacza to, że są wpisywane do blockchain'u Ethereum. Pomyśl o nich jak o wpisaniu do baz danych.

##### Przykład:

    contract Example {
      // Zostanie to zapisane na stałe w blockchain'ie
      uint myUnsignedInteger = 100;
    }
    

W tym przykładowym kontrakcie, utworzyliśmy zmienną typu `uint` o nazwie `myUnsignedInteger` i ustawiliśmy ją równą liczbie 100.

## Liczby całkowite bez znaku (Unsigned Integers): `uint`

Typ danych `uint`, jest typem, który nazywamy jako unsigned integer, oznacza to, że **jego wartość musi być nieujemna**. Występuje również typ `int`, który przyjmuje wartości zarówno ujemne jak i dodatnie.

> Uwaga: W Solidity, `uint` jest tak właściwie inaczej nazwanym typem `uint256` (256-bitowym typem unsigned integer). Możesz zadeklarować mniejszą ilośc bitów — `uint8`, `uint16`, `uint32`, itd.. Lecz zazwyczaj będziesz uzywał po prostu `uint` z wyjątkiem pewnych przypadków, o których porozmawiach w późniejszych lekcjach.

# Wypróbujmy zatem

DNA naszego Zombiaka będzie określone poprzez 16-cyfrowy numer.

Zadeklaruj `uint`, nazwij jako `dnaDigits` i ustaw równe `16`.