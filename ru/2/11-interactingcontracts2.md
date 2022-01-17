---
title: Используем интерфейс
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // Здесь запусти контракт котика, взяв сверху `ckAddress` 

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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Продолжим наш предыдущий пример с `NumberInterface`, как только зададим интерфейс:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Мы можем использовать его в контракте следующим образом:
```
contract MyContract {
  address NumberInterfaceAddress = 0xab38... 
  // ^ Адрес контракта FavoriteNumber в Ethereum
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress)
  // Сейчас `numberContract` указывает на другие контракты

  function someFunction() public {
    // Теперь можно вызвать `getNum` из контракта:
    uint num = numberContract.getNum(msg.sender);
    // ...и сделать что-то с `num` здесь
  }
}
```

Этим способом контракт будет взаимодействовать с всеми другими контрактами в блокчейне Ethereum, если они задают функции как `public` (открытые) или `external` (внешние). 

# Проверь себя

Установим наш контракт на чтение из смарт-контракта Криптокотиков!

1. Мы нашли для тебя адрес контракта Криптокотиков и сохранили его внутри кода под переменным именем `ckAddress`. В следующей строчке создай `KittyInterface` (интерфейс котика) назвав `kittyContract` и запусти его с помощью `ckAddress` — так же, как мы делали с `numberContract` вверху.
