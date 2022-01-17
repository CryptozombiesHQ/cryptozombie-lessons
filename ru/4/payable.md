---
title: Платные опции
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

          // 1. Здесь задай сбор за повышение уровня levelUpFee 

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Здесь вставь функцию levelUp 

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
            if (keccak256(_species) == keccak256("kitty")) {
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

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
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

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
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

Мы уже видели множество **_модификаторов функций_**. Сложно сразу все запомнить, поэтому проведем быстрый обзор:

1. Модификаторы видимости контролируют вызов функции: `private` означает, что функцию могут вызвать другие функции только внутри контракта; `internal` похожа на `private`, но ее помимо функций внутри контракта могут вызывать те, которые наследуют ей; `external` может быть вызвана только извне контракта; и, наконец, `public` функцию можно вызвать откуда угодно — изнутри и извне.

2. Модификаторы состояния сообщают нам, как функция взаимодействует с блокчейном: `view` означает только просмотр, то есть после запуска функции данные не пересохраняются и не изменяются. `pure` означает, что функция не только не сохраняет, но даже не считывает данные из блокчейна. Обе эти функции не тратят газ, если их вызывают извне контракта (но тратят газ, если их вызывают внутренние функции).

3. Есть пользовательские модификаторы, о которых мы узнали в уроке 3, к примеру `onlyOwner` и `aboveLevel`. Для определения их влияния на функцию нужно задавать пользовательскую логику.

Эти модификаторы могут быть объединены вместе в определение функции следующим образом:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

В этой главе мы введем еще один модификатор функции: `payable`.

## Модификатор `payable`

Функции `payable` — платные — одна из причин, почему Solidity и Ethereum настолько классные. Это особый тип функций, которые могут получать ETH.

Подумаем минутку. Когда ты вызываешь функцию API на обычном веб-сервере, то ты не сможешь одновременно с вызовом функции отправить USD. Биткоин, к слову, тоже не сможешь:).

Но в Ethereum и деньги (_ETH_), и данные (*транзакции*), и сам код контракта живут в блокчейне Ethereum. Поэтому можно вызвать функцию **и** одновременно заплатить за исполнение контракта.

Это позволяет задействовать действительно интересную логику, например, сделать запрос платежа по контракту для выполнения функции.

## Рассмотрим пример

```
contract OnlineStore {
  function buySomething() external payable {
    // Проверь, что 0.001 ETH действительно отправлен за вызов функции 
    require(msg.value == 0.001 ether);
    // Если да, то вот логика, чтобы перевести цифровой актив вызывающему функцию 
    transferThing(msg.sender);
  }
}
```

Здесь `msg.value` - это способ увидеть, сколько ETH было отправлено на адрес контракта, а `ether` - встроенный блок.

Что произойдет, если кто-то вызовет функцию из web3.js (из внешнего интерфейса DApp JavaScript)? Смотри ниже:

```
// Допустим, `OnlineStore` указывает на контракт в Ethereum:
OnlineStore.buySomething().send(from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001))
```

Обрати внимание на поле `value`, где javascript-функция указывает, сколько `ether` нужно отправить (0.001). Если представить транзакцию как конверт, а параметры вызова функции как содержимое письма, то добавление `value` - это как положить наличные в конверт. Письмо и деньги вместе доставляются получателю.

> Примечание. Если функция не помечена как `payable`, а на нее пытаются отправить ETH, то функция отклонит  транзакцию.

## Проверь себя

Создадим функцию `payable` для нашей зомбоигры.

Допустим, что у нас в игре есть функция, где пользователи платят ETH за повышение уровня своих зомби. ETH будет храниться в твоем контракте. Это простой пример, как зарабатывать деньги на играх!

1. Задай `uint` под названием `levelUpFee` и установи ее равной `0.001 ether`.

2. Создай функцию под названием `levelUp`. Она берет один параметр: `_zombieId` (`uint`). Функция будет `external` и `payable`.

3. Сперва функция требует (`require`), чтобы `msg.value` был равен `levelUpFee`.

4. Затем функция должна повышать уровень зомби: `zombies [_zombieId].level ++`.
