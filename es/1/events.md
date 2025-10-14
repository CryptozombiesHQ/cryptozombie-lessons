---
title: Eventos (Events)
actions: [ '', '' ]
requireLogin: true
material:
  editor:
    language: ""
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          // 1. Declare your event here

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna)); // 2. Store the result of `zombies.push(...) - 1` in a `uint` called `id`
              // 3. Fire the new event
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string memory _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: |
      pragma solidity ^0.4.25;

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
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

¡Nuestro contrato está casi terminado! Añadamos ahora un **_evento_**.

Los **_eventos_** son la forma en la que nuestro contrato comunica que algo sucedió en la cadena de bloques a la interfaz de usuario, el cual puede estar 'escuchando' ciertos eventos y hacer algo cuando sucedan.

Ejemplo:

```
// declara el evento
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // lanza el evento para hacer saber a tu aplicación que la función ha sido llamada:
  emit IntegersAdded(_x, _y, result);
  return result;
}
```

El front-end de tu aplicación podría entonces escuchar el evento. Una implementación en JavaScript sería así:

```
YourContract.IntegersAdded(function(error, result) {
  // do something with the result
})
```

# Ponlo a prueba

Queremos que nuestro front-end sepa cada vez que se creó un nuevo zombie, para que la aplicación pueda mostrarlo.

1. Declara un `event` llamado `NewZombie`. Debería pasar las variables `zombieId` (un `uint`), `name` (un `string`), y `dna` (un `uint`).

2. Modify the first line of the `_createZombie` function. Vas a necesitar el `id` del zombi. The `array.push()` function returns a `uint` of the new length of the array - and since the first item in an array has index 0, `array.push() - 1` will be the index of the zombie we just added. Guarda el resultado de `zombies.push() - 1` en un número de tipo `uint` llamado `id`, así podrás usarlo en el evento `NewZombie` de la siguiente línea.

3. On the next line, fire the `NewZombie` event.

