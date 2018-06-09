---
title: Štruktúry
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // Začni písať tu

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

Občas je potrebné použiť komplexnejšie dátové typy. Na to má pre nás Solidity pripravené **_štruktúry_**:
Sometimes you need a more complex data type. For this, Solidity provides **_structs_**:

```
struct Person {
  uint age;
  string name;
}

```

Štruktúry ti umožnujú vytvoriť zložitejšie dátové typy ktoré maju niekoľko vlasností.
Structs allow you to create more complicated data types that have multiple properties.

> Povšimnime si že sme práve použili nový dátový typ `string` - znakový reťazec. Reťazce sú UTF-8 dáta ľubovolnej dĺžky. Napríkald `string greeting = "Hello world!"`
> Note that we just introduced a new type, `string`. Strings are used for arbitrary-length UTF-8 data. Ex. `string greeting = "Hello world!"`


# Vyskúšaj si to sám
# Put it to the test

V našej aplikácií budeme chciet vytvárať zombie. Všetci zombie budú mať niekoľko vlasností, takže to perfektná príležitosť na to aby sme použili štruktúru.
In our app, we're going to want to create some zombies! And zombies will have multiple properties, so this is a perfect use case for a struct.

1. Vytvor `struct` pomenovanú `Zombie`.
1. Create a `struct` named `Zombie`.

2. Naša `Zombie` štruktúra bude mať 2 vlasnosti: `name` (typu `string`) a `dna` (typu `uint`).
2. Our `Zombie` struct will have 2 properties: `name` (a `string`), and `dna` (a `uint`).
