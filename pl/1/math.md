---
title: Operacje Matematyczne
actions: ['zaznacz odpowiedź', 'podpowiedź']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //zacznij tutaj

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Matematyczne operacje w Solidity są intuicyjne. Poniższe operacje są takie same jak w większości języków programowania:

* Dodawanie: `x + y`
* Odejmowanie: `x - y`,
* Mnożenie: `x * y`
* dzielenie: `x / y`
* Modulo / reszta z dzielenia: `x % y` _(na przykład, `13 % 5` wynosi `3`, ponieważ jeśli podzielisz 13 przez 5, 3 jest resztą z dzielenia)_

Solidity również wspiera  **_potęgowanie_** (np. "x do potęgi y", x^y):

```
uint x = 5 ** 2; // wynosi 5^2 = 25
```

# Zadanie do wykonania

Aby mieć pewność, że Dna Zombie jest  16 znakowe, stwórzmy dodatkowy `uint` równy 10^16. Będziemy mogli później uzyć operatora `%`, aby skrócić integer do 16 znaków.

1. Stwórz `uint` o nazwie `dnaModulus`, i ustaw ją jako **10 do potęgi `dnaDigits`**.
