---
title: Arrays
actions:
  - 'controllaRisposta'
  - 'suggerimenti'
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

Quando si desidera effettuare una collezione di qualcosa, puoi utilizzare un ***array***. Ci sono due tipi di array in Solidity: ***fixed*** arrays e ***dynamic*** arrays:

    // Array con una lunghezza fissa di due elementi:
    uint[2] fixedArray;
    // Un altro Array fisso, può contenere cinque stringhe;
    string[5] stringArray;
    // Un Array dinamico - non ha una dimensione fissa, può continuare a crescere:
    uint[] dynamicArray;
    

Puoi anche creare un array di ***structs***. Usando la struct del capitolo precedente `Persona`:

    Person[] people; // Array dinamico, possiamo continuare ad aggiungere ad esso
    

Ricordi che le variabili di stato sono contenute permanentemente nella blockchain? Quindi creare un array dinamico di structs come questo può essere utile per i dati strutturati nel tuo contratto, simile a un database.

## Array Pubblici

Puoi dichiarare un array come `pubblico`, e Solidity creerà automaticamente un metodo ***getter*** per esso. La sintassi sembra questa:

    Person[] public people;
    

Other contracts would then be able to read from, but not write to, this array. So this is a useful pattern for storing public data in your contract.

# Facciamo un test

Vogliamo andare a memorizzare un esercito di zombie nella nostra app. E vorremmo mostrare tutti i nostri zombi ad altre app, quindi vorremmo che fosse pubblico.

1. Crea un array pubblico di `Zombie`***structs***, e nominala `zombies`.