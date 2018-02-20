---
titulo: Juntando todo
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Estamos cerca de terminar con nuestro generador de Zombie aleatorio! Vamos a crear una funcion publica que vincule todo junto.

Vamos a crear una funcion publica que tome una entrada, el nombre del zombie, y use el nombre para crear un zombie con un ADN aleatorio.

# Pongamoslo a prueba

1. Cree la funcion `public` llamada `createRandomZombie`. Esto tomara un parametro llamado `_name` (un `string`). _(Nota: Declare esta funcion `public` tal como declaro las funciones anteriores `private`)_

2. La primera linea de la funcion debe ejecutar la funcion `_generateRandomDna` en `_name`, y almacenarla en un `uint` llamado `randDna`.

3. La segunda linea debe ejetcutar la funcion `_createZombie` y pasarlo `_name` y`randDna`.

4. La solucion debe ser de 4 lineas de codigo (incluyendo el cierre `}` de la funcion).
