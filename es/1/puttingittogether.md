---
title: Juntándolo Todo
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

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

¡Estamos a punto de terminar nuestro generador aleatorio de Zombis! Vamos a crear una función pública que ponga todo junto.

Vamos a crear una función pública que tomará un parámetro, el nombre del zombi, y usará ese nombre para crear un zombi con un ADN aleatorio.

# Vamos a probarlo

1. Crea una función pública (`public`) llamada `createPseudoRandomZombie`. Recibirá un parámetro llamado `_name` (una cadena de caracteres `string`). _(Nota: declara esta función como `public` de la misma forma que hiciste para declarar las anteriores funciones `private`)_

2. La primera línea de la función debería llamar a la función `_generatePseudoRandomDna` usando `_name` como parámetro y guardar el resultado en un `uint` llamado `randDna`.

3. La segunda línea debería de llamar a la función `_createZombie` y pasarle los parámetros `_name` y `randDna`.

4. La solución debería contener 4 líneas de código (incluyendo la llave de cierre `}` de la función).
