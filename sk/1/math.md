---
title: Matematické operácie
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          // začni písať tu

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Matematika v Solidity je celkom priamočiara. Nasledujúce operácie funguju rovnako ako vo väčšine programovacích jazykov:
Math in Solidity is pretty straightforward. The following operations are the same as in most programming languages:


* Sčítavanie: `x + y`
* Odčítavanie: `x - y`,
* Násobenie: `x * y`
* Delenie: `x / y`
* Modulo / zvyšok: `x % y` _(napríklad, `13 % 5` je `3`, pretože keď sa pokúsiš 13 deliť 5timi celočíselne, dostaneš zvyšok 3)_

* Addition: `x + y`
* Subtraction: `x - y`,
* Multiplication: `x * y`
* Division: `x / y`
* Modulus / remainder: `x % y` _(for example, `13 % 5` is `3`, because if you divide 5 into 13, 3 is the remainder)_

Solidity taktiež podporuje **_exponenciálny operátor_** (operáciu "x umocnené y" zapíšeme ako x^y):
Solidity also supports an **_exponential operator_** (i.e. "x to the power of y", x^y):

```
uint x = 5 ** 2; // sa rovná 5^2 = 25
```

# Vyskúšaj si to sám
# Put it to the test

Aby sme si boli istý že Zombie DNA má len 16 znakov, poďme si vyrobiť iný `uint` ktorý bude mať hodnotu 10^16. Potom si s ním možeme pomôcť tak, že použijeme modulo operátor `%` aby sme s ním skrátili číslo Zombie DNA na 16 znakov.
To make sure our Zombie's DNA is only 16 characters, let's make another `uint` equal to 10^16. That way we can later use the modulus operator `%` to shorten an integer to 16 digits.

1. Vytvor `uint` pomenovaný `dnaModulus` a nastav ho na hodnotu **10 na `dnaDigits`**.
1. Create a `uint` named `dnaModulus`, and set it equal to **10 to the power of `dnaDigits`**.
