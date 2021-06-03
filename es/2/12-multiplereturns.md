---
title: Manejando Múltiples Valores Devueltos
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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        _createZombie("NoName", newDna);
        }

        // define function here

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
      address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d; KittyInterface kittyContract = KittyInterface(ckAddress);
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna); }
      }
---

Esta función `getKitty` es el primer ejemplo que vamos a ver que devuelva multiples valores. Vamos a ver como manejarlos:

    function multipleReturns() internal returns(uint a, uint b, uint c) {
      return (1, 2, 3);
    }
    
    function processMultipleReturns() external {
      uint a;
      uint b;
      uint c;
      // Así es como hacemos múltiples asignaciones:
      (a, b, c) = multipleReturns();
    }
    
    // O si solo nos importa el último de estos valores:
    function getLastReturnValue() external {
      uint c;
      // Podemos dejar el resto de campos en blanco:
      (,,c) = multipleReturns();
    }
    

# Vamos a probarlo

¡Es la hora de interactuar con el contrato de los CryptoKitties!

Vamos a hacer una función que obtenga los genes del gato del contrato:

1. Haz una función llamada `feedOnKitty`. Tomará 2 parámetros `uint`, `_zombieId` y `_kittyId`, y deberá ser una función `public`.

2. La función debería declarar un `uint` llamado `kittyDna`.
    
    > Nota: En nuestra `KittyInterface`, `genes` es un `uint256` — pero si recuerdas en la lección 1, `uint` es un alias para `uint256` — son la misma cosa.

3. La función entonces debería llamar a la función `kittyContract.getKitty` con `_kittyId` y guardar `genes` en `kittyDna`. Recuerda — `getKitty` devuelve un montón de variables. (10 para ser exactos — Soy bueno, ¡los he contado para ti!). Pero el único que nos interesa es el último de ellos, `genes`. ¡Cuenta las comas cuidadosamente!

4. Finalmente, la función debería llamar a `feedAndMultiply`, y pasarle tanto `_zombieId` como `kittyDna`.