---
title: Tablice (Arrays)
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      // start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      }
---

Jeśli chcesz stworzyć zbiór jakichś zmiennych, możesz użyć ***tablicy (array)***. W Solidity mamy do dyspozycji dwa typy tablic: ***fixed*** i ***dynamic***:

    // Tablica o stałym rozmiarze 2 elementów:
    uint[2] fixedArray;
    // kolejna tablica o stałym rozmiarze, może zawierać 5 elementów typu string:
    string[5] stringArray;
    // tablica dynamiczna - nie ma stałego rozmiaru, jej rozmiar może się zwiększać:
    uint[] dynamicArray;
    

Możesz również utworzyć tablice złozoną ze struktur (***structs***). Wykorzystując strukturę `Person` z poprzedniego rozdziału:

    Person[] people; // Tablica dynamiczna, możesz do niej dodawać elementy
    

Pamietasz, że zmienne stanu są przechowywane trwale w blockchain'ie? Więc tworzenie dynamicznej tablicy struktur w ten sposób może być użyteczne w celu przechowywania danych strukturalnych, takich jak np. bazy danych.

## Tablice Publiczne

Możesz zadeklarować tablicę jako `public`, a Solidity automatycznie utworzy metodę ***getter*** dla niej. Składnia wygląda następująco:

    Person[] public people;
    

Other contracts would then be able to read from, but not write to, this array. So this is a useful pattern for storing public data in your contract.

# Wypróbujmy zatem

Zamierzamy przechowywać armię zombie w naszej aplikacji. I będziemy chcieli pokazać wszystkie nasze zombie w innych aplikacjach, więc musimy je utworzyć jako publiczne.

1. Stwórz publiczną tablicę z `Zombie` ***structs*** i nazwij ją `zombies`.