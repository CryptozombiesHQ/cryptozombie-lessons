---
title: Trabajando con estructuras y arrays
actions:
  - 'comprobarRespuesta'
  - 'pistas'
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

      Zombie[] public zombies;

      function createZombie (string memory _name, uint _dna) public {
      // start here
      }

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function createZombie (string memory _name, uint _dna) public { zombies.push(Zombie(_name, _dna)); }
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

    // crear un nuevo Person:
    Person satoshi = Person(172, "Satoshi");
    
    // Añade esta persona a nuestro Array:
    people.push(satoshi);
    

También podemos combinar estas dos cosas para hacerlas en una sola línea y mantener el código limpio:

    people.push(Person(16, "Vitalik"));
    

Date cuenta que `array.push()` añade algo al **final** del array, así que los elementos siguen el orden de añadido. Observa este ejemplo:

    uint[] numbers;
    numbers.push(5);
    numbers.push(10);
    numbers.push(15);
    // el array numbers es ahora igual a [5, 10, 15]
    

# Vamos a probarlo

Vamos hacer que nuestra función createZombie haga algo!

1. Rellena el cuerpo de la función para que cree un nuevo `Zombie`, y añádelo al array `zombies`. El nombre `name` y Adn `dna` para el nuevo zombi deberían venir de los argumentos pasados de la función.
2. Vamos hacerlo en una sola línea y mantener el código limpio.