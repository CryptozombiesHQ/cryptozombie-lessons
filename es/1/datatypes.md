---
title: Variables de Estado y Números Enteros
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // empieza aquí

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

¡Buen trabajo! Ahora que tenemos una capa para nuestro contrato, aprendamos cómo maneja las variables Solidity.

Las **_Variables de estado_** se guardan permanentemente en el almacenamiento del contrato. Esto significa que se escriben en la cadena de bloques de Ethereum. Piensa en ellos como en escribir en una base de datos.

##### Ejemplo:
```
contract Example {
  // Esto se guardará permanentemente en la cadena de bloques
  uint myUnsignedInteger = 100;
}
```

En este contrato de ejemplo, hemos creado un `uint` llamado `myUnsignedInteger` y le hemos dado el valor 100.

## Enteros sin Signo: `uint`

El tipo de dato `uint` es un entero sin signo, esto es **su valor siempre debe ser no-negativo**. Hay también un tipo de dato `int` para números enteros con signo.

> Nota: En Solidity, `uint` es realmente un alias para `uint256`, un número entero de 256-bits. Puedes declarar uints con menos bits — `uint8`, `uint16`, `uint32`, etc.. Pero por lo general usaremos `uint` excepto en casos específicos, de los que hablaremos en otras lecciones más adelante.

# Vamos a probarlo

El ADN de nuestro Zombi va a estar determinado por un número de 16 dígitos.

Declara una variable de tipo `uint` llamada `dnaDigits`, y asígnale el valor `16`.
