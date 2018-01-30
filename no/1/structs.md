---
title: Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // start her

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

      }
---

Noen ganger trenger du mer komplekse typer data. For dette, tilbyr Solidity **_structs_**:

```
struct Person {
  uint age;
  string name;
}

```

Struct-er tillater deg å ha mer komplisert typer data som har flere egenskaper.

> Noter at vi akkurat introduserte en ny type data, `string`. En string blir brukt for å lagre vilkårlig lengde UTF-8 data. F.eks. `string greeting = "Hello world!"`

# Test det

I appen vår kommer vi til å ville lage nye zombier! Og zombiene kommer til å ha flere egenskaper, så dette er et perfekt bruks-tilfelle for structs.

1. Lag en `struct` kalt `Zombie`.

2. `Zombie` struct-en vil ha 2 verdier: `name` (en `string`), og `dna` (en `uint`).
