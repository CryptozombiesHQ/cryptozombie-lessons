---
title: Privat / Offentig funksjoner
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
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

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

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

I Solidity, er funksjoner `public` som standard. Dette betyr at alle (eller hvilken som helst kontrakt) kan kjøre din kontrakts funksjoner og utføre koden dens.

Dette er åpenbart ikke alltid  ønskelig, og kan gjøre kontrakten din ustatt for angrep. Derfor er det viktig å markere funksjonene dine `private` som standard, og så lage funksjoner `public` om du ønsker å eksponere dem mot omverdenen.

La oss se på hvordan en deklarerer en  privat funksjon:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

Dette betyr at bare andre funksjoner inne i kontrakten din kan kalle på funksjonen din og legge til i `numbers` array-en din.

Som du kan se bruker vi nøkkelord som `private` etter funksjon-navnet. Og som i vanlige funksjoners parametere, det er konvensjonelt å starte private funksjoners navn med understrek (`_`).

# Test det

Kontrakten vår `createZombie`s funksjon er for øyeblikket offentil — dette betyr at alle kan kjøre den og lage en ny zombie i kontrakten vår! La oss sette den som privat.

1. Endre `createZombie` slik at den blir en privat funksjon. Ikke glem funksjon-konvensjonen!
