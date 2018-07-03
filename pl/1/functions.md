---
title: Deklaracja Funkcji
actions: ['sprawdźOdpowiedź', 'podpowiedzi']
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

          // zacznij tutaj

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

          function createZombie(string _name, uint _dna) {

          }

      }
---

Deklarowanie funkcji w Solidity wygląda następująco:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Funkcja `eatHamburgers` przyjmuje 2 parametry:  `string` oraz `uint`. Aktualnie zawartość funkcji jest pusta.

> Notatka: Konwensja jest taka, (nie jest to wymagane) aby parametry funkcji zaczynać podkreślnikiem (`_`) aby odróżnić je od zmiennych globalnych. Będziemy używać tej konwencji w trakcie tutorialu.

Możesz wywołać tą funkcję następująco:

```
eatHamburgers("vitalik", 100);
```

# Zadanie do wykonania

Potrzebujemy mieć możliwość tworzenia zombich w naszej aplikacji. Stwórzmy funkcję, która będzie za to odpowiadać.

1. Stwórz funkcję o nazwie `createZombie`. Powinna przyjmować dwa parametry: **__name_** (`string`), oraz **__dna_** (`uint`).

Narazie pozostaw funkcję pustą — wypełnimy ją później.
