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

```
struct Person {
  uint age;
  string name;
}

```

Štruktúry ti umožnujú vytvoriť zložitejšie dátové typy ktoré maju niekoľko vlasností.

> Povšimnime si že sme práve použili nový dátový typ `string` - znakový reťazec. Reťazce sú UTF-8 dáta ľubovolnej dĺžky. Napríklad `string greeting = "Hello world!"`


# Vyskúšaj si to sám

V našej aplikácií budeme chciet vytvárať zombie. Všetci zombie budú mať niekoľko vlasností, takže to perfektná príležitosť na to aby sme použili štruktúru.

1. Vytvor `struct` pomenovanú `Zombie`.

2. Naša `Zombie` štruktúra bude mať 2 vlasnosti: `name` (typu `string`) a `dna` (typu `uint`).
