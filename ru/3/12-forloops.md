---
title: Циклы
actions: ['Проверить', 'Подсказать']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

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
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // Начало здесь
            return result;
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
      "zombiefactory.sol": |
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

В предыдущей главе мы упоминали, что для создания содержимого массива в функции иногда выгоднее использовать цикл `for`, а не просто сохранять массив в хранилище. И вот почему.

Очевидная реализация функции `getZombiesByOwner` — хранить карту соответствий `mapping` владельцев зомби-армий в контракте `ZombieFactory`:

`` `
mapping (address => uint[]) public ownerToZombies
`` `

Каждый раз при создании нового зомби просто используем `ownerToZombies[owner].push (zombieId)`, чтобы добавить солдата в массив владельца. И `getZombiesByOwner` будет очень простой функцией:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### Проблема этого подхода

Вроде просто, но посмотрим, что произойдет, если позже мы добавим функцию передачи зомби от одного владельца к другому (а мы обязательно захотим добавить эту фичу в следующем уроке!).

Функция передачи должна:
1. Переместить зомби в массив `ownerToZombies` нового владельца
2. Удалить зомби из массива `ownerToZombies` предыдущего владельца
3. В массиве старого владельца переместить всех зомби на одно место вверх, чтобы заполнить пробел, а затем
4. Уменьшить длину массива на 1.

Шаг 3 требует слишком много газа, потому что пришлось бы переписать положение для каждого перемещенного зомби. Если у владельца 20 зомби и он продаст первого, то чтобы сохранить порядок зомби, нужно будет сделать 19 новых записей.

Поскольку запись в хранилище является одной из самых дорогих операций в Solidity, вызов функции передачи потратит неоправданно много газа. И что еще хуже, при каждом вызове расход газа будет разным, в зависимости от количества зомби в армии пользователя и порядкового номера продаваемого зомби. Таким образом, пользователь не будет знать, сколько газа отправить.

> Примечание. Конечно, мы могли бы просто переместить последнего зомби в массиве, чтобы заполнить недостающий слот и уменьшить длину массива на единицу. Но тогда порядок зомби в армии будет меняться при каждой сделке.

Так как функция `view` при вызове извне не тратит газ, мы можем просто использовать for-loop в `getZombiesByOwner` для перестроения массива принадлежащих конкретному владельцу зомби. Тогда функция `transfer` будет намного дешевле, так как нам не нужно будет перестраивать массивы в хранилище. Кажется контр-интуитивным, но в целом этот подход дешевле.

## Использование циклов `for`

Синтаксис циклов `for` в Solidity похож на JavaScript.

Например, мы хотим создать массив четных чисел:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // Отслеживай порядковый номер в новом массиве:
  uint counter = 0;
  // Повторяй цикл `for` от 1 до 10:
  for (uint i = 1; i <= 10; i++) {
    // Если `i` четное...
    if (i % 2 == 0) {
      // То в массив добавится
      evens[counter] = i;
      // Добавь счетчик к следующему свободному номеру в `evens`:
      counter++;
    }
  }
  return evens;
}
```

Функция вернет массив, который содержит `[2, 4, 6, 8, 10]`.

## Проверь себя

Закончим нашу функцию `getZombiesByOwner`, написав цикл `for` (для), который проходит через всех зомби в DApp, проверяет имена владельцев на совпадение и переносит их в массив `result`, А потом отдает его.

1. Задай `uint` под названием `counter` и установи его равным `0`. Используем эту переменную для отслеживания порядкового номера в массиве `result`.

2. Задай цикл `for`, который начинается с `uint i = 0` и проходит через `i < zombies.length`. Он будет перебирать всех зомби в массиве.

3. Внутри цикла `for` создай оператор `if` (если), который проверяет, совпадает ли `zombieToOwner [i]` с `_owner`, то есть проверяет два адреса на наличие совпадений.

4. Внутри оператора `if`:
    1. Добавь идентификатор зомби в массив `result` и установи `result[counter]` равным `i`.
    2. Увеличь `counter` на 1 (см. пример выше для цикла `for`).

Вот и все - теперь функция вернет всех принадлежащих `_owner` зомби, не потратив газ.
