---
title: Tablice
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

      }
---

Kiedy chcesz zdefiniować kolekcje czegoś, możesz użyć **_array_**. Istnieją dwa typy tablic w Solidity: **_fixed_** oraz **_dynamic_**:

```
// Tablica typu fixed o długości dwóch elementów:
uint[2] fixedArray;
// następna Tablica typu fixed, może zawierać 5 stringów:
string[5] stringArray;
// Tablica typu dynamic - nie ma zapisanej liczby elementów, ich liczba rośnie dynamicznie:
uint[] dynamicArray;
```

Możesz również stworzyć tablicę typu **_structs_**. Używająć `Person` struct z pierwszego rozdziału:

```
Person[] people; // Tablica typu dynamic, możemy wciąż do niej dodawać nowe elementy
```

Pamiętasz, że zmienne stanu (state variables) są zapisane permanentnie w blockchainie?. Tworzenie tablicy dynamicznej ze struct -ów jest pomocne aby zapisywać dane w Twoim kontrakcie. Jest to podobne do zapisywania w bazie danych.


## Public Arrays

Możesz deklarować tablice jako `public` Solidity automatycznie stworzy **_getter_** dla niej. Składnia wygląda następująco:

```
Person[] public people;
```

Inne kontrakty będą mogły później czytać (ale nie zapisywać) tą tablice. Z tego powodu jest to dobry wzorzec, aby zapisywać publiczne dane w Twoim kontrakcie.


# Zadanie do wykonania

Zamierzamy dodać armię zombi do naszej aplikacji. Chcemy również, aby armia była widoczna dla innych aplikacji. W takim razie będzie musiała być zapisana jako publiczna.

1. Stwórz publiczną tablicę `Zombie` **_structs_**, i nazwij ją `zombies`.
