---
title: ДНК Зомби 
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // Начало здесь
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
    answer: >
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
---

Давайте допишем функицию `feedAndMultiply` (питаться и размножаться).

Формула вычиления ДНК нового зомби проста: среднее значение между ДНК охотника и ДНК жертвы.

Пример:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ будет равно 3333333333333333
}
```

При желании позже можно усложнить формулу, добавить элемент случайности в ДНК нового зомби. Но пока можно оставить так, вернуться к этому мы всегда успеем.

# Проверь себя

1. Первым делом нам нужно убедиться, что `_targetDna` не длиннее, чем 16 цифр. Для этого зададим `_targetDna` равной `_targetDna % dnaModulus`, чтобы взять только последние 16 цифр.  

2. Затем функция должна задать `uint` под названием `newDna` и приравнять ее к среднему значению между ДНК `myZombie` и `_targetDna` (как в примере выше). 

  > Примечание: чтобы получить доступ к свойствам `myZombie`, используй `myZombie.name` и `myZombie.dna`

3. Как только мы получим новую ДНК, вызовем `_createZombie`. Можешь посмотреть во вкладке `zombiefactory.sol`, если забыли, какие параметры нужны функции для вызова ее. Обрати внимание, что ей нужно имя, поэтому пока установим имя зомби `"NoName"` — потом можно дописать функцию изменения имени зомби.

> Внимание: видишь ошибку в коде? Не беспокойся, мы исправим ее в следующей главе;) 
