---
titulo: Estructuras
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // start here

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

      }
---

Algunas veces se necesita un tipo de data mas compleja. Para esto, Solidity proporciona **_estructuras_**:

```
struct Person {
  uint age;
  string name;
}

```

Las estructuras le permiten crear tipos de datos mas complicados que tienen multiples propiedades.

> Note que nosotros solo introducimos un nuevo tipo, `string`. Los caracteres se usan para datos UTF-8 de longitud arbitraria. Ejemplo `string greeting = "Hello world!"`

# Pongamoslo a prueba

En nuestra aplicacion, vamos a querer crear algunos zombies! Y los zombies tendrán multiples propiedades, por lo que este es un caso de uso perfecto para una estructura.

1. Crear una `struct` llamada `Zombie`.

2. Nuestra estructura `Zombie` tendra 2 propiedades: `name` (un `string`), y `dna` (un `uint`).
