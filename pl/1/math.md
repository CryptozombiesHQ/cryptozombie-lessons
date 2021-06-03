---
title: Operacje Matematyczne
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      uint dnaDigits = 16;
      //start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      }
---

Matematyka w Solidity jest całkiem prosta. Następujące operacje są takie same, jak w większości języków programowania:

* Dodawanie: `x + y`
* Odejmowanie: `x - y`,
* Mnożenie: `x * y`
* Dzielenie: `x / y`
* Reszta z dzielenia (modulo) `x % y` *(na przykład, `13 % 5` jest równe `3`, ponieważ jeśli podzielisz 13 przez 5 to zostanie 3 reszty*.

Solidity wspiera również ***operator wykładniczy*** (tj. "x do potęgi y", x^y):

    uint x = 5 ** 2; // jest równe 5^2 = 25
    

# Wypróbujmy zatem

Aby mieć DNA Zombi zbudowane tylko z 16 znaków, zróbmy jeszcze jeden `uint` równy 10^16. W ten sposób, możemy później użyć operatora modulo `%` aby skrócić nasza liczbę całkowitą do 16 cyfr.

1. Stwórz zmienną `uint` o nazwie `dnaModulus`, i ustaw ją równą **10 do potęgi `dnaDigits`**.