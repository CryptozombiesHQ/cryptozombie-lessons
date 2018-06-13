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


* Sčítavanie: `x + y`
* Odčítavanie: `x - y`,
* Násobenie: `x * y`
* Delenie: `x / y`
* Modulo / zvyšok: `x % y` _(napríklad, `13 % 5` je `3`, pretože keď sa pokúsiš 13 deliť 5timi celočíselne, dostaneš zvyšok 3)_

Solidity taktiež podporuje **_exponenciálny operátor_** (operáciu "x umocnené y" zapíšeme ako x^y):

```
uint x = 5 ** 2; // sa rovná 5^2 = 25
```

# Vyskúšaj si to sám

Aby sme si boli istý že Zombie DNA má len 16 znakov, poďme si vyrobiť iný `uint` ktorý bude mať hodnotu 10^16. Potom si s ním možeme pomôcť tak, že použijeme modulo operátor `%` aby sme s ním skrátili číslo Zombie DNA na 16 znakov.

1. Vytvor `uint` pomenovaný `dnaModulus` a nastav ho na hodnotu **10 na `dnaDigits`**.
