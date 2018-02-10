---
title: Estructuras
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

Algunas veces necesitas tipos de datos más complejos. Para esto Solidity proporciona **_structs_** (estructuras de datos):

```
struct Person {
  uint age;
  string name;
}

```

Las estructuras te permiten crear tipos de datos más complejos que tienen varias propiedades.

> Nota: acabamos de introductir un nuevo tipo de dato `string`, que se usan para cadenas de texto UTF-8 de longitud arbitraria. Ejemplo: `string greeting = "¡Hola Mundo!"`

# Vamos a probarlo

En nuestra aplicación, vamos a querer crear unos cuantos zombies. Y los zombis tienen varias propiedades, así que es un caso perfecto para usar estructuras de datos `structs`

1. Crea un `struct` llamado `Zombie`.

2. Nuestra estructura `Zombie` tendrá dos propiedades: `name` (de tipo `string`), y `dna` (de tipo `uint`).
