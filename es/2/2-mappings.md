---
title: Mapeos y Direcciones
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
      
      // declara los mapeos aquí
      
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
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
Vamos a hacer nuestro juego multijugador dandolés a los zombis un dueño en la base de datos.

Para esto, vamos a necesitar dos nuevos tipos de datos: `mapping` y `address`.

## Direcciones

La blockchain de Ethereum está creada por ***cuentas***, las cuales podrían ser como cuentas bancarias. Una cuenta tiene un balance de ***Ether*** (la divisa utilizada en la blockchain de Ethereum), y puedes recibir pagos en Ether de otras cuentas, de la misma manera que tu cuenta bancaria puede hacer transferencias a otras cuentas bancarias.

Cada cuenta tiene una `dirección`, que sería como el número de la cuenta bancaria. Es un identificador único que apuntado a una cuenta, y se asemejaría a algo así:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Esta dirección pertenece al equipo de CryptoZombies. Si estás disfrutando CryptoZombies, ¡puedes enviarnos algunos Ether! 

Vamos a entrar en el meollo de las direcciones en otra lección, por ahora solo necesitas entender que **una direccion está asociada a un usuario específico** (o un contrato inteligente).

Así que podemos utilizarlo como identificador único para nuestros zombis. Cuando un usuario crea un nuevo zombi interactuando con nuestra app, adjudicaremos la propiedad de esos zombis a la dirección de Ethereum que ha llamado a la función.

## Mapeos

En la Lección 1 vimos los ***structs*** y los ***arrays***. Los ***Mappings*** son otra forma de organizar los datos en Solidity.

Definir un `mapping` se asemejaría a esto:

    // Para una aplicación financial, guardamos un uint con el balance de su cuenta:
    mapping (address =>> uint) public accountBalance;
    // O podría usarse para guardar / ver los usuarios basados en ese userId
    mapping (uint =>> string) userIdToName;
    

A mapping is essentially a key-value store for storing and looking up data. In the first example, the key is an `address` and the value is a `uint`, and in the second example the key is a `uint` and the value a `string`.

# Put it to the test

To store zombie ownership, we're going to use two mappings: one that keeps track of the address that owns a zombie, and another that keeps track of how many zombies an owner has.

1. Create a mapping called `zombieToOwner`. The key will be a `uint` (we'll store and look up the zombie based on its id) and the value an `address`. Let's make this mapping `public`.

2. Create a mapping called `ownerZombieCount`, where the key is an `address` and the value a `uint`.