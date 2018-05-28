---
title: Deklarowanie Funkcji
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
      uint dna;
      string name;
      }
      
      Zombie[] public zombies;
      
      // zacznij tutaj
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { uint dna; string name; }
      Zombie[] public zombies;
      function createZombie(string _name, uint _dna) {
      }
      }
---
Deklaracja funkcji w Solidity wygląda następująco:

    function eatHamburgers(string _name, uint _amount) {
    
    }
    

To jest funkcja o nazwie `eatHamburgers`, która odbiera dwa parametry: typu `string` i typu `uint`. Na tą chwilę ciało funkcji jest puste.

> Uwaga: Konwencją jest (lecz nie jest to wymagane) rozpoczęcie nazw zmiennych parametrów funkcji poprzez podkreślnik (`_`) w celu rozróżnienia ich od zmiennych globalnych. Będziemy się tego trzymać w naszym tutorialu.

Wywołałbyś tę funkcję tak:

    eatHamburgers("vitalik", 100);
    

# Wypróbujmy zatem

W naszej aplikacji, chcemy mieć mozliwość tworzenia Zombiaków. Stwórzmy do tego funkcję.

1. Create a function named `createZombie`. It should take two parameters: **__name_** (a `string`), and **__dna_** (a `uint`).

Leave the body empty for now — we'll fill it in later.