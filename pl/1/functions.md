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
              uint dna;
              string name;
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
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

Deklarowanie funkcji w solidity wygląda następująco:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Funkcja `eatHamburgers` przyjmuje 2 parametry:  `string` oraz `uint`. Aktualnie zawartość funkcji jest pusta.

> Notatka: Konwensja jest taka, (nie jest to wymagane) aby parametry funkcji zacznać podkreślnikiem (`_`) aby odróżnić je od zmiennych globalnych. Będziemy uzywać tej konwencji w trakcie tutorialu.

Możesz wywołać tą funkcjie następująco:

```
eatHamburgers("vitalik", 100);
```

# Zadanie do wykonania

Potrzebjemy mieć możliwość tworzenia zombich w naszej aplikacji. Stwórzmy funkcje, która będzie za to odpowiadać.

1. Stwórz funkcje o nazwie `createZombie`. Powinna przyjmować dwa parametry: **__name_** (`string`), oraz **__dna_** (`uint`).

Narazie pozostaw funkcje pustą — wypełnimy ją później.
