---
title: Status variabler og integers
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //start her

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Godt jobbet! Nå som vi har laget et skjellett til kontrakten, la oss lære om hvordan Solidity jobber med variabler.

**_Status variabler_**er permanent lagret i kontrakt-lagringsplass. Dette betyr at de blir lagret i Ethereum blockchain-en. Tenk på dem som om du lagrer til en database.

##### Eksempel:
```
contract Example {
  // Dette blir lagret direkte til blockchainen
  uint myUnsignedInteger = 100;
}
```

I denne eksempel kontrakten har vi laget en `uint` kalt `myUnsignedInteger` som er satt til 100.

## Usignert Integers: `uint`

`uint` datatypen er en usignert integer, som betyr **verdien må være positiv**. Det finnes også en `int` data type for signerte integers.

> Noter: I Solidity, er `uint` faktisk et synonym for `uint256`, en 256-bit usignert integer. du kan definere uints med færre bits — `uint8`, `uint16`, `uint32`, etc.. Men du vil som oftest bruke `uint` med unntak i spesielle tilfeller, som vi kommer til å snakke mer om i senere leksjoner.

# Test det

Zombie DNA-et kommer til å  bli fastslått av et 16-sifret nummer.

Deklarer en `uint` kalt `dnaDigits`, og sett den lik `16`.
