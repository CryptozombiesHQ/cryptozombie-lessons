---
title: Dichiarazioni di funzione
actions:
  - controllaRisposta
  - suggerimenti
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
      
      // inizia qui
      
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
Una dichiarazione di funzione in solidity sembra come la seguente:

    function eatHamburgers(string _name, uint _amount) {
    
    }
    

Questa è una funzione nominata `eatHamburgers` che richiede 2 parametri: una `string` e un `uint`. Per ora il corpo della funzione è vuoto.

> Nota Bene: È convenzione (ma non obbligatoria) avviare i nomi delle variabili dei parametri di funzione con un carattere di underscore (` _ `) per differenziarli dalle variabili globali. Useremo questa convenzione durante il nostro tutorial.

Chiamereste questa funzione così:

    eatHamburgers("vitalik", 100);
    

# Facciamo un test

Nella nostra app, avremo bisogno di essere in grado di creare alcuni zombie. Creiamo una funzione per questo.

1. Create a function named `createZombie`. It should take two parameters: **__name_** (a `string`), and **__dna_** (a `uint`).

Leave the body empty for now — we'll fill it in later.