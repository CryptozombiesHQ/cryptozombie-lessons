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

    Person[] people; // dynamic Array, we can keep adding to it
    

Remember that state variables are stored permanently in the blockchain? So creating a dynamic array of structs like this can be useful for storing structured data in your contract, kind of like a database.

## Public Arrays

You can declare an array as `public`, and Solidity will automatically create a ***getter*** method for it. The syntax looks like:

    Person[] public people;
    

Other contracts would then be able to read (but not write) to this array. So this is a useful pattern for storing public data in your contract.

# Put it to the test

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create a public array of `Zombie` ***structs***, and name it `zombies`.