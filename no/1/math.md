---
title: Matematikkoperasjoner
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //start her

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Matte i Solidity er ganske rett frem. De følgende operasjonen er de samme som i de fleste programmeringsspråk:

* Addisjon: `x + y`
* Subtraksjon: `x - y`,
* Multiplikasjon: `x * y`
* Divisjon: `x / y`
* Modulus / rest: `x % y` _(for eksempel, `13 % 5` er `3`, fordi hvis du deler 5 på 13, 3 er resten)_

Solidity støtter også **_eksponentielle operatorer_** (f.eks. "x til kraften av y", x^y):

```
uint x = 5 ** 2; // er lik 5^2 = 25
```

# Test det

For å være sikker på at vår Zombies DNA bare har 16 sifre, la oss lage en annen `uint` lik 10^16. På denne måten kan vi senere bruke modulus operatoren `%` for å forkorte integeren til 16 sifre.

1. Lag en `uint` kalt `dnaModulus`, og sett den lik til **10 til kraften av `dnaDigits`**.
