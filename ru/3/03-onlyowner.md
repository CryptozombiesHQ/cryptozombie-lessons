---
title: Модификатор функции onlyOwner (единственный владелец)
actions: ['Проверить', 'Подсказать']
requireLogin: true
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

          KittyInterface kittyContract;

          // Модифицируй функцию:
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
---

Теперь базовый контракт `ZombieFactory` наследует `Ownable` и мы можем использовать модификатор `onlyOwner` в `ZombieFeeding`.

Запомни, как работает наследование в контрактах:

```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```

Таким образом, `ZombieFeeding` также и `Ownable`, он может получить доступ к функциям, событиям и модификаторам контракта `Ownable`. Это относится к любым контрактам, которые будут наследовать `ZombieFeeding` в будущем.

## Модификаторы функций

Модификатор функции выглядит точно так же, как сама функция, но использует ключевое слово `modifier` вместо `function`. Его нельзя вызвать напрямую, как функцию - вместо этого мы можем добавить модификатор в конце определения функции и изменить ее поведение.

Рассмотрим на примере `onlyOwner`:

```
/**
 * @dev Throws if called by any account other than the owner.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

Используем модификатор:

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // Обрати внимание на использование `onlyOwner` ниже:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

Видишь модификатор `onlyOwner` в функции `likeABoss`? Когда ты вызываешь `likeABoss`, **в первую очередь** выполняется код внутри `onlyOwner`. Затем, когда он доходит до оператора `_;` в `onlyOwner`, он возвращается и выполняет код внутри `likeABoss`.

Хотя есть и другие способы использования модификаторов, одним из наиболее распространенных вариантов является добавление быстрой проверки `require` перед выполнением функции.

Добавление модификатора `onlyOwner` в функцию делает так, что только **единственный владелец**, например ты, может вызвать эту функцию.

> Примечание: предоставление владельцу особой власти над подобным контрактом часто необходимо. Но властью можно злоупотреблять: например, владелец может оставить бэкдор, который переведет всех зомби на его адрес!

> Важно помнить, что DApp на Ethereum не означает децентрализацию по умолчанию. Читай исходники, чтобы убедиться, что контракт не содержит средств передачи контроля другому владельцу. Разработчику необходимо найти баланс между контролем над DApp для исправления багов, и созданием децентрализованной платформы, которой пользователи могут доверять.

## Проверь себя

Теперь мы можем запретить доступ к `setKittyContractAddress`, чтобы никто не мог его изменить в будущем.

1. Добавь модификатор `onlyOwner` к `setKittyContractAddress`.
