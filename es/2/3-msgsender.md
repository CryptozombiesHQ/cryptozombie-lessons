---
title: Msg.sender
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
              // empieza aquí
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
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Ahora que tenemos nuestros mapeos para seguir el rastro del propietario de un zombi, queremos actualizar el metodo `_createZombie` para que los utilice.

Para poder hacer esto, necesitamos algo llamado `msg.sender`.

## msg.sender

En Solidity, hay una serie de variables globales que están disponibles para todas las funciones. Una de estas es `msg.sender`, que hace referencia a la `dirección` de la persona (o el contrato inteligente) que ha llamado a esa función.

> Nota: En Solidity, la ejecución de una función necesita empezar con una llamada exterior. Un contrato se sentará en la blockchain sin hacer nada esperando a que alguien llame a una de sus funciones. Así que siempre habrá un `msg.sender`.

Aquí tenemos un ejemplo de como usar `msg.sender` y actualizar un `mapping`:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Actualiza tu mapeo `favoriteNumber` para guardar `_myNumber` dentro de `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ La sintaxis para guardar datos en un mapeo es como en los arrays
}

function whatIsMyNumber() public view returns (uint) {
  // Conseguimos el valor guardado en la dirección del emisor
  // Será `0` si el emisor no ha llamado a `setMyNumber` todavía
  return favoriteNumber[msg.sender];
}
```

En este trivial ejemplo, cualquiera puede llamar a `setMyNumber` y guardar un `uint` en nuestro contrato, que estará atado a su dirección. Entonces, cuando llamen a `whatIsMyNumber`, debería devolverles el `uint` que han guardado.

Usando `msg.sender` te da la seguridad de la blockchain de Ethereum  — la única forma de que otra persona edite la información de esta sería robandole la clave privada asociada a la dirección Ethereum.

# Vamos a probarlo

Vamos a actualizar nuestro método `_createZombie` de la Lección para asignarle la propiedad de un zombi a quien llame a la función.

1. Primero, después de recibir la `id` del nuevo zombi, actualizamos nuestro mapeo `zombieToOwner` para que guarde `msg.sender` bajo esa `id`.

2. Segundo, incrementamos `ownerZombieCount` para este `msg.sender`. 

En Solidity, puedes incrementar un `uint` con `++`, así como en javascript:

```
uint number = 0;
number++;
// `number` es ahora `1`
```

Tu resultado final para este capítulo debería tener 2 líneas de código.
