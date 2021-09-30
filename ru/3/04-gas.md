---
title: Газ
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

            struct Zombie {
                string name;
                uint dna;
                // Здесь добавь новые данные
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
---

Круто! Теперь ты знаешь, как обновлять ключевые части DApp, при этом заставляя других пользователей держаться подальше от твоих контрактов.

Теперь рассмотрим еще одно серьезное отличие Solidity от других языков программирования:

## Газ — топливо для DApps на Ethereum

В Solidity пользователи должны заплатить за каждый вызов функции DApp с помощью валюты под названием **_газ_**. Газ покупают вместе с эфиром, валютой Ethereum. Следовательно, пользователи расходуют ETH, чтобы выполнить функцию в приложении DApp.

Количество газа для запуска зависит от сложности логики функции. У любой операции есть **_цена газа_**, она вычисляется, исходя на количестве вычислительных ресурсов, необходимых для выполнения  операции (например, запись в хранилище намного дороже, чем добавление двух целых чисел). Общая **_стоимость газа_** функции - сумма затрат газа на все операции.

Поскольку запуск функций стоит пользователям реальных денег, оптимизация кода в Ethereum гораздо важнее, чем в других языках программирования. Если код написан небрежно, а пользователям придется платить за выполнение функций, в пересчете на тысячи пользователей это может означать миллионы долларов ненужных комиссий.

## Зачем нужен газ?

Ethereum похож на большой, медленный, но крайне безопасный компьютер. Когда ты выполняешь функцию, каждая нода в сети должна запустить такую же функцию, чтобы проверить результат на выходе. Это то, что делает Ethereum децентрализованным, а данные в нем неизменяемыми а не подверженными цензуре.

Создатели Ethereum хотели быть уверенными, что никто не сможет заспамить сеть, запустив бесконечный цикл, или поглотить все  ресурсы сети своими интенсивными вычислениями. Поэтому они сделали транзакции платными — пользователи должны отдавать газ за использование вычислительных мощностей и хранилища.

> Примечание: для сайдчейнов, как например для используемого авторами Loom Network в игре КриптоЗомби, это правило не обязательно. Нет смысла запускать игру вроде World of Warcraft в главной сети Ethereum - стоимость газа будет заградительным барьером. Но зато такая игра может работать на сайдчейне с другим алгоритмом консенсуса. В следующих уроках мы вернемся к вопросу, какие DApps развертывать на сайдчейне, а какие в главной сети Ethereum.

## Как упаковать структуру, сэкономив газ

Мы упоминали в первом уроке, что есть разные типы `uint`: `uint8`,` uint16`, `uint32` и так далее. 

Обычно использование этих подтипов нецелесообразно, поскольку Solidity резервирует 256 бит в хранилище независимо от размера `uint`. Например, использование `uint8` вместо `uint` (`uint256`) не экономит газ.

Но внутри структур есть исключение.

Если внутри структуры несколько `uint`, использование `uint` меньшего размера позволит Solidity объединить переменные и уменьшить объем хранилища. Например:

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` будет стоить меньше, чем `normal` из-за упаковки структуры
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

Так что внутри структур можно использовать наименьшие целочисленные подтипы, которые позволяют запустить код.

Еще можно объединять идентичные типы данных в кластеры — ставить их в структуре рядом друг с другом. Так Solidity оптимизирует  пространство в хранилище. К примеру, структура поля `uint c; uint32 a; uint32 b;` будет стоить меньше газа, чем структура с полями `uint32 a; uint c; uint32 b;`, потому что поля `uint32` группируются вместе.

## Проверь себя

В этом уроке мы собираемся добавить зомби две новые фишки: `level` (уровень) и `readyTime` (время готовности) — последняя будет использоваться для установки времени перезарядки, чтобы ограничить частоту питания зомби. 

Вернемся назад к `zombiefactory.sol`.

1. Добавь еще два свойства к структуре `Zombie`: `level` (`uint32`) и `readyTime` (тоже `uint32`). Объединим и поместим эти типы данных в конец структуры.

32 бита достаточно для хранения уровня и времени перезарядки зомби. Мы сэкономили немного газа, упаковав данные плотнее, чем обычный 256-битный `uint`.
