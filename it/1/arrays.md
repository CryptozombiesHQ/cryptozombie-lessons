---
title: Arrays
actions:
  - controllaRisposta
  - suggerimenti
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19; contract ZombieFactory { uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits; struct Zombie { string name; uint dna; } // inizia qui }
    answer: >
      pragma solidity ^0.4.19; contract ZombieFactory { uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits; struct Zombie { string name; uint dna; } Zombie[] public zombies; }
---
Quando si desidera effettuare una collezione di qualcosa, puoi utilizzare un***array***. Ci sono due tipi di array in Solidity: ***fixed*** arrays e ***dynamic*** arrays:

    // Array con una lunghezza fissa di due elementi:
    uint[2] fixedArray;
    // Un altro Array fisso, può contenere cinque stringhe;
    string[5] stringArray;
    // Un Array dinamico - non ha una dimensione fissa, può continuare a crescere:
    uint[] dynamicArray;
    

You can also create an array of ***structs***. Using the previous chapter's `Person` struct:

    Person[] people; // dynamic Array, we can keep adding to it
    

Remember that state variables are stored permanently in the blockchain? So creating a dynamic array of structs like this can be useful for storing structured data in your contract, kind of like a database.

## Public Arrays

You can declare an array as `public`, and Solidity will automatically create a ***getter*** method for it. The syntax looks like:

    Person[] public people;
    

Other contracts would then be able to read (but not write) to this array. So this is a useful pattern for storing public data in your contract.

# Put it to the test

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create a public array of `Zombie` ***structs***, and name it `zombies`.