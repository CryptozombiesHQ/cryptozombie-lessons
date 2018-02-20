---
titulo: Arreglos
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

          Zombie[] public zombies;

      }
---

Cuando usted quiera una coleccion de algo, usted puede usar un **_arreglo_**. Existen dos tipos de arreglos en Solidity: arreglo **_fijo_** y arreglo **_dinamicos_**:

```
// Array with a fixed length of 2 elements:
uint[2] fixedArray;
// another fixed Array, can contain 5 strings:
string[5] stringArray;
// a dynamic Array - has no fixed size, can keep growing:
uint[] dynamicArray;
```

Usted tambien puede crear un arreglo de  **_estructuras_**. Utilizando el capitulo anterior estructura de `Person`:

```
Person[] people; // dynamic Array, we can keep adding to it
```

Recuerdas que las variables de estado son almacenadas permanentemente en el blockchain? Asi que crear una arreglo dinamica de estructura como esta puede ser util para almacenar data estructurada en tu contrato, algo asi como una base de datos.

## Arreglos Publicos

Usted puede declara una arreglo como `publica`, y Solidity automaticamente creara un metodo de **_adquiridor_** para ello. La sintaxis se ve como:

```
Person[] public people;
```

Otros contratos podrian entonces ser capaces de leer (pero no escribir) esta arreglo. Asi que esto es un patron util para almacenar data publica en su contracto.

# Pongamoslo a prueba

Nosotros vamos a querer almacenar un ejercito de zombies en nuestra aplicacion. Y nosotros vamos a querer mostrar todos nuestros zombies a otras aplicaciones, asi que nostros queremos que sea publico.

1. Crear una arreglo publico de `Zombie` **_estructuras_**, y llamarlos `zombies`.
