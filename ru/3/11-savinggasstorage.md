---
title: Дорогое место в хранилище
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
            // Начало здесь
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

          return result;
        }

      }
---

Одна из самых дорогих операций в Solidity - использование `storage` - особенно запись в него.

Каждый раз, когда ты записываешь или изменяешь данные, они навсегда записываются в блокчейн! Тысячи нод по всему миру должны хранить эти данные на своих жестких дисках, объем данных растет по мере роста блокчейна. Поэтому за это надо платить газ.

Чтобы снизить затраты, старайся избегать записывать данные в хранилище, кроме случаев, когда это абсолютно необходимо. Иногда приходится прибегать к неэффективной логике программирования - например, восстанавливать массив в `memory` при каждом вызове функции вместо простого сохранения его в переменной для быстрого поиска.

В большинстве языков программирования объединение в цикл больших наборов данных — дорогостоящая операция. А в Solidity это намного дешевле, чем `storage`, если цикл находится внутри функции `external view`, так как за `view` пользователь не платит газ. (А газ стоит денег!).

В следующей главе мы перейдем к циклам `for`, но сначала посмотрим, как задавать массивы в памяти.

## Задание массивов в памяти

Чтобы создать новый массив внутри функции без необходимости записывать в хранилище, используй ключевое слово `memory`. Массив просуществует только до конца вызова функции и потратит меньше газа, чем обновление массива в `storage`. Если вызываемая извне функция `view`, то операция будет бесплатной.

Вот как задать массив в памяти:

```
function getArray() external pure returns(uint[]) {
  // Создай в памяти новый массив с длиной 3
  uint[] memory values = new uint[](3);
  // Добавь значений
  values.push(1);
  values.push(2);
  values.push(3);
  // Верни массив
  return values;
}
```

Это элементарный пример синтаксиса, в следующей главе мы рассмотрим объединение циклов `for` для реальных кейсов.

> Примечание: массивы памяти **должны** создаваться с аргументом длины (`3` в этом примере). Пока что их нельзя изменить с помощью `array.push()` аналогично массивам хранилища. Может быть, эту функцию добавят в будущей версии Solidity.

## Проверь себя

Мы хотим, чтобы функция `getZombiesByOwner` возвращала массив `uint[]` со всеми зомби, которыми владеет определенный пользователь.

1. Задай переменную `uint[] memory` под названием `result`

2. Установи ее равной новому массиву `uint`. Длина массива должна быть равна тому количеству зомби, которыми владеет `_owner`. Возьмем данные из карты соответствия: `ownerZombieCount [_owner]`.

3. В конце функция вернет результат `result`. Пока это просто пустой массив, в следующей главе мы его заполним.
