---
title: ¿Qué Comen Los Zombis?
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // Crea la KittyInterface aquí

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

        }
      "zombiefactory.sol": |
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

            function _createZombie(string _name, uint _dna) internal {
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
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

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

¡Es hora de alimentar a nuestros zombis! Y ¿Qué es lo que más les gusta comer?

Bueno lo que pasa es que a los CryptoZombies lo que les encanta comer es...

**¡CryptoKitties!** 😱😱😱

(Si, es enserio 😆 )

Para hacer esto necesitamos leer el kittyDna de el contrato inteligente CryptoKitties. Podemos hacer eso debido a que los datos de los CryptoKitties guardados en la blockchain son públicos. ¡¿No es blockchain genial?!

No te preocupes - nuestro juego aún no va a hacer dañor a ningún CryptoKitty. Solo vamos a *leer* los datos de los CryptoKitties, no podemos borrarlos 😉

## Interactuando con otros contratos

Para que nuestro contrato pueda hablar a otro contrato de la blockchain que no poseemos, necesitamos definir una **_interfaz_**.

Vamos a ver un simple ejemplo. Digamos que hay un contrato en la blockchain tal que así:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

Este seria un simple contrato donde cualquiera puede guardar su número de la suerte, y este estará asociado a su dirección de Ethereum. De esta forma cualquiera podría ver el número de la suerte de una persona usando su dirección.

Ahora digamos que tenemos un contrato externo que quiere leer la información de este contrato usando la función `getNum`. 

Primero debemos usar una **_interfaz_** del contrato `LuckyNumber`:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Ten en cuenta que esto se asemeja a definir un contrato, con alguna diferencia. Primero, solo declaramos las funciones con las que queremos interactuar - en este caso `getNum` — y no mencionamos ninguna otra función o variables de estado.

Segundo, no definimos el cuerpo de la función. En vez de usar las llaves (`{` y `}`), solamente terminaremos la función añadiendo un punto y coma al final de la declaración (`;`).

Sería como definir el esqueleto del contrato. Así es como conoce el compilador a las interfaces.

Incluyendo esta interfaz en el código de tu dapp nuestro contrato sabe como son las funciones de otro contrato, como llamarlas, y que tipo de respuesta recibiremos.

Entraremos en como llamar a las funciones de otros contratos en la siguiente lección, por ahora vamos a declarar nuestra interfaz para el contrato de CryptoKitties.

# Vamos a probarlo

Hemos mirado el código fuente de CryptoKitties por tí, y hemos encontrado una functión llamada `getKitty` que devuelve todos los datos de un kitty, incluyendo sus "genes" (¡que es lo que nuestro juego de zombis necesita para crear un nuevo zombi!).

La función es así:

```
function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
) {
    Kitty storage kit = kitties[_id];

    // si esta variable es 0 entonces no se esta gestando
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

La función parece algo diferente de las que hemos usado. Puedes ver que devuelve... una lista de diferentes valores. Si vienes de un lenguaje de programación como Javascript, esto es diferente - en Solidity puedes devolver más de un valor en una función.

Ahora que sabemos como es esta función, podemos usarla para crear una interfaz:

1. Define una interfaz llamada `KittyInterface`. Recuerda, es como crear un nuevo contrato - usamos la palabra clave `contract`.

2. Dentro de la interfaz, define la función `getKitty` (que debería ser un copia/pega de la función de arriba, pero con un punto y coma después de la definición de `returns`, en vez de todo lo que hay dentro de las llaves.
