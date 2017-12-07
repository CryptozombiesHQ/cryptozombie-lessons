---
title: Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 10;
        uint dnaModulus = 10 ** dnaDigits;

        // start here

      }
    answer: >
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 10;
        uint dnaModulus = 10 ** dnaDigits;

        struct Zombie {
          uint dna;
          string name;
        }

      }
---

Sometimes you need a more complex data type. For this, Solidity provides **_structs_**:

```
struct Person {
  uint age;
  string name;
}

```

Structs allow you to create more complicated data types that have multiple properties.

> Note that we just introduced a new data type, `string`. Strings are used for arbitrary-length UTF-8 data. Ex. `string greeting = "Hello world!"`

# Put it to the test

We're going to want to create some zombies!

1. Create a `struct` named `Zombie`.

2. Our `Zombie` struct will have 2 properties: `dna` (a `uint`), and `name` (a `string`).
