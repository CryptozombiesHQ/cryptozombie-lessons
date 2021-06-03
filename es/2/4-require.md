---
title: Require
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      event NewZombie(uint zombieId, string name, uint dna);

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      Zombie[] public zombies;

      mapping (uint => address) public zombieToOwner;
      mapping (address => uint) ownerZombieCount;

      function _createZombie(string memory _name, uint _dna) private {
      uint id = zombies.push(Zombie(_name, _dna)) - 1;
      zombieToOwner[id] = msg.sender;
      ownerZombieCount[msg.sender]++;
      emit NewZombie(id, _name, _dna);
      }

      function _generateRandomDna(string memory _str) private view returns (uint) {
      uint rand = uint(keccak256(abi.encodePacked(_str)));
      return rand % dnaModulus;
      }

      function createRandomZombie(string memory _name) public {
      // start here
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
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

En la lección 1, hicimos que los usuarios puediesen crear nuevos zombis llamando a `createRandomZombie` y introduciendo un nombre. Sin embargo, si un usuario continuase llamando a esta función crearía un ejército de zombis ilimitado, el juego no sería muy divertido.

Vamos a hacer que un jugador solo pueda llamar a esta función una vez. De esta manera los nuevo jugadores podrán llamar a esta función cuando empiezen el juego para crear el primer zombi de su ejército.

¿Cómo podemos hacer para que esta función solo pueda ser llamada una vez por jugador?

Para eso usamos `require`. `require` hace que la función lanze un error y pare de ejecutarse si la condición no es verdadera:

    function sayHiToVitalik(string memory _name) public returns (string memory) {
      // Compares if _name equals "Vitalik". Lanza un error y existe si no es verdadero.
      // (Side note: Solidity doesn't have native string comparison, so we
      // compare their keccak256 hashes to see if the strings are equal)
      require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
      // If it's true, proceed with the function:
      return "Hi!";
    }
    

Si llamas a la función con `sayHiToVitalik("Vitalik")`, esta devolverá "Hi!". Si la llamas con cualquier otra entrada, lanzará un error y no se ejecutará.

De este modo `require` es muy útil a la hora de verificar que ciertas condiciones sean verdaderas antes de ejecutar una función.

# Vamos a probarlo

En nuestro juego de zombis, no queremos que un usuario pueda crear zombis ilimitados en su ejército llamado a `createRandomZombie` — esto haría que el juego no fuese muy divertido.

Vamos a usar `require` para asegurarnos que esta función solo pueda ser ejecutada una vez por usuario, cuando vayan a crear su primer zombi.

1. Coloca una declaración `require` al principio de la función `createRandomZombie`. La función debería comprobar que `ownerZombieCount[msg.sender]` sea igual a `0`, y si no que lanze un error.

> Nota: En Solidity, no importa que término pongamos primero - ambos son equivalentes. De todas formas, como nuestro corrector de respuestas es bastante básico, solo aceptamos una respuesta correcta - esta espera que `ownerZombieCount[msg.sender]` vaya primero.