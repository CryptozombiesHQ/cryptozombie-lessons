---
title: Требования
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode: |
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
              // Начало здесь
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
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
---

В Уроке 1 мы дали пользователям возможность создания новых зомби, вызывая функцию `createPseudoRandomZombie` и вводя имя. Но если пользователи смогут неограниченно вызывать функцию и наплодят неограниченное число зомби в армии, будет совсем не круто.

Сделаем так, чтобы каждый игрок мог вызвать эту функцию только один раз. Таким образом новые игроки вызовут функцию в начале игры и создать первого зомби в армии.

Как сделать, чтобы эта функция могла быть вызвана пользователем только один раз?

Используем `require` (требование). `require` делает так, что функция выдает ошибку и прекращает выполнение. если одно из условий не верно: 

```
function sayHiToVitalik(string _name) public returns (string) {
  // Сравнивает, если _имя равно "Vitalik". Выдает ошибку и закрывается, если не верно.
  // (Примечание: в Solidity нет родного сравнивателя строк, поэтому
  // мы сравниваем их keccak256-хэши, чтобы увидеть, равны они или нет
  require(keccak256(_name) == keccak256("Vitalik"));
  // Если верно, то переходим к выполнению функции:
  return "Привет!";
}
```

Если ты вызовешь эту функцию с `sayHiToVitalik("Vitalik"), она вернет "Привет!". Если вызвать ее с любым другим вводом, она выдаст ошибку и не выполнится. 
Таким образом, `require` полезна для проверки верности определенных условий перед запуском функции. 

# Проверь себя

В нашей зомби-игре мы не хотим, чтобы пользователь создавал неограниченное количество зомби в  армии, постоянно вызывая `createPseudoRandomZombie` - это не смешно.

Используем `require`, чтобы убедиться, что функция выполняется только один раз, когда пользователь создает своего первого зомби.

1. Поставь оператор `require` в начале `createPseudoRandomZombie`. Функция должна проверить и убедиться, что `ownerZombieCount [msg.sender]` равно `0`, либо выдать ошибку.

> Примечание. В Solidity не имеет значения, какой термин идет первым - ордеры эквивалентны. Но поскольку наш проверяльщик ответов очень примитивный, он будет принимать только один ответ как правильный - предполагается, что `ownerZombieCount [msg.sender]` будет стоять на первом месте.
