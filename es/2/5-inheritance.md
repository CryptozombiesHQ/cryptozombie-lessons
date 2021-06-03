---
title: Herencia
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
      require(ownerZombieCount[msg.sender] == 0);
      uint randDna = _generateRandomDna(_name);
      _createZombie(_name, randDna);
      }

      }

      // Start here
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
      contract ZombieFeeding is ZombieFactory {
      }
---

Nuestro código está haciendose un poco largo. En lugar de hacer un contrato extremandamente largo, a veces tiene sentido separar la lógica de nuestro código en multiples contratos para organizar el código.

Una característica de Solidity que hace más manejable esto es la ***herencia*** de los contratos:

    contract Doge {
      function catchphrase() public returns (string memory) {
        return "So Wow CryptoDoge";
      }
    }
    
    contract BabyDoge is Doge {
      function anotherCatchphrase() public returns (string memory) {
        return "Such Moon BabyDoge";
      }
    }
    

`BabyDoge` ***hereda*** de `Doge`. Eso significa que si compilas y ejecutas `BabyDoge`, tendrá acceso tanto a `catchphrase()` como a `anotherCatchphrase()` (y a cualquier otra función publica que definamos en `Doge`).

Esto puede usarse como una herencia lógica (como una subclase, un `Gato` es un `Animal`). Pero también puede usarse simplemente para organizar tu código agrupando lógica similar en diferentes clases.

# Vamos a probarlo

En los siguientes capítulos, vamos a implementar la funcionalidad para que nuestros zombis se alimenten y se multipliquen. Vamos a añadir esa lógica en su propia clase que herede de `ZombieFactory`.

1. Crea un contrato llamado `ZombieFeeding` debajo de `ZombieFactory`. Este contrato heredará de nuestro contrato `ZombieFactory`.