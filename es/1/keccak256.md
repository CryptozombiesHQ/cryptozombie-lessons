---
title: Keccak256 y Typecasting
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

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              // empieza aquí
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Queremos que nuestra función `_generateRandomDna` devuelva un valor semi-aleatorio `uint`. ¿Cómo se puede conseguir esto?

Ethereum incluye una función hash llamada `keccak256`, que es una versión de SHA3. Una función hash lo que hace es mapear una cadena de caracteres a un número aleatorio hexadecimal de 256-bits. Un pequeño cambio en la cadena de texto producirá un hash completamente distinto.

Es útil para muchos propósitos en Ethereum, pero por ahora solo lo vamos a usar para generación de números pseudo-aleatorios.

También importante, `keccak256` espera un único parámetro de tipo `bytes`. Esto significa que tenemos que "empaquetar" cualquier parámetro antes de llamar a `keccak256`:

Ejemplo:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Como puedes ver, el valor devuelto para cada caso es completamente distinto, a pesar de que sólo hemos cambiado un carácter del argumento.

> Nota: Generar números aleatorios de forma **segura** en la cadena de bloques es algo muy difícil. El método que usamos aquí no es seguro, pero la seguridad no es nuestra prioridad para el ADN del Zombi, es suficiente para este propósito.

##

A veces es necesario convertir entre tipos de datos. Por ejemplo en el siguiente caso:

```
uint8 a = 5;
uint b = 6;
// dará un error porque a * b devuelve un `uint` y no un `uint8`:
uint8 c = a * b;
// debemos de forzar la variable b para que sea convertida a `uint8`
uint8 c = a * uint8(b);
```

`a * b` devuelve un `uint`, pero estábamos intentando guardarlo como `uint8`, lo que podría causar problemas. Casteándolo a `uint8` funcionará y el compilador no nos dará error.

# Ponlo a prueba

Vamos a rellenar el cuerpo de la función `_generateRandomDna`! Esto es lo que deberíamos hacer:

1. La primera línea de código debe tomar el hash `keccak256` de `abi. ncodePacked(_str)` para generar un hexadecimal pseudo-aleatorio, typecastéalo como un `uint`, y finalmente almacena el resultado en un `uint` llamado `rand`.

2. Queremos que nuestro ADN tenga solamente 16 dígitos (¿Recuerdas nuestra variable `dnaModulus`?). Así que la segunda línea de código debería devolver el módulo del valor de arriba (`%`) `dnaModulus`.
