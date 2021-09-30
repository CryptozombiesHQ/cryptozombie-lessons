---
title: Modificadores de Zombis
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // Empieza aquí

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

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

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "ownable.sol": |
       pragma solidity ^0.4.25;

          /**
          * @title Ownable
          * @dev The Ownable contract has an owner address, and provides basic authorization control
          * functions, this simplifies the implementation of "user permissions".
          */
          contract Ownable {
            address private _owner;

            event OwnershipTransferred(
              address indexed previousOwner,
              address indexed newOwner
            );

            /**
            * @dev The Ownable constructor sets the original `owner` of the contract to the sender
            * account.
            */
            constructor() internal {
              _owner = msg.sender;
              emit OwnershipTransferred(address(0), _owner);
            }

            /**
            * @return the address of the owner.
            */
            function owner() public view returns(address) {
              return _owner;
            }

            /**
            * @dev Throws if called by any account other than the owner.
            */
            modifier onlyOwner() {
              require(isOwner());
              _;
            }

            /**
            * @return true if `msg.sender` is the owner of the contract.
            */
            function isOwner() public view returns(bool) {
              return msg.sender == _owner;
            }

            /**
            * @dev Allows the current owner to relinquish control of the contract.
            * @notice Renouncing to ownership will leave the contract without an owner.
            * It will not be possible to call the functions with the `onlyOwner`
            * modifier anymore.
            */
            function renounceOwnership() public onlyOwner {
              emit OwnershipTransferred(_owner, address(0));
              _owner = address(0);
            }

            /**
            * @dev Allows the current owner to transfer control of the contract to a newOwner.
            * @param newOwner The address to transfer ownership to.
            */
            function transferOwnership(address newOwner) public onlyOwner {
              _transferOwnership(newOwner);
            }

            /**
            * @dev Transfers control of the contract to a newOwner.
            * @param newOwner The address to transfer ownership to.
            */
            function _transferOwnership(address newOwner) internal {
              require(newOwner != address(0));
              emit OwnershipTransferred(_owner, newOwner);
              _owner = newOwner;
            }
          }
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

      }
---

Ahora vamos a usar nuestro modificador `aboveLevel`para crear algunas funciones.

Nuestro juego tendrá algunos incentivos para la gente que suba de nivel a sus zombis:

- Para los zombis de nivel 2 y superior, los usuarios podrán cambiarle el nombre.
- Para los zombis de nivel 20 y superior, los usarios podrán darle un ADN personalizado.

Vamos a implementar estas funciones abajo. Aquí tienes un ejemplo de la lección anterior como referencia:

```
// Un mapeo para guardar la edad del usuario:
mapping (uint => uint) public age;

// Modificador que requiere que ese usuario sea mayor a cierta edad:
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

// Tiene que ser mayor a 16 años para conducir un coche (en EEUU, al menos).
function driveCar(uint _userId) public olderThan(16, _userId) {
  // La lógica de la función
}
```

## Vamos a probarlo

1. Crea una función llamada `changeName`. Esta recibirá 2 argumentos: `_zombieId` (un `uint`), y `_newName` (un `string`), y hazla `external`. Esta deberá tener el modificador `aboveLevel`, y le pasará `2` como parámetro `_level`. (No te olvides de pasarle el `_zombieId` también).

2. En esta función, primero tenemos que verificar que el `msg.sender` es igual a `zombieToOwner[_zombieId]`. Utiliza una sentencia `require`.

3. Después la función deberá fijar `zombies[_zombieId].name` como `_newName`.

4. Crea otra función llamada `changeDna` debajo de `changeName`. Su definición y contenido tendrá que ser igual que el de `changeName`, a excepción de su segundo argumento que será `_newDna` (un `uint`), y debemos pasarle `20` para el parámetro `_level` en el modificador `aboveLevel`. Y por supuesto, este deberá fijar el `dna` del zombi a `_newDna` en vez de cambiarle el nombre.
