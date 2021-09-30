---
title: ADN del Zombi
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // empieza aquí
          }

        }
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
    answer: >
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
---

Vamos a terminar de escribir la función `feedAndMultiply`.

La fórmula para calcular el ADN del nuevo zombi es simple: Es simplemente el promedio entre el ADN del zombi que hemos alimentado y el ADN del zombi objetivo. 

Por ejemplo:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ va a ser igual a 3333333333333333
}
```

Mas tarde haremos nuestra fórmula más complicada si queremos, añadiendole por ejemplo algún valor aleatorio al nuevo ADN. Pero por el momento vamos a dejarlo simple - siempre podemos volver a ello más adelante.

# Vamos a probarlo

1. Primero necesitamos estar seguro que el `_targetDna` no es mayor de 16 dígitos. Para ello, podemos fijar que el valor de `_targetDna` sea igual a `_targetDna % dnaModulus` para que únicamente guarde los últimos 16 dígitos.

2. Después nuestra función deberá declarar un `uint` llamado `newDna`, y fijarle el valor del promedio entre el ADN de `myZombie` y el ADN de `_targetDna` (como en el ejemplo anterior).

  > Nota: Puedes acceder a las propiedades de `myZombie` usando `myZombie.name` y `myZombie.dna`

3. Una vez que tengamos el ADN, vamos a llamar a `_createZombie`. Puedes mirar en la pestaña `zombiefactory.sol` si has olvidado los parámetros que esta función necesita para ser llamada. Ten en cuenta que necesita un nombre, así que de momento le pondremos de nombre `"NoName"` — podremos escribir una función para cambiar el nombre del zombi más adelante.

> Nota: ¡Quizá notes un problema en nuestro código, que no encaja en Solidity! No te preocupes, arreglaremos esto en el siguiente capítulo ;)
