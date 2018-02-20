---
titulo: Variables de Estado y Enteros
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Buen trabajo! Ahora que tenemos un escudo para nuestro contrato, aprendamos como Solidity se relaciona con las variables.

**_Variables de estado_** se almacenan permanentemente en el almacenamiento por contrato. Esto significa que están escritos en el blockchain de Ethereum . Piense en ellos como escribiendo un DB.

##### Ejempo:
```
contract Example {
  // This will be stored permanently in the blockchain
  uint myUnsignedInteger = 100;
}
```

En este contrato de ejemplo, hemos creado un `uint` llamado `myUnsignedInteger` y lo configuramos igual a 100.

## Enteros sin signo: `uint`

El tipo de datos `uint` es un entero sin signo, lo que significa que **su valor debe ser no negativo**. Ademas hay un tipo de datos `int` para enteros con signo.

> Nota: En Solidity, `uint` es realmente un alias para `uint256`, un entero sin signo de 256 bits. Usted puede declarar uints con menos bits — `uint8`, `uint16`, `uint32`, etc.. Pero en general, usted quiere simplemente usar `uint` excepto en casos especificos, de los que se hablaran en lecciones posteriores.

# Pongamoslo a prueba

Nuestro ADN Zombie va a ser determinado por un numero de 16 digitos.

Declare un `uint` llamado `dnaDigits`, y establezcalo igual a `16`.
