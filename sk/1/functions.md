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
A function declaration in solidity looks like the following:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Toto je funkcia s menom `eatHamburgers` ktorá berie 2 argumenty: `string` a `uint`. Telo funkcie je zatiaľ prázdne.
This is a function named `eatHamburgers` that takes 2 parameters: a `string` and a `uint`. For now the body of the function is empty.

> Note: Je konvenciou (ale nie nutnosť) začínať názvy funkčných argumentov názvami premenných a podtržítkom (`_`) na to aby sme ich odlíšili od globálnych premmých. V priebehu tohoto tutoriálu však budeme túto konvenciu používať.
> Note: It's convention (but not required) to start function parameter variable names with an underscore (`_`) in order to differentiate them from global variables. We'll use that convention throughout our tutorial.

Predošlú funkciu by sme zavolali takto:
You would call this function like so:

```
eatHamburgers("vitalik", 100);
```

# Vyskúšaj si to sám
# Put it to the test

V našej aplikácií potrebujeme byť schopný vytvárať Zomies. Poďme si na to napísať funkciu.
In our app, we're going to need to be able to create some zombies. Let's create a function for that.

1. Vytvor funkciu pomenovanú `createZombie`. Mala by príjmať dva parametre: **__name_** (typu `string`) a **__dna_** (typu `uint`).
1. Create a function named `createZombie`. It should take two parameters: **__name_** (a `string`), and **__dna_** (a `uint`).

Telo funkcie zatiaľ necháme prázdne - doplníme ho neskôr.
Leave the body empty for now — we'll fill it in later.
