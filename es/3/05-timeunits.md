---
title: Unidades de Tiempo
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. Define `cooldownTime` aquí

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
                // 2. Actualiza la siguiente línea:
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

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
---

La propiedad `level` es autoexplicativa. Más adelante, cuando creemos el sistema de batalla, los zombis que ganen más batallas subirán de nivel y tendrán acceso a más habilidades.

La propiedad `readyTime` requiere algo más de explicación. El objetivo es añadir un "periodo de enfriamento", una cantidad de tiempo que el zombi debe esperar después de atacar o alimentarse antes de poder volver a hacerlo. Sin esto, el zombi podría atacar y multiplicarse 1.000 veces al día, lo que haría muy fácil el juego.

Para controlar el tiempo que necesita esperar un zombi antes de volver a atacar, podemos usar las unidades de tiempo de Solidity.

## Unidades de tiempo

Solidity proporciona algunas unidades nativas para trabajar con el tiempo.

La variable `now` devolverá el actual tiempo unix (la cantidad de segundos que han pasado desde el 1 de Enero de 1970). El tiempo unix cuando escribía esto es `1515527488`.

>Nota: El tiempo unix es tradicionalmente guardado en un número de 32 bits. Esto nos llevará a el problema del "Año 2038", donde las variables timestamp de tipo unix desbordarán y dejará inservibles muchos sistemas antiguos. Así que si queremos que nuestra DApp siga funcionando después de 20 años, podemos usar un número de 64 bits - pero de mientras nuestros usuarios tendrán que gastar más gas para usar nuestra DApp. ¡Decisiones de diseño!

Solidity también contiene `segundos`, `minutos`, `horas`, `días`, `semanas` y `años` como unidades de tiempo. Estos convertirán a un `uint` la cantidad de segundos que contengan esos números. Es decir `1 minuto` son `60`, `1 hora` son `3600` (60 segundos x 60 minutos), `1 día` son `86400` (24 horas x 60 minutos x 60 segundos), etc.

Aquí un ejemplo de como estas unidades pueden ser útiles:

```
uint lastUpdated;

// Ajustamos `lastUpdated` a `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Devolverá `true` si han pasado 5 minutos desde que `updateTimestamp`
// fue llamado, `false` si no han pasdo 5 minutos todavía
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Puedes usar estas unidades de tiempo para la característica de `enfriamiento` de nuestro Zombi.


## Vamos a probarlo

Vamos a añadir un tiempo de enfriamiento a nuestra DApp, y hacer que los zombis tengan que esperar **1 día** antes de volver atacar o alimentarse.

1. Declara un `uint` llamado `cooldownTime`, inicializalo a `1 days`. (Olvídate de la gramática pobre - si lo inicializas a "1 day", ¡No va a compilar!)

2. Como añadimos `level` y `readyTime` a nuestra estructura `Zombie` en el anterior capítulo, necesitamos actualizar `_createZombie()` para usar el número correcto de argumentos cuando creemos una nueva estructura `Zombie`.

  Actualiza la línea `zombies.push` para añadir 2 argumentos más: `1` (para `level`), y `uint32(now + cooldownTime)` (para `readyTime`).

>Nota: El `uint32(...)` es necesario porque `now` devuelve un `uint256` por defecto. Así que necesitamos convertirlo explícitamente a `uint32`.

`now + cooldownTime` será igual al tiempo unix (en segundos) más el numero en segundos de 1 día — que será igual que el tiempo unix en segundos de 1 día a partir de hoy. Más adelante podemos comparar si el `readyTime` del zombi es mayor a `now` para ver si ha pasado el suficiente tiempo para poder volver a usarlo.

En el próximo capítulo implementaremos la funcionalidad para limitar las acciones basadas en `readyTime`.
