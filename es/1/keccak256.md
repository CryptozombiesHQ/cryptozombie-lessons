---
title: Keccak256 y Encasillamiento
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
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
      // Empieza aquí
      }

      }
    answer: >
      pragma solidity ^0.4.25;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      }
---

Queremos que nuestra función `_generateRandomDna` devuelva un valor (semi) aleatorio `uint`. Comó se puede conseguir esto?

Ethereum incluye una función hash llamada `keccak256`, que es una versión de SHA3. A hash function basically maps an input into a random 256-bit hexidecimal number. Un pequeño cambio de la string puede suponer un cambio gigantesco en el hash.

Es muy útil para muchas cosas, pero por ahora vamos a usarlo solamente para generar un número cuasi-aleatorio.

También importante, `keccak256` espera a un solo parámetro de tipo `byte`. Ésto quiere decir que tenemos que "packear" cualquier parámetro antes de llamar a `keccak256`:

Ejemplo:

    //6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
    keccak256(abi.encodePacked("aaaab"));
    //b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
    keccak256(abi.encodePacked("aaaac"));
    

Como puedes ver, el valor devuelto es totalmente diferente, a pesar de que sólo hemos cambiado un carácter del argumento.

> Nota: Generar números aleatorios de forma **segura** en la cadena de bloques es algo muy difícil. El método que usamos aquí no es seguro, pero la seguridad no es nuestra prioridad para el ADN del Zombi, es suficiente para este propósito.

## Encasillamiento

A veces es necesario convertir entre tipos de datos. Ésto podría ser un ejemplo:

    uint8 a = 5;
    uint b = 6;
    // dará un error porque a * b devuelve un uint, y no un uint8:
    uint8 c = a * b; 
    // debemos forzar la variable b para que se convierta en un uint8
    uint8 c = a * uint8(b); 
    

En el código de arriba, `a * b` devuelve un `uint`, pero estábamos intentando guardarlo como un `uint8`, lo que podría causar problemas. Casteándolo a `uint8`, funcionará y el compilador no nos dará error.

# Vamos a probarlo

¡Vamos a rellenar el cuerpo de la función `_generateRandomDna`! Esto es lo que deberíamos hacer:

1. The first line of code should take the `keccak256` hash of `abi.encodePacked(_str)` to generate a pseudo-random hexadecimal, typecast it as a `uint`, and finally store the result in a `uint` called `rand`.

2. Queremos que nuestro ADN tenga solamente 16 dígitos (¿Recuerdas nuestra variable `dnaModulus`?). Así que la segunda línea del código debería devolver `return` el módulo del valor de arriba (`%`) `dnaModulus`.