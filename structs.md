---
title: Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 8;
        uint dnaModulus = 10 ** dnaDigits;

        // start here

      }
    answer: >
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 8;
        uint dnaModulus = 10 ** dnaDigits;

        struct Zombie {
          uint dna;
          string name;
        }

      }
---

Sometimes you need a more complex data type. For this, Solidity provides **_Structs_**:

```
struct Person {
  uint age;
  string name;
}

```

Structs allow you to create more complicated data types that have multiple properties.

> Note that we just introduced a new data type, `string`. Strings are used for arbitrary-length UTF-8 data. Ex. `string greeting = "Hello world!"`

With the above example, we could then create new structs and interact with the data as in the following:

```
// Both of the following are valid ways to create a struct;
Person james = Person(32, "James");
Person grandpa = Person({name: "Grandpa", age: 132});

// How to access the data:
uint myAge = james.age;
string myName = james.name;
```

# Put it to the test

We're going to want to create some zombies!

1. Create a `struct` named `Zombie`.

2. Our `Zombie` struct will have 2 properties: `dna` (a `uint`), and `name` (a `string`).
