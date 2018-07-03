---
title: Zmienne Stanu & Integers
actions: ['sprawdźOdpowiedź', 'podpowiedzi']
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

Dobra robota! Teraz kiedy mamy już podstawowy kontrakt, możemy nauczyć się jak Solidity obchodzi się ze zmiennymi.

**_Zmienne stanu_** są permanentnie zapisywane w pamięci kontraktu. Znaczy to mniej więcej tyle, że są zapisane w blockchainie Ethereum. Możesz myśleć o tym jak o zapisywaniu do bazy danych.

##### Przykład:
```
contract Example {
  // To zostanie na zawsze zapisane w blockchainie
  uint myUnsignedInteger = 100;
}
```

W tym przykładowym kontrakcie, stworzyliśmy `uint` o nazwie `myUnsignedInteger` i ustawiliśmy jej wartość na 100.

## Liczby naturalne: `uint`

Zmienna typu `uint` jest liczbą naturalną, to oznacza że, **jej wartość musi być większa od zera**. Istnieje równiez typ `int` przeznaczony dla liczb całkowitych.

> Notatka: W Solidity, `uint` jest aliasem dla `uint256`,  256 bitową liczbą naturalną. Możesz zadeklarować uints z mniejszą liczbą bitów — `uint8`, `uint16`, `uint32`, itd. Najczęściej będziesz używał `uint` z wyjątkiem specyficznych sytuacji, o których opowiemy w następnych lekcjach.

# Zadanie do wykonania

DNA naszego zombie zależy od 16 cyfrowego numeru.

Zadeklaruj `uint` o nazwie `dnaDigits`, oraz ustaw jego wartość na `16`.
