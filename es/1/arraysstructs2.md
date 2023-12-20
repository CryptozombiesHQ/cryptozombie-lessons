---
title: Trabajando con estructuras y arrays
actions:
  - ""
  - ""
requireLogin: true
material:
  editor:
    language: ""
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {
              // empieza aquí
          }

      }
    answer: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Creando nuevas Estructuras (Structs)

¿Recuerdas las estructura `Person` en el ejemplo anterior?

```
```

Ahora aprenderemos como crear un nuevo `Person` y añadirlo a nuestro array `people`.

```
// crea un nuevo `Person`
Person satoshi = Person(172, "Satoshi");

// añade esta persona a nuestro array
people.push(satoshi);
```

También podemos combinar estas dos cosas para hacerlas en una sola línea de código para mantenerlo limpio:

```
```

Ten en cuenta que `array.push()` añade algo al **final** del array, así que los elementos siguen el orden de añadido. Observa el siguiente ejemplo:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// el array `numbers` es ahora igual a [5, 10, 15]
```

# Ponlo a prueba

¡Hagamos hacer algo a nuestra función `createZombie`!

1. Rellena el cuerpo de la función para que cree un nuevo `Zombie` y lo añada al array `zombies`. El nombre (`name`) y Adn (`dna`) para el nuevo Zombi debería venir de los argumentos de la función.
2. Hagámoslo en una sola línea de código para que quede limpio.
