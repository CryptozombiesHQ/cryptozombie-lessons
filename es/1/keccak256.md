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
      // start here
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

Ethereum incluye una función hash llamada `keccak256`, que es una versión de SHA3. A hash function basically maps an input into a random 256-bit hexidecimal number. A slight change in the input will cause a large change in the hash.

Es muy útil para muchas cosas, pero por ahora vamos a usarlo solamente para generar un número cuasi-aleatorio.

Also important, `keccak256` expects a single parameter of type `bytes`. This means that we have to "pack" any parameters before calling `keccak256`:

Example:

    //6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
    keccak256(abi.encodePacked("aaaab"));
    //b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
    keccak256(abi.encodePacked("aaaac"));
    

As you can see, the returned values are totally different despite only a 1 character change in the input.

> Nota: Generar números aleatorios de forma **segura** en la cadena de bloques es algo muy difícil. El método que usamos aquí no es seguro, pero la seguridad no es nuestra prioridad para el ADN del Zombi, es suficiente para este propósito.

## Encasillamiento

Sometimes you need to convert between data types. Take the following example:

    uint8 a = 5;
    uint b = 6;
    // dará un error porque a * b devuelve un uint, y no un uint8:
    uint8 c = a * b; 
    // debemos forzar la variable b para que se convierta en un uint8
    uint8 c = a * uint8(b); 
    

In the above, `a * b` returns a `uint`, but we were trying to store it as a `uint8`, which could cause potential problems. By casting it as a `uint8`, it works and the compiler won't throw an error.

# Vamos a probarlo

Let's fill in the body of our `_generateRandomDna` function! Here's what it should do:

1. The first line of code should take the `keccak256` hash of `abi.encodePacked(_str)` to generate a pseudo-random hexidecimal, typecast it as a `uint`, and finally store the result in a `uint` called `rand`.

2. Queremos que nuestro ADN tenga solamente 16 dígitos (¿Recuerdas nuestra variable `dnaModulus`?). Así que la segunda línea del código debería devolver `return` el módulo del valor de arriba (`%`) `dnaModulus`.