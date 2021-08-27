---
title: Отрезки времени
actions: ['Проверить', 'Подсказать']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. Задай время `cooldownTime`

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
                // 2. Обнови следующую строчку:
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
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

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
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
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }

          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }

          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
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

Свойство `level` очевидно: когда мы создадим систему боя, чаще побеждающие в битвах зомби со временем получат апгрейд и доступ к большему количеству способностей.

Свойство `readyTime` требует немного больше объяснений. Его задача в том, чтобы добавить «время перезарядки», отрезок времени, который зомби должен переждать, чтобы снова нападать и питаться. Без него, зомби сможет нападать и размножаться 1000 раз в день, что сделало бы игру слишком простой.

Чтобы отслеживать, когда зомби снова сможет атаковать, используем единицы времени Solidity.

## Единицы времени

В Solidity есть собственные единицы для управления временем. 

Переменная `now` вернет текущую временную метку unix (количество секунд, прошедших с 1 января 1970 года). Время этой записи по unix - `1515527488`. 

> Примечание. Unix-время традиционно сохраняется в 32-битном номере. Это приведет к проблеме «2038 года», когда 32-разрядные временные метки unix переполнят и сломают множество устаревших систем. Поэтому, если мы хотим, чтобы наш DApp продолжал работать и через 20 лет, желательно было бы использовать 64-битное число. Но пользователям пришлось бы тратить больше газа для работы DApp. Есть над чем поломать голову!

Solidity также содержит единицы времени `seconds`, `minutes`, `hours`, `days`, `weeks` и `years`. Они преобразуются в `uint`, равный количеству секунд в течение отрезка времени. Например: `1 минута` равна `60`, `1 час` равен `3600` (60 секунд x 60 минут), `1 день` равен `86400` (24 часа x 60 минут x 60 секунд).

Пример использования единиц времени:

```
uint lastUpdated;

// Выставим `lastUpdated` на `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Вернет `true`, если прошло 5 минут с момента вызова `updateTimestamp`,
// и `false`, если 5 минут не прошло
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Мы можем использовать единицы времени для `cooldown` (перезарядки).

## Проверь себя

Добавим время перезарядки в DApp. Пусть зомби ждет **1 день** после нападения или питания, прежде чем вновь атаковать.

1. Задай `uint` под названием `cooldownTime` и установи его равным `1 days`. (Не обращай внимание на кривую грамматику - если задать переменную равной `1 day`, она не скомпилируется!)

2. Поскольку в предыдущей главе мы добавили `level` и `readyTime` в структуру `Zombie`, надо обновить `_createZombie()`, чтобы использовать правильное количество аргументов при создании новой структуры `Zombie`.

  Обнови строчку кода `zombies.push`, добавив еще 2 аргумента: `1` (для `level`) и `uint32(now + cooldownTime)` (для `readyTime`).

>Примечание: `uint32(...)` необходим, потому что `now` вернет по умолчанию `uint256`. Нужно преобразовать его в `uint32`.

`now + cooldownTime` будет равняться (в секундах) текущему отрезку времени unix плюс количеству секунд в одном дне, что в свою очередь будет равняться отрезку времени через 1 день от текущего момента. Потом мы сравним `readyTime` зомби и `now`. Если оно больше, то зомби снова можно использовать.

В следующей главе мы реализуем функционал ограничения действий на основе `readyTime`. 
