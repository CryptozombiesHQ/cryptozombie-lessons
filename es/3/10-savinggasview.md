---
title: Ahorrando Gas Con Funciones 'View'
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

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          // Crea tu función aquí

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

        function getZombiesByOwner(address _owner) external view returns(uint[]) {

        }

      }
---

¡Increible! Ahora tenemos algunas habilidades especiales para los zombis de nivel alto, dandoles a sus dueños un incentivo por subirlos de nivel. Si queremos podemos añadir más de estos en el futuro.

Vamos a añadir una nueva función: nuestra DApp necesita un método para ver el ejército de un usuario - vamos a llamarlo `getZombiesByOwner`.

Esta función solo necesita leer datos de la blockchain, por lo que podemos hacer una función `view`. Esta nos brinda un importante tema a la hora de hablar sobre la optimización de gas:

## Las funciones view no cuestan gas

Las funciones `view` no cuestan gas cuando son llamadas externamente por un usuario.

Esto es debido a que las funciones `view` no cambia nada en la blockchain - solo leen datos. Así que marcar una función con `view` le dice a `web3.js` que solo necesita consultar a tu nodo local de Ethereum para ejecutar la función, y que no necesita crear ninguna transacción en la blockchain (la cual debería ejecutarse por todos y cada uno de los nodos, y costaría gas).

Hablaremos sobre configurar web3.js en tu propio nodo mas tarde. Por ahora la mayor ventaja es que puedes optimizar el uso de gas de tu DApp haciendo que tus usuarios utilicen funciones `external view` siempre que sea posible.

> Nota: Si una función `view` es llamada internamente por otra función que **no** sea `view` en el mismo contrato, esta seguira costando gas. Esto es porque la otra función crea una transacción en Ethereum, y necesita ser verificada por el resto de nodos. Por lo que las funciones `view` son gratuitas siempre que sean llamadas externamente.

## Vamos a probarlo

Vamos a implementar una función que devuelva el ejército de un usuario. Más adelante podemos llamar a esta función desde `web3.js` si queremos mostrar la página de perfil de un usuario con todo su ejército.

La lógica de esta función es algo complicada por lo que nos llevará algunos capítulos implementarla.

1. Crea una nueva función llamda `getZombiesByOwner`. Esta recibirá un argumento, un `address` llamado `_owner`.

2. Vamos a hacer la función `external view`, para poder llamarla desde `web3.js` sin necesidad de usar gas.

3. La función deberá devolver un `uint[]` (un array de `uint`).

Deja el cuerpo de la función vacío por ahora, lo rellenaremos en el siguiente capítulo.
