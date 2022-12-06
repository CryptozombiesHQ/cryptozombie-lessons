---
title: Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
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

> Note that we just introduced a new type, `string`. Strings are used for arbitrary-length UTF-8 data. Ex. `string greeting = "Hello world!"`

# Put it to the test

In our app, we're going to want to create some zombies! And zombies will have multiple properties, so this is a perfect use case for a struct.

1. Create a `struct` named `Zombie`.

2. Our `Zombie` struct will have 2 properties: `name` (a `string`), and `dna` (a `uint`).
