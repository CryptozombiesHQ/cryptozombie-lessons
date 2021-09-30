---
title: Еще насчет видимости функций
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode:
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

            // Редактировать значение функции ниже
            function _createZombie(string _name, uint _dna) private {
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
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

        }
    answer: >
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
---

**Код в предыдущем уроке содержал ошибку!**

Если ты попробуешь его скомпилировать, то компилятор выдаст ошибку. 

Дело в том, что мы пытались вызвать функцию `_createZombie` в пределах `ZombieFeeding`, но `_createZombie` — закрытая функция внутри `ZombieFactory`. Это значит, что никакой контракт, который наследует `ZombieFactory`, не может получить туда доступ. 

## Внутренние и внешние функции

В дополнение к открытым и закрытым, в Solidity есть еще два типа видимости для функций: `internal` (внутренняя) и `external` (внешняя). 

`internal` (внутренняя) это почти как `private` (закрытая), разница лишь в том, что к нему могут получить доступ только контракты, которые наследуют этому контракту. **(Звучит как полная ерунда!)**.

`external` (внешний) это как `public` (открытая), с той лишь разницей, что она может быть вызвана ТОЛЬКО за пределами контракта — другими функциями вне его. Позже поговорим о том, когда использовать `external` а когда `public` функции.

Для `internal` или `external` функций синтаксис такой же, как в `private` and `public`:

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // Можно вызвать функцию, потому что она внутренняя
    eat();
  }
}
```

# Проверь себя

1. Измени функцию `_createZombie()` с `private` (открытой) на `internal` (внутреннюю), чтобы сделать ее доступной для других контрактов.

  Вернись во вкладку `zombiefactory.sol`.
