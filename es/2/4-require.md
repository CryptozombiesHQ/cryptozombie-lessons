---
title: Require
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode: |
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
      
      mapping (uint => address) public zombieToOwner;
      mapping (address => uint) ownerZombieCount;
      
      function _createZombie(string _name, uint _dna) private {
      uint id = zombies.push(Zombie(_name, _dna)) - 1;
      zombieToOwner[id] = msg.sender;
      ownerZombieCount[msg.sender]++;
      NewZombie(id, _name, _dna);
      }
      
      function _generateRandomDna(string _str) private view returns (uint) {
      uint rand = uint(keccak256(_str));
      return rand % dnaModulus;
      }
      
      function createRandomZombie(string _name) public {
      // iniciar aquí
      uint randDna = _generateRandomDna(_name);
      _createZombie(_name, randDna);
      }
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
En la lección 1, hicimos que los usuarios puediesen crear nuevos zombis llamando a `createRandomZombie` y introduciendo un nombre. Sin embargo, si un usuario continuase llamando a esta función crearía un ejército de zombis ilimitado, el juego no sería muy divertido.

Vamos a hacer que un jugador solo pueda llamar a esta función una vez. De esta manera los nuevo jugadores podrán llamar a esta función cuando empiezen el juego para crear el primer zombi de su ejército.

¿Cómo podemos hacer para que esta función solo pueda ser llamada una vez por jugador?

Para eso usamos `require`. `require` hace que la función lanze un error y pare de ejecutarse si la condición no es verdadera:

    function sayHiToVitalik(string _name) public returns (string) {
      // Compara si _name es igual a "Vitalik". Lanza un error y existe si no es verdadero.
      // (Nota: Solidity no tiene su propio comparador de strings, por lo que
      // compararemos sus hashes keccak256 para ver si sus strings son iguales)
      require(keccak256(_name) == keccak256("Vitalik"));
      // Si es verdad, continuamos con la función:
      return "Hi!";
     }
    }
    

If you call this function with `sayHiToVitalik("Vitalik")`, it will return "Hi!". If you call it with any other input, it will throw an error and not execute.

Thus `require` is quite useful for verifying certain conditions that must be true before running a function.

# Put it to the test

In our zombie game, we don't want the user to be able to create unlimited zombies in their army by repeatedly calling `createRandomZombie` — it would make the game not very fun.

Let's use `require` to make sure this function only gets executed one time per user, when they create their first zombie.

1. Put a `require` statement at the beginning of `createRandomZombie`. The function should check to make sure `ownerZombieCount[msg.sender]` is equal to ``, and throw an error otherwise.

> Note: In Solidity, it doesn't matter which term you put first — both orders are equivalent. However, since our answer checker is really basic, it will only accept one answer as correct — it's expecting `ownerZombieCount[msg.sender]` to come first.