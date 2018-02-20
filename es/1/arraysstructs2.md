---
titulo: Trabajando con Estructuras y Arreglos
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
              // start here
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

### Creando Nuevas Estructuras

Recuerdas nuestra estructura `Person` en el ejemplo anterior?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Ahora nosotros vamos a aprender como crear un nuevo `Usuario` y anadirlo a nuestra arreglo de `people`.

```
// create a New Person:
Person satoshi = Person(172, "Satoshi");

// Add that person to the Array:
people.push(satoshi);
```

Tambien podemos combinar estos dos en una sola linea de codigos para mantener las cosas arregladas:

```
people.push(Person(16, "Vitalik"));
```

Notese que `array.push()` anade algo a el **end** de la arreglo, asi que los elementos aparecen en el orden que los anadimos. Vea el siguiente ejemplo:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers is now equal to [5, 10, 15]
```

# Pongamoslo a prueba

Vamos a hacer que nuestra funcion createZombie haga algo!

1. Llena en el cuerpo de la funcion para que cree a un nuevo `Zombie`, y anadelo a la arreglo de `zombies`. El `name` y el `dna` para el nuevo Zombie deberia venir de los argumentos de la funcion.
2. Hagamoslo en una sola linea de codigos para mantener las cosas arregladas.
