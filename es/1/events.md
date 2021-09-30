---
title: Eventos
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          // declara nuestro evento aquí

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // y lánzalo aquí
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
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
La aplicación con la interfaz de usuario podría entonces estar escuchando el evento. Una implementación en JavaScript sería así:

```
YourContract.IntegersAdded(function(error, result) {
  // hacer algo con `result`
}
```

# Vamos a probarlo

Queremos tener un evento que nos haga saber cada vez que un zombi nuevo se ha creado, de forma que pueda mostrarnoslo.

1. Declara un `evento` llamado `NewZombie`. Debería pasar las variables `zombieId` (un `uint`), `name` (un `string`), y `dna` (un `uint`).

2. Modifica la función `_createZombie` para lanzar el evento `NewZombie` después de haber añadido el nuevo Zombi a nuestro array de `zombies`.

3. Vas a necesitar el `id` del zombi. `array.push()` devuelve un `uint` con el nuevo tañamo del array - y como el primer elemento del array tiene índice 0, `array.push() - 1` será el índice del zombi que acabamos de añadir. Guarda el resultado de `zombies.push() - 1` en un número de tipo `uint` llamado `id`, así podrás usarlo en el evento `NewZombie` de la siguiente línea.
