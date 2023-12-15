---
title: Retiros
actions:
  - checkAnswer
  - hints
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      zombiehelper.sol: |
        pragma solidity ^0.4.25;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 1. Crea la función withdraw aquí

          // 2. Crea la función setLevelUpFee aquí

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
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
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
          }

        }
      zombiefeeding.sol: |
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

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }
        }
      zombiefactory.sol: |
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
                NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      ownable.sol: |
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
    answer: |
      pragma solidity ^0.4.25;
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function withdraw() external onlyOwner {
          address _owner = owner();
          _owner.transfer(address(this).balance);

        }

        function setLevelUpFee(uint _fee) external onlyOwner {
          levelUpFee = _fee;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
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
          uint[] memory result = new uint[](ownerZombieCount[_owner]);
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

En el capítulo anterior, aprendimos cómo enviar Ether a un contrato. Entonces ¿Qué ocurre después que lo enviaste?

Luego de enviar Ether a un contrato, se almacena en la cuenta Ethereum del contrato, y estará atrapado ahí — a menos que tú añadas una función para retirar el Ether del contrato.

Puede escribir una función para retirar Ether desde el contrato de la siguiente forma:

```
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    address payable _owner = address(uint160(owner()));
    _owner.transfer(address(this).balance);
  }
}
```

Ten en cuenta que estamos usando `owner()` y `onlyOwner` del contrato `Ownable`, asumiendo que fue importado.

Es importante tener en cuenta que no puedes transferir Ether a una dirección a menos que esa dirección sea del tipo `address payable`. Pero la variable `_owner` es de tipo `uint160`, lo que significa que debemos convertirla explícitamente en `address payable`.

Una vez que hayas convertido la dirección de `uint160` a `address payable`, puedes transferir Ether a esa dirección usando la función `transfer`, y `address(this).balance` devolverá el saldo total almacenado en el contrato. Entonces, si 100 usuarios han pagado 1 Ether a nuestro contrato,`address(this).balance` sería igual a 100 Ether.

Puedes utilizar `transfer` para enviar fondos a cualquier dirección de Ethereum. Por ejemplo, podrías tener una función que transfiera Ether de vuelta al `msg.sender` si pagaron en exceso el precio por un ítem:

```
uint itemFee = 0.001 ether;
msg.sender.transfer(msg.value - itemFee);
```

O en un contrato con un comprador y un vendedor, podrías guardar la dirección del vendedor en la memoria, luego cuando alguien adquiera su item, transferirle la tasa pagada por el comprador: `seller.transfer(msg.value)`.

Estos son algunos ejemplos de lo que hace de la programación de Ethereum algo realmente genial — puedes tener mercados descentralizados como este que no son controlados por nadie.

## Ponlo a prueba

1. Crea una función `withdraw` en nuestro contrato, la cual debería ser idéntica al ejemplo anterior `GetPaid`.

2. El precio del Ether aumentó 10x en el año pasado. Así que mientras 0.001 ether es como $1 en el momento de escribir esto, si sube 10x de nuevo, 0.001 ETH sería equivalente a $10 y nuestro juego será mucho más costoso.

Así que es una buena idea crear una función que nos permita, como dueños del contrato, configurar el `levelUpFee`.

a. Crea una función llamada `setLevelUpFee` que tome un argumento, `uint _fee`, sea `external` y use el modificador `onlyOwner`.

b. La función debe establecer "levelUpFee" igual a "\_fee".
