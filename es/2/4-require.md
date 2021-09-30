---
title: Require
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
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

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              emit NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              // empieza aquí
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

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              emit NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

En la lección 1, hicimos que los usuarios puediesen crear nuevos zombis llamando a `createPseudoRandomZombie` e introduciendo un nombre. Sin embargo, si un usuario continuase llamando a esta función crearía un ejército de zombis ilimitado, el juego no sería muy divertido.

Vamos a hacer que un jugador solo pueda llamar a esta función una vez. De esta manera los nuevo jugadores podrán llamar a esta función cuando empiezen el juego para crear el primer zombi de su ejército.

¿Cómo podemos hacer para que esta función solo pueda ser llamada una vez por jugador?

Para eso usamos `require`. `require` hace que la función lanze un error y pare de ejecutarse si la condición no es verdadera:

```
function sayHiToVitalik(string _name) public returns (string) {
  // Compara si _name es igual a "Vitalik". Lanza un error si no lo son.
  // (Nota: Solidity no tiene su propio comparador de strings, por lo que
  // compararemos sus hashes keccak256 para ver si sus strings son iguales)
  require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
  // Si es verdad, continuamos con la función:
  return "Hi!";
}
```

Si llamas a la función con `sayHiToVitalik("Vitalik")`, esta devolverá "Hi!". Si la llamas con cualquier otra entrada, lanzará un error y no se ejecutará.

De este modo `require` es muy útil a la hora de verificar que ciertas condiciones sean verdaderas antes de ejecutar una función.

# Vamos a probarlo

En nuestro juego de zombis, no queremos que un usuario pueda crear zombis ilimitados en su ejército llamado a `createPseudoRandomZombie` — esto haría que el juego no fuese muy divertido.

Vamos a usar `require` para asegurarnos que esta función solo pueda ser ejecutada una vez por usuario, cuando vayan a crear a su primer zombi.

1. Coloca una sentencia `require` al principio de la función `createPseudoRandomZombie`. La función debería comprobar que `ownerZombieCount[msg.sender]` sea igual a `0`, y si no que lanze un error.

> Nota: En Solidity, no importa que termino pongamos primero - ambos son equivalentes. De todas formas, como nuestro corrector de respuestas es bastante básico, solo aceptamos una respuesta correcta - esta espera que `ownerZombieCount[msg.sender]` vaya primero.
