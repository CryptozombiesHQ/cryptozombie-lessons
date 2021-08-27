---
title: Еще о функциях
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          // Начало здесь

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {

          }

      }
---

В этом разделе мы изучим функцию **_вернуть значение_** и ее модификаторы. 

## Вернуть значение

Как задать функцию, чтобы она возвращала значение: 

```
string greeting = "Привет, дружок";

function sayHello() public returns (string) {
  return greeting;
}
```

Задание функции в Solidity содержит тип возвращаемого значения (в данном случае `string`).

## Модификаторы функций

Рассмотренная выше функция не модифицирует свое состояние — не изменяет значения и не переписывает что-либо.

Поэтому в данном случае мы можем задать функцию **_просмотр_** – просмотр данных без их изменения:

```
function sayHello() public view returns (string) {
```

Еще в Solidity есть **_чистые_** функции — ты не получишь доступ к данным в приложении. Рассмотрим пример:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Функция даже не читает состояние приложения - она возвращает значение, которое зависит только от параметров самой функции. В этом случае мы задаем функцию как **_pure_**. 

> Примечание: не всегда легко вспомнить, когда задать «чистую» функцию или «просмотр». К счастью, компилятор Solidity исправно выдает предупреждения, что нужно использовать тот или иной модификатор. 

# Проверь себя

Нам понадобится вспомогательная функция, которая генерирует случайный номер ДНК из строки. 

1. Создай `private` (приватную) функцию под названием `_generatePseudoRandomDna` (сгенерировать случайную ДНК). Она будет брать один параметр под названием `_str` (строку `string`), и возвращать `uint`.

2. Эта функция будет просматривать определенные переменные в контракте, но не менять их. Присвой ей модификатор `view` (просмотр). 

3. Тело функции по прежнему остается пустым, заполним его позже. 
