---
title: Хранилище и память
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Начало здесь

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
        }

      }
---

В Solidity есть два места, где могут сохраняться переменные: в `storage` (хранилище) и в `memory` (памяти).

**_Хранилище_** используют, чтобы сохранить переменные в блокчейн навсегда. **_Память_** используют для временного хранения переменных, они стираются в промежутках, когда внешняя функция обращается к контракту. Это похоже на жесткий диск компьютера и оперативную память. 

В большинстве случаев тебе не придется использовать ключевые слова, потому что Solidity определяет по умолчанию, что куда сохранять. Переменные состояния (заданные вне функции) по умолчанию хранятся записанными в блокчейне. Переменные, заданные внутри функции, пишутся в память и исчезнут, как только вызов функции закончится. 

Тем не менее, есть случаи, когда обязательно надо указывать ключевые слова, а именно когда ты работаешь со **_структурами_** и **_массивами_** в пределах функции: 

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Сэндвич mySandwich = sandwiches[_index];

    // ^ Вроде все в порядке, но Solidity выдаст предупреждение, 
    // что надо ясно указать `storage` или `memory`.

    // Поэтому используй ключевое слово `storage`, вот так: 
    Sandwich storage mySandwich = sandwiches[_index];
    // ...где `mySandwich` указывает на `sandwiches[_index]` в хранилище, и...
    mySandwich.status = "Eaten!";
    // ...навсегда изменит `sandwiches[_index]` в блокчейне.

    // Если нужна просто копия, используй `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...тогда `anotherSandwich` будет простой копией данных в памяти, таким образом... 
    anotherSandwich.status = "Eaten!";
    // ...всего лишь модифицирует временную переменную и не окажет влияния
    // на `sandwiches[_index + 1]`. Но ты можешь сделать и так... 
    sandwiches[_index + 1] = anotherSandwich;
    // ...если надо сохранить данные в блокчейне.
  }
}
```

Не волнуйся, если пока не все ясно — на протяжение курса мы подскажем, когда использовать `storage`, а когда ` memory`. Компилятор Solidity тоже выдает предупреждение, когда нужно использовать одно из этих ключевых слов.

На данный момент достаточно принять как факт, что есть случаи, требующие ясного обозначения `storage` или `memory`! 

# Проверь себя

Время наделить твоего зомби спобностью питаться и размножаться! 

Когда зомби пожирает другую форму жизни, его ДНК объединяется с ДНК другой жизнеформы и получается новый зомби. 

1. Создай функцию под названием `feedAndMultiply`. Она берет два параметра: `_zombieId` (`uint`) и `_targetDna` (тоже `uint`). Сделай функцию открытой `public`.

2. Мы не хотим, чтобы наших зомби жрал кто-то еще! Убедимся, что зомби и вправду принадлежит нам. Добавь оператор `require` (требуется), чтобы убедиться, что `msg.sender` (отправитель) тот же, что и владелец зомби (точно так же, как мы делали в функции `createPseudoRandomZombie`).

 > Примечание: из-за того, что наша проверялка довольна примитивна, ожидается, что `msg.sender` идет первым и если поменять порядок, то вылетит ошибка. Но вообще когда кодишь, можно использовать любой порядок — оба правильные.

3. Нам нужно получить ДНК этого зомби. Следующее действие функции - задать локального `Zombie` под названием `myZombie` (который будет указателем в `storage`). Установи эту переменную равной индексу `_zombieId` в нашем массиве` zombies`.

У тебя должно получить 4 строчки кода, включая закрывающую скобку `}`. 

Доведем до ума эту функцию в следующей главе!
