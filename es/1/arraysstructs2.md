---
title: Trabajando con estructuras y arrays
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
      
      Zombie[] public zombies;
      
      function createZombie(string _name, uint _dna) {
      // comienza aquí
      }
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function createZombie(string _name, uint _dna) { zombies.push(Zombie(_name, _dna)); }
      }
---
### Creando Nuevas Estructuras

Recuerdas nuestra estructura `Person` en el ejemplo anterior?

    struct Person {
      uint age;
      string name;
    }
    
    Person[] public people;
    

Ahora vamos a aprender como crear una nueva persona `Person`s y añadirlo a nuestro array `people`.

    // crear un nuevo Persona:
    Person satoshi = Person(172, "Satoshi");
    
    // Añade esta persona a nuestro Array:
    people.push(satoshi);
    

También podemos combinar estas dos cosas para hacerlas en una sola línea y mantener el código limpio:

    people.push(Person(16, "Vitalik"));
    

Note that `array.push()` adds something to the **end** of the array, so the elements are in the order we added them. See the following example:

    uint[] numbers;
    numbers.push(5);
    numbers.push(10);
    numbers.push(15);
    // numbers is now equal to [5, 10, 15]
    

# Put it to the test

Let's make our createZombie function do something!

1. Fill in the function body so it creates a new `Zombie`, and adds it to the `zombies` array. The `name` and `dna` for the new Zombie should come from the function arguments.
2. Let's do it in one line of code to keep things clean.