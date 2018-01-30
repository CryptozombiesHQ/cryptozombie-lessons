---
title: Funksjon deklarasjon
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

          // start her

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

Deklarasjon av en funksjon i Solidity ser slik ut:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Dette er en funksjon kalt `eatHamburgers` som tar 2 parameterere: en `string` og en `uint`. La funksjonen stå tom, for nå.

> Noter: Det er konvensjonelt (men ikke krevd) å starte funksjon parameter variabel navnmed understrek (`_`) for å differensiere mellom globale variabler. Vi kommer til å ta i bruk denne konvensjonen i dette kurset .

Do kommer til å kjøre en funksjon slik:

```
eatHamburgers("vitalik", 100);
```

# Test det

I appen vår kommer vi til å trenge å lage flere zombier. La oss lage en funksjon for det.

1. Lag en funksjon kalt `createZombie`. Den kommer til å ta to parametere: **__name_** (en `string`), og **__dna_** (en `uint`).

La funksjonen stå tom - vi kommer til å fylle inn resten senere.
