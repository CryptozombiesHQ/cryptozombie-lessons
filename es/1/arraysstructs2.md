---
title: Trabajando con estructuras y arrays
actions: ['checkAnswer', 'hints']
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
              // empieza aquí
          }

      }
    answer: >
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
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Creando nuevas Estructuras (Structs)

Recuerdas las estructura `Person` en el ejemplo anteior?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Ahora aprenderemos como crear una nueva `Person` y añadirla a nuestro array `people`.

```
// crear una nueva `Person`
Person satoshi = Person(172, "Satoshi");

// añadir esta persona a nuestro array
people.push(satoshi);
```

Podemos combinar tambien estas dos cosas para hacerlas en una sola línea y dejarlo más clarito:

```
people.push(Person(16, "Vitalik"));
```

Date cuenta que `array.push()` añade algo al **final** del array, así que los elementos siguen en el orden añadido. Observa este ejemplo:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// el array `numbers` es ahora [5, 10, 15]
```

# Vamos a probar

¡Hagamos hacer algo a nuestra función `createZombie`!

1. Rellena el cuerpo de la función para que cree un nuevo `Zombie` y añádelo al array `zombies`. El nombre `name` y ADN (`dna`) del nuevo Zombi debería venir de los argumentos pasados a la función.
2. Hagámoslo en una sola línea de código para que quede clarito.
