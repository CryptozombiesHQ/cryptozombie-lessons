---
title: Tablice (Arrays)
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
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
    

Inne kontrakty będą miały wtedy mozliwość odczytu z tej tablicy (ale nie zapisu). Więc jest to użyteczna forma publicznego przechowywania danych w Twoim kontrakcie.

# Wypróbujmy zatem

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create a public array of `Zombie` ***structs***, and name it `zombies`.