---
title: Eventos
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      // declare our event here

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      Zombie[] public zombies;

      function _createZombie(string memory _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      // and fire it here
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
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string memory _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

¡Nuestro contrato está casi terminado! Ahora vamos a añadir un ***evento***.

Los ***Eventos*** son la forma en la que nuestro contrato comunica que algo sucedió en la cadena de bloques a la interfaz del usuario, el cual puede estar 'escuchando' ciertos eventos y hacer algo cuando suceden.

Ejemplo:

    // declare the event
    event IntegersAdded(uint x, uint y, uint result);
    
    function add(uint _x, uint _y) public returns (uint) {
      uint result = _x + _y;
      // fire an event to let the app know the function was called:
      emit IntegersAdded(_x, _y, result);
      return result;
    }
    

Your app front-end could then listen for the event. A JavaScript implementation would look something like:

    YourContract.IntegersAdded(function(error, result) {
      // do something with result
    })
    

# Vamos a probarlo

Queremos tener un evento que nos haga saber cada vez que un zombi nuevo se ha creado, de forma que pueda mostrarnoslo.

1. Declara un evento `event` llamado `NewZombie`. Debería pasar las variables `zombieId` (un `uint`), `name` (un `string`), y `dna` (un `uint`).

2. Modifica la función `createZombie` para lanzar el evento `NewZombie` después de haber añadido el nuevo Zombi a nuestro array de `zombies`.

3. Vas a necesitar el `id` del zombi. `array.push()` devuelve un `uint` con el nuevo tamaño del array - y como primer elemento del array tiene índice 0, `array.push() - 1` será el índice del zombi que acabamos de añadir. Guarda el resultado de `zombies.push() - 1` en un número de tipo `uint` llamado `id`, así podrás usarlo en el evento `NewZombie` de la siguiente línea.