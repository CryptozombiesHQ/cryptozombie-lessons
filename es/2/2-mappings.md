---
title: Mapeos y Direcciones
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

      // declare mappings here

      function _createZombie(string memory _name, uint _dna) private {
      uint id = zombies.push(Zombie(_name, _dna)) - 1;
      emit NewZombie(id, _name, _dna);
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
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

Vamos a hacer nuestro juego multijugador dandolés a los zombis un dueño en la base de datos.

Para esto, vamos a necesitar dos nuevos tipos de datos: `mapping` y `address`.

## Direcciones

La blockchain de Ethereum está creada por ***cuentas***, las cuales podrían ser como cuentas bancarias. Una cuenta tiene un balance de ***Ether*** (la divisa utilizada en la blockchain de Ethereum), y puedes recibir pagos en Ether de otras cuentas, de la misma manera que tu cuenta bancaria puede hacer transferencias a otras cuentas bancarias.

Cada cuenta tiene una dirección `address`, que sería como el número de la cuenta bancaria. Es un identificador único que apuntado a una cuenta, y se asemejaría a algo así:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(This address belongs to the CryptoZombies team. If you're enjoying CryptoZombies, you can send us some Ether! 

Vamos a entrar en el meollo de las direcciones en otra lección, por ahora solo necesitas entender que **una direccion está asociada a un usuario específico** (o un contrato inteligente).

Así que podemos utilizarlo como identificador único para nuestros zombis. Cuando un usuario crea un nuevo zombi interactuando con nuestra app, adjudicaremos la propiedad de esos zombis a la dirección de Ethereum que ha llamado a la función.

## Mapeos

En la Lección 1 observamos los ***structs*** y los ***arrays***. Los ***Mappings*** son otra forma de organizar los datos en Solidity.

Definir un `mapping` se asemejaría a esto:

    // Para una aplicación financial, guardamos un uint con el balance de su cuenta:
    mapping (address => uint) public accountBalance;
    // O podría usarse para guardar / ver los usuarios basados en ese userId
    mapping (uint => string) userIdToName;
    

Un mapeo es esencialmente una asociación valor-clave para guardar y ver datos. En el primer ejemplo, la llave es un `address` (dirección) y el valor es un `uint`, y en el segundo ejemplo la llave es un `uint` y el valor un `string`.

# Vamos a probarlo

Para guardar la propiedad de un zombi, vamos a usar dos mapeos: el primero guardará el rastro de la dirección que posee ese zombi y la otra guardará el rastro de cuantos zombis posee cada propietario.

1. Crea un mapeo llamado `zombieToOwner`. Su llave será un `uint` (guardaremos y podremos ver el zombi basados en esta id) y el valor será un `address`. Vamos a hacer este mapeo `public`.

2. Crea un mapeo llamado `ownerZombieCount`, donde la llave es un `address` y el valor un `uint`.