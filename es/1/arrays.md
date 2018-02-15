---
title: Arrays
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

          // empieza aquí

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

      }
---

Cuando quieres tener una colección de algo, puedes usar un **_array_**. Hay dos tipos de arrays en Solidity: arrays **_fijos_** y arrays **_dinámicos_**:

```
// Un Array con una longitud fija de 2 elementos:
uint[2] fixedArray;
// otro Array fijo, con longitud de 5 elementos:
string[5] stringArray;
// un Array dinámico, sin longitud fija que puede seguir creciendo:
uint[] dynamicArray;
```

Tambien puedes crear arrays de **_structuras_**. Si usásemos la estructura `Person` del capítulo anterior:

```
Person[] people; // Array dinámico, podemos seguir añadiéndole elementos
```

¿Recuerdas que las variables de estado quedan guardadas permanentemente en la blockchain? Así que crear un array de estructuras puede ser muy útil para guardar datos estructurados en tu contrato, como una base de datos.

## Arrays Públicos

Puedes declarar un array como `público`, y Solidity creará automaticamente una función **_getter_** para acceder a él. La sintaxis es así:

```
Person[] public people;
```

Otros contratos podrían entonces leer (pero no escribir) de este array. Es un patrón de uso muy útil para guardar datos públicos en tu contrato.

# Vamos a probarlo

Vamos a guardar un ejército de zombis en nuestra aplicación. Y vamos a querer mostrar todos nuestros zombis a otras applicaciones, así que lo queremos público:

1. Crear un array público de **_structuras_** `Zombie` y llámalo `zombies`.
