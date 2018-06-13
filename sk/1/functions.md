---
title: Deklarácia Funkcií
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // začni písať tu

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

Deklarácia funkcie v solidity vyzerá takto:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Toto je funkcia s menom `eatHamburgers` ktorá berie 2 argumenty: `string` a `uint`. Telo funkcie je zatiaľ prázdne.

> Note: Je konvenciou (ale nie nutnosť) začínať názvy funkčných argumentov názvami premenných a podtržítkom (`_`) na to aby sme ich odlíšili od globálnych premmých. V priebehu tohoto tutoriálu však budeme túto konvenciu používať.

Predošlú funkciu by sme zavolali takto:

```
eatHamburgers("vitalik", 100);
```

# Vyskúšaj si to sám

V našej aplikácií potrebujeme byť schopný vytvárať Zomies. Poďme si na to napísať funkciu.

1. Vytvor funkciu pomenovanú `createZombie`. Mala by príjmať dva parametre: **__name_** (typu `string`) a **__dna_** (typu `uint`).

Telo funkcie zatiaľ necháme prázdne - doplníme ho neskôr.
