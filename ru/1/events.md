---
title: События
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // Здесь объяви событие

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // Здесь запусти событие
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
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

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Наш контракт почти готов! Осталось добавить **_событие_**.

**_Событие_** — это способ, которым контракт сообщает внешнему интерфейсу приложения, что в блокчейне произошло некое событие. Интерфейс может «услышать» определенные события и выполнить заданное действие по его наступлении. 

Пример:

```
// Объяви событие
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // Запусти событие, чтобы оповестить приложение о вызове функции: 
  IntegersAdded(_x, _y, result);
  return result;
}
```

Теперь внешний интерфейс приложения сможет услышать событие. Примерно так будет выглядеть выполнение JavaScript:

```
YourContract.IntegersAdded(function(error, result) { 
  // Воспользуйся результатом
}
```

# Проверь себя

Нужно каждый раз сообщать внешнему интерфейсу о создании нового зомби, чтобы приложение могло его отобразить.

1. Задай `event` (событие) под названием `NewZombie` (новый зомби). Оно должно сообщать `zombieId` (`uint`), имя `name` (строку `string`) и ДНК `dna` (`uint`).

2. Измени функцию `_createZombie` (создать зомби) так, чтобы событие `NewZombie` запускалось после добавления нового солдата в массив `zombies`. 

3. Тебе понадобится `id` — идентификатор зомби. `array.push()` возвращает `uint` новой длины массива. Поскольку первый элемент в массиве имеет индекс 0, `array.push () - 1` вернет индекс только что добавленного зомби. Сохрани результат `zombies.push () - 1` в `uint` с названием `id`, чтобы его можно было использовать в событии `NewZombie` в следующей строчке.
