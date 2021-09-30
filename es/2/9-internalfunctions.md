---
title: Más en la Visibilidad de Funciones
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
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

            // edita la definición de la función abajo
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
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

          function _createZombie(string _name, uint _dna) internal {
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

**¡El código de tu lección anterior tenía un error!**

Si intentas compilarlo, el compilador lanzará un error.

El problema es que hemos intentado llamar a la función `_createZombie` desde `ZombieFeeding`, pero `_createZombie` es una función `private` dentro de `ZombieFactory`. Eso significa que ninguno de los demás contratos que hereden de `ZombieFactory` podrán acceder a ello.

## Internal y External

Además de `public` y `private`, Solidity tiene dos tipos de visibilidad más para las funciones: `internal` y `external`.

`internal` es lo mismo que `private`, a excepción de que es también accesible desde otros contratos que hereden de este. **(¡Ey, suena como lo que necesitamos aquí!)**.

`external` es parecido a `public`, a excepción que estas funciones SOLO puedes ser llamadas desde fuera del contrato — no pueden ser llamadas por otras funciones dentro de ese contrato. Hablaremos más adelante sobre cuando querrás usar `external` vs `public`.

Para declarar las funciones `internal` o `external`, la sintaxis es igual que `private` y `public`:

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // Podemos llamar a esta función aquí porque es internal
    eat();
  }
}
```

# Vamos a probarlo

1. Cambia `_createZombie()` de `private` a `internal` así otros contratos podrán acceder a ella.

  Hemos vuelto a colocarte en la pestaña correspondiente, `zombiefactory.sol`.
