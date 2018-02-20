---
titulo: Eventos
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // declare our event here

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // and fire it here
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
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
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

Nuestro contrato esta casi terminado! Ahora agreguemos un **_evento_**.

**_Eventos_** son una manera de que su contrato comunique que algo sucedio en el blockchain al front-end de su aplicacion, el cual puede estar 'escuchando' ciertos eventos y tomando medidas cuando eso suceda.

Ejemplo:

```
// declare the event
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // fire an event to let the app know the function was called:
  IntegersAdded(_x, _y, result);
  return result;
}
```

Su aplicacion front-end podria entonces escuchar el evento. Una implementacion de javascript seria algo asi como: 

```
YourContract.IntegersAdded(function(error, result) { 
  // do something with result
}
```

# Pongamoslo a prueba

Nosotros queremos un evento para que nuestro front-end reconzca cada vez que se cree un nuevo zombie, y asi la aplicacion pueda mostrarlo.

1. Declare un `event` llamado `NewZombie`. Deberia pasar `zombieId` (un `uint`), `name` (un `string`), and `dna` (un `uint`).

2. Modifique la funcion `_createZombie` para activar el evento `NewZombie` despues de agregar el nuevo Zombie a nuestro arreglo `zombies`. 

3. Necesitaras el `id` del zombie. `array.push()` devuelve un `uint` de la nueva longitud del arreglo -  y dado que el primer elemento del arreglo tiene un indice 0, `array.push() - 1` sera el indice del zombie que acabamos de anadir. Guarde el resultado de `zombies.push() - 1` en un `uint` llamado `id`, para que pueda usarlo en el evento `NewZombie` en la siguiente linea.
