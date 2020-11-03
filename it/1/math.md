---
title: Operazioni Matematiche
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          // inizia qui

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

La matematica in Solidity è piuttosto semplice. Le seguenti operazioni sono le stesse della maggior parte dei linguaggi di programmazione:

* Addizione: `x + y`
* Sottrazione: `x - y`
* Moltiplicazione: `x * y`
* Divisione: `x / y`
* Modulo / Resto: `x % y` _(per esempio, `13 % 5` è `3`, perchè se dividi 13 per 5, il resto è 3)_

Solidity supporta anche un **_operatore esponenziale_** (ovvero "x alla potenza di y", x^y):

```
uint x = 5 ** 2; // uguale a 5^2 = 25
```

# Facciamo una prova

Per assicurarci che il DNA del nostro Zombi abbia solo 16 caratteri, facciamo un altro `uint` uguale a 10^16. In questo modo possiamo in seguito usare l'operatore modulo `%` per abbreviare un numero intero a 16 cifre.

1. Crea un `uint` chiamato` dnaModulus` ed impostalo uguale a **10 alla potenza di `dnaDigits`**.
