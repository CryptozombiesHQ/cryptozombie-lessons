---
title: Estructuras
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

          // empezar aquí

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

      }
---

Algunas veces necesitas tipos de datos más complejos. Para esto Solidity proporciona **_structs_** (estructuras de datos):

```
```

Los structs te permiten crear tipos de datos más complejos que tienen varias propiedades.

> Tenga en cuenta que acabamos de introducir un nuevo tipo, `string`. Las cadenas se utilizan para datos UTF-8 de longitud arbitraria. Ej. Ejemplo: `string greeting = "¡Hola Mundo!"`

# Ponlo a prueba

En nuestra aplicación, vamos a querer crear unos cuantos zombies. Y los zombies tendrán múltiples propiedades, por lo que este es un caso de uso perfecto para un struct.

1. Crea un `struct` llamado `Zombie`.

2. Nuestro struct `Zombie` tendrá dos propiedades: `name` (de tipo `string`), y `dna` (de tipo `uint`).
