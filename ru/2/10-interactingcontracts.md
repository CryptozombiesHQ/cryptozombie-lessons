---
title: Кем питаются зомби?
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // Здесь создай интерфейс Криптокотика

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

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Время покормить зомби! Чем они питаются?

Звезды сошлись так, что зомби питаются...

**Криптокотиками!** 😱😱😱

(Мы серьезно 😆)

Для этого нам нужно будет считать kittyDna из смарт-контракта Криптокотиков. Это возможно, потому что данные котиков хранятся в открытом блокчейне. Клево, правда?

Не волнуйся - на самом деле ни одного Криптокотика не пострадает. Мы только *считаем* данные Криптокотиков, но не сможем удалить их 😉

## Взаимодействие с другими контрактами

Чтобы наш контракт связался с другим контрактом в блокчейне, которым владеем не мы, сначала  нужно определить **_интерфейс_**.

Посмотрим простой пример. Допустим, в блокчейне существует такой контракт: 

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

Это простой контракт, где каждый может хранить свой счастливый номер, связаный с личным адресом Ethereum. Тогда любой может найти счастливый номер человека по адресу.

Теперь допустим, что у нас есть другой внешний контракт, который хочет считать данные в этом контракте, используя функцию `getNum`.

Сначала нам надо будет определить **_интерфейс_** контракта `LuckyNumber` (счастливый номер):

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Это похоже на определение контракта, но есть несколько отличий. Во-первых, мы объявляем только те функции, с которыми хотим взаимодействовать - в данном случае `getNum` - и не упоминаем другие функции или переменные состояния.

Во-вторых, мы не определяем тела функций. Вместо фигурных скобок (`{` и `}`) мы заканчиваем задание функции точкой с запятой (`;`).

Это как скелет контракта. Так компилятор узнает, что это интерфейс.

Если включить интерфейс в код DApp, наш контракт узнает, как выглядят функции другого контракта, как их вызвать и какой придет ответ.

В следующем уроке мы будем вызывать функции другого контракта, а пока зададим интерфейс для контракта Криптокотиков.

# Проверь себя

Мы исследовали для тебя исходный код Криптокотиков и нашли функцию «getKitty», которая возвращает все данные котика, включая «гены» (как раз то, что нам нужно, чтобы создать новых зомби!).

Функция выглядит так:

```
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

    // Если эта переменная равна нулю, то она не беременеет:)
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
```

Функция выглядит не совсем привычно. Смотри, она возвращает кучу разных значений! В отличие от Javascript в Solidity можно вернуть больше одного значения из функции.

Теперь, когда мы знаем, как должна выглядеть функция, можем использовать ее для создания интерфейса:

1. Задайте интерфейс под названием «KittyInterface». Это похоже на создание нового контракта - используем ключевое слово `contract`.

2. Внутри интерфейса задайте функцию `getKitty` (копировать/вставить функцию, приведенную выше,но после оператора `return` идет точка с запятой, а не все выражение внутри фигурных скобок.
