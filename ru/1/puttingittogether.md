---
title: Соберем все вместе
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
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
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Мы почти закончили с генератором случайных зомби! Давай создадим публичную функцию, которая объединит в себе все сделанное ранее.

Создадим публичную функцию, которая получает на вход параметр имя зомби и использует его, чтобы создать зомби со случайной ДНК. 

# Проверь себя

1. Создай `public` (публичную) функцию под названием `createPseudoRandomZombie` (создать случайного зомби). Она получает на вход параметр имя `_name`  (строку `string`). _(Примечание
: задай эту функцию как `public` аналогично предыдущей `private` (частной))_

2. Первая строчка в коде функции должна вызывать `_generatePseudoRandomDna`(сгенерировать случайную ДНК) в `_name` (имя), и сохранять ее в `uint` под названием `randDna` (случайная ДНК).

3. Вторая строчка кода вызывает функцию `_createZombie` (создать зомби) и сообщает ей `_name`(имя) и `randDna` (случайную ДНК).

4. Решение должно содержать в себе 4 строчки кода (включая закрывающую скобку `}` функции).
