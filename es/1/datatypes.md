---
title: Estado de Variables y Números Enteros
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      //empieza aquí
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16;
      }
---
¡Buen trabajo! Ahora que tenemos una capa para nuestro contrato, aprendamos cómo Solidity maneja las variables.

Las ***Variables de Estado*** se guardan permanentemente en el almacenamiento del contrato. Esto significa que se escriben en la cadena de bloques de Ethereum. Piensa en ellos como escribir en una base de datos.

##### Ejemplo:

    contract Example {
      // Esto se guardará permanentemente en la cadena de bloques
      uint myUnsignedInteger = 100;
    }
    

En este contrato de ejemplo, hemos creado un `uint` llamado `myUnsignedInteger` y le hemos dado el valor 100.

## Enteros sin Signos: `uint`

El tipo de dato `uint` es un entero sin signo, esto significa que **su valor siempre debe ser no-negativo**. También hay un tipo de dato `int` para números enteros con signo.

> Nota: En Solidity, `uint` es realmente un alias para `uint256`, un número entero sin signo de 256-bits. You can declare uints with less bits — `uint8`, `uint16`, `uint32`, etc.. But in general you want to simply use `uint` except in specific cases, which we'll talk about in later lessons.

# Put it to the test

Our Zombie DNA is going to be determined by a 16-digit number.

Declare a `uint` named `dnaDigits`, and set it equal to `16`.