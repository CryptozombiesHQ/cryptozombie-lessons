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

    // Array con un numero fijo de 2 elementos:
    uint[2] fixedArray;
    // otro array fijo que contiene 5 cadenas (strings):
    string[5] stringArray;
    // un array dinamico que no tiene tamaño fijo y puede seguir creciendo:
    uint[] dynamicArray;
    

Tú también puedes crear un array de ***structuras***. Usando los capítulos previos `Person` struct:

    Person[] people; // Array dinámico, podemos seguir añadiéndolo
    

Recuerdas que las variables de estado están guardadas permanentemente en la Blockchain? Entonces al crear un array dinámico de estructuras como este, puede ser muy útil para guardar datos estructurados en tu contrato, a manera de una base de datos.

## Arrays Públicos

Tú puedes declarar un array como `public`, y Solidity automáticamente creará un método ***getter*** para ello. La sintaxis se parecería a esto:

    Person[] public people;
    

Other contracts would then be able to read (but not write) to this array. So this is a useful pattern for storing public data in your contract.

# Vamos a probarlo

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Create a public array of `Zombie` ***structs***, and name it `zombies`.