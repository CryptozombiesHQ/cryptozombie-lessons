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

Občas je potrebné použiť komplexnejšie dátové typy. Na to má pre nás Solidity pripravené **_štruktúry_** ( **_struct_**):

```
struct Person {
  uint age;
  string name;
}

```

Štruktúry ti umožňujú vytvoriť zložitejšie dátové typy s viacerými vlastnosťami.

> Povšimni si, že sme práve použili nový dátový typ `string` - znakový reťazec. Reťazce sú UTF-8 dáta ľubovolnej dĺžky. Napríklad `string greeting = "Hello world!"`


# Vyskúšaj si to sám

V našej aplikácií budeme chcieť vytvárať zombie. Všetci zombie budú mať niekoľko vlasností, takže toto je perfektná príležitosť na použitie štruktúr.

1. Vytvor štruktúru pomenovanú `Zombie`.

2. `Zombie` štruktúra bude mať 2 vlasnosti: `name` (typu `string`) a `dna` (typu `uint`).
