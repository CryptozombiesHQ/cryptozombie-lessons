---
title: ""
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

          // empieza aquí

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

      }
---

Cuando quieres tener una colección de algo, puedes usar un arreglo (**_array_**). Hay dos tipos de arrays en Solidity: arrays **_fijos_** y arrays **_dinámicos_**:

```
// Un Array con una longitud fija de 2 elementos:
uint[2] fixedArray;
// otro Array fijo, con longitud de 5 elementos:
string[5] stringArray;
// un Array dinámico, sin longitud fija que puede seguir creciendo:
uint[] dynamicArray;
```

También puedes crear un array de estructuras (**_structs_**). Si usáramos el struct `Person` del capítulo anterior:

```
Person[] people; // Array dinámico, podemos seguir añadiéndole elementos
```

¿Recuerdas que las variables de estado quedan guardadas permanentemente en la blockchain? Así que crear un array dinámico de structs como esta puede ser útil para almacenar datos estructurados en su contrato, como una base de datos.

## Arrays Públicos

Puedes declarar un array como `público`, y Solidity creará automaticamente una función **_getter_** para acceder a él. La sintaxis es así:

```
```

Otros contratos entonces podrían leer, pero no escribir en este array. Así que este es un patrón útil para almacenar datos públicos en su contrato.

# Ponlo a prueba

Vamos a guardar un ejército de zombis en nuestra aplicación. Y vamos a querer mostrar todos nuestros zombis a otras applicaciones, así que lo queremos público:

1. Crea un array público de **_structs_** `Zombie` y llámalo `zombies`.
