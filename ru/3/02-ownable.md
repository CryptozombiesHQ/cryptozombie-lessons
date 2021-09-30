---
title: Собственные контракты
actions: ['Проверить', 'Подсказать']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Здесь импорт

        // 2. Здесь наследование:
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

          function setKittyContractAddress(address _address) external {
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

Насчет дыры в безопасности в предыдущей главе.

Функция `setKittyContractAddress` — внешняя `external`, ее может  вызвать кто угодно! Это означает, что любой вызвавший функцию может заменить адрес контракта Криптокотиков и испортить игру всем остальным.

Нам нужна возможность обновления адреса в контракте, но также надо закрыть возможность обновления всем остальным.

Для подобных случаев есть одна распространенная практика: делать контракты `Ownable` — собственными, то есть принадлежащими тебе и дающими особые привилегии.

## Собственный контракт OpenZeppelin

Ниже пример `Ownable` контракта из библиотеки Solidity **_OpenZeppelin_**. OpenZeppelin - это библиотека безопасных смарт-контрактов сообщества, которыми можно пользоваться для личных DApps. Пока ты будешь ждать Урока 4, посмотри библиотеки на этом сайте. Поможет в дальнейшем.

Прочитай контракт ниже. Ты увидишь несколько неизученных моментов, не волнуйся, сейчас мы поговорим о них. 

```
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
```

Вот что мы не видели раньше:

- Конструкторы: `function Ownable()` это **_конструктор_**, особая опциональная функция с таким же именем, как контракт. Выполняется только один раз в момент создания контракта.
- Модификаторы функции: `modifier onlyOwner()`. Модификаторы — полуфункции, которые используются для изменения других функций, обычно для проверки некоторых требований до их выполнения. В этом случае `onlyOwner` можно использовать для ограничения доступа, чтобы **только владелец** контракта мог запустить эту функцию. В следующей главе мы подробно поговорим о модификаторах функций, а также о странном `_;` и его назначении.
- Ключевое слово `indexed`: пока не нужно, об этом потом. 

В целом `Ownable` контракт делает следующее:

1. Когда контракт создается, конструктор присваивает `msg.sender` (развернувшему контракт) атрибут `owner`.

2. Он добавляет модификатор `onlyOwner`, который может ограничить доступ к определенным функциям, предоставив его только владельцу `owner`.   

3. Он позволяет передать контракт новому `owner`.

`onlyOwner` настолько распространенное требование для контрактов, что большинство DApps Solidity начинаются с копирования/вставки `Ownable` контракта, а следующий контракт наследует ему.   

Поскольку мы хотим ограничить `setKittyContractAddress` только для `onlyOwner`, сделаем то же самое и для нашего контракта.

## Проверь себя

Мы скопировали код контракта `Ownable` в новый файл `ownable.sol`. Продолжи, сделав так, чтобы `ZombieFactory` наследовал ему. 

1. Модифицируй код таким образом, чтобы импортировать (`import`) контент в `ownable.sol`. Если не помнишь как, взгляни на `zombiefeeding.sol`.

2. Модифицируй контракт `ZombieFactory`, чтобы он наследовал `Ownable`. Смотри `zombiefeeding.sol`, если не помнишь, как это делается.
