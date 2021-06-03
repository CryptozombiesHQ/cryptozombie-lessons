---
title: Juntandolo Todo
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity  >=0.5.0 <0.6.0;

      contract ZombieFactory {

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      Zombie[] public zombies;

      function _createZombie(string memory _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      }

      function _generateRandomDna(string memory _str) private view returns (uint) {
      uint rand = uint(keccak256(abi.encodePacked(_str)));
      return rand % dnaModulus;
      }

      // start here

      }
    answer: >
      pragma solidity  >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string memory _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

¡Estamos a punto de terminar con nuestro generador aleatorio de Zombis! Vamos a crear una función pública que ponga todo junto.

Vamos a crear una función pública que tomará un parámetro, el nombre del zombi, y usará ese nombre para crear un zombi con un ADN aleatorio.

# Vamos a probarlo

1. Crea una función pública `public` llamada `createRandomZombie`. It will take one parameter named `_name` (a `string` with the data location set to `memory`). *(Nota: Declara esta función como `public` de la misma forma que hiciste para declarar las anteriores funciones `private`)*

2. La primera línea de la función debería llamar a la función `_generateRandomDna` usando `_name`, como parámetro y guardar el resultado en un `uint` llamado `randDna`.

3. La segunda línea debería de llamar a la función `_createZombie` y pasarle los parámetros `_name` y `randDna`.

4. La solución debería contener 4 líneas de código (incluyendo la llave de cierre `}` de la función).