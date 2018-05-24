---
title: Keccak256 y Encasillamiento
actions:
  - 'comprobarRespuesta'
  - 'pistas'
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
      
      Zombie[] public zombies;
      
      function _createZombie(string _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      }
      
      function _generateRandomDna(string _str) private view returns (uint) {
      // iniciar aquí
      }
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      }
---
Queremos que nuestra función `_generateRandomDna` devuelva un valor (semi) aleatorio `uint`. Comó se puede conseguir esto?

Ethereum incluye una función hash llamada `keccak256`, que es una versión de SHA3. Una función hash lo que hace es mapear una cadena de caracteres a un número aleatorio hexadecimal de 256-bits. Un pequeño cambio en la cadena de texto (string) producirá un gran cambio en el hash.

Es muy útil para muchas cosas, pero por ahora vamos a usarlo solamente para generar un número cuasi-aleatorio.

Ejemplo:

    //6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
    keccak256("aaaab");
    //b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
    keccak256("aaaac");
    

Como puedes ver, el valor devuelto para cada caso es completamente distinto, a pesar de que sólo hemos cambiado un carácter del argumento.

> Nota: Generar números aleatorios de forma **segura** en la cadena de bloques es algo muy difícil. Our method here is insecure, but since security isn't top priority for our Zombie DNA, it will be good enough for our purposes.

## Typecasting

Sometimes you need to convert between data types. Take the following example:

    uint8 a = 5;
    uint b = 6;
    // throws an error because a * b returns a uint, not uint8:
    uint8 c = a * b; 
    // we have to typecast b as a uint8 to make it work:
    uint8 c = a * uint8(b); 
    

In the above, `a * b` returns a `uint`, but we were trying to store it as a `uint8`, which could cause potential problems. By casting it as a `uint8`, it works and the compiler won't throw an error.

# Put it to the test

Let's fill in the body of our `_generateRandomDna` function! Here's what it should do:

1. The first line of code should take the `keccak256` hash of `_str` to generate a pseudo-random hexidecimal, typecast it as a `uint`, and finally store the result in a `uint` called `rand`.

2. We want our DNA to only be 16 digits long (remember our `dnaModulus`?). So the second line of code should `return` the above value modulus (`%`) `dnaModulus`.