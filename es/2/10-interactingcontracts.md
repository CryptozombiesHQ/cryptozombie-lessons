---
title: '¿Qué Comen Los Zombis?'
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefactory.sol";

        // Create KittyInterface here

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

        function _createZombie(string memory _name, uint _dna) internal {
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
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      }
---

¡Es hora de alimentar a nuestros zombis! Y ¿Qué es lo que más les gusta comer?

Bueno lo que pasa es que a los CryptoZombies les encanta comer...

**CryptoKitties!** 

(Yes, I'm serious 

Para hacer esto necesitamos leer el kittyDna de el contrato inteligente de los CryptoKitties. Podemos hacer eso debido a que los datos de los CryptoKitties guardados en la blockchain son públicos. ¡¿No es blockchain genial?!

Don't worry — our game isn't actually going to hurt anyone's CryptoKitty. We're only *reading* the CryptoKitties data, we're not able to actually delete it 

## Interactuando con otros contratos

Para que nuestro contrato pueda hablar a otro contrato de la blockchain que no poseemos, necesitamos definir una ***interfaz***.

Vamos a ver un simple ejemplo. Digamos que hay un contrato en la blockchain que se veía así:

    contract LuckyNumber {
      mapping(address => uint) numbers;
    
      function setNum(uint _num) public {
        numbers[msg.sender] = _num;
      }
    
      function getNum(address _myAddress) public view returns (uint) {
        return numbers[_myAddress];
      }
    }
    

Este sería un simple contrato donde cualquiera puede guardar su número de la suerte, y este estará asociado a su dirección de Ethereum. De esta forma cualquiera podría ver el número de la suerte de una persona usando su dirección.

Ahora digamos que tenemos un contrato externo que quiere leer la información de este contrato usando la función `getNum`.

Primero tenemos que definir una ***interfaz*** del contrato `LuckyNumber`:

    contract NumberInterface {
      function getNum(address _myAddress) public view returns (uint);
    }
    

Ten en cuenta que esto se asemeja a definir un contrato, con algunas diferencias. Primero, solo declaramos las funciones con las que queremos interactuar — en este caso `getNum` — y no mencionamos ninguna otra función o variables de estado.

Segundo, no definimos el cuerpo de la función. En vez de usar las llaves (`{` y `}`), solamente terminaremos la función añadiendo un punto y coma al final de la declaración (`;`).

Sería como definir el esqueleto del contrato. Así es como el compilador sabe que es una interfaz.

Incluyendo esta interfaz en el código de tu dapp nuestro contrato sabe como son las funciones de otros contratos, como llamarlas, y que tipo de respuesta recibiremos.

Entraremos en como llamar a las funciones de otros contratos en la siguiente lección, por ahora vamos a declarar nuestra interfaz para el contrato de CryptoKitties.

# Vamos a probarlo

Hemos mirado el código fuente de CryptoKitties por tí, y hemos encontrado una función llamada `getKitty` que devuelve todos los datos de un kitty, incluyendo sus "genes" (¡que es lo que nuestro juego de zombis necesita para crear un nuevo zombi!).

La función es así:

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
    
        // si la variable es 0 entonces no esta gestando
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
    

La función parece un poco diferente de las que hemos usado. Puedes ver que devuelve... una lista de valores diferentes. Si vienes de un lenguaje de programación como Javascript, esto es diferente — en Solidity puedes devolver más de un valor a una función.

Ahora que sabemos como es esta función, podemos usarla para crear una interfaz:

1. Define una interfaz llamada `KittyInterface`. Recuerda, es como crear un nuevo contrato — usamos la palabra clave `contract`.

2. Dentro de la interfaz, define la función `getKitty` (que debería ser un copia/pega de la función de arriba, pero con un punto y coma después de la definición de `returns`, en vez de todo lo que hay dentro de las llaves.