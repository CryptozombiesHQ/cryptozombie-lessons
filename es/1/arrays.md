---
title: Arrays
actions:
  - 'comprobarRespuesta'
  - 'pistas'
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
      
      // start here
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      }
---
Cuando quieres tener una colección de algo, puedes usar un ***array***. Hay dos tipos de arrays en Solidity: arrays ***fijos*** y arrays ***dinámicos***:

    // Array with a fixed length of 2 elements:
    uint[2] fixedArray;
    // another fixed Array, can contain 5 strings:
    string[5] stringArray;
    // a dynamic Array - has no fixed size, can keep growing:
    uint[] dynamicArray;
    

Tú también puedes crear un array de ***structuras***. Usando los capítulos previos `Person` struct:

    Person[] people; // dynamic Array, we can keep adding to it
    

Recuerdas que las variables de estado están guardadas permanentemente en la Blockchain? So creating a dynamic array of structs like this can be useful for storing structured data in your contract, kind of like a database.

## Arrays Públicos

You can declare an array as `public`, and Solidity will automatically create a ***getter*** method for it. The syntax looks like:

    Person[] public people;
    

Other contracts would then be able to read (but not write) to this array. So this is a useful pattern for storing public data in your contract.

# Vamos a probarlo

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create a public array of `Zombie` ***structs***, and name it `zombies`.