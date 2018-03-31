---
title: Адреса и соответствия
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

          // Здесь задай отображение

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

Давай сделаем нашу игру многопользовательской, дав владельца каждому зомби в базе данных.

Чтобы это осуществить, нам понадобятся 2 новых типа данных: `address` (адреса) и `mapping` (отображения).

## Адреса

Блокчейн Ethereum состоит из **_аккаунтов_** (счетов), вроде банковских. На аккаунте находится баланс **_Эфира_** (криптовалюты блокчейна Ethereum). Ты можешь отправлять и получать платежи в Эфире на другие счета, также как ты переводишь деньги со своего банковского счета на счета других людей.

У каждого счета есть `address` (адрес), наподобие номера банковского счета. Это уникальный идентификатор счета, который выглядит так: 

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Этот адрес принадлежит команде Криптозомби. Если тебе нравится игра, можешь послать нам эфир!😉). 

Мы изучим самое важное блокчейн-адресов в следующем уроке, сейчас же достаточно знать, что **адрес принадлежит определенному человеку** (или контракту). 

Поэтому мы можем использовать его как уникальный идентификатор принадлежности зомби. Когда пользователь создает нового зомби, взаимодействуя с нашим приложением, мы привязываем право собственности на зомби к адресу Ethereum, который вызвал функцию. 

## Соответствия

В первом уроке мы рассмотрели **_структуры_** и **_массивы_**. **_Соответствия_** — это еще один способ хранения упорядоченных данных в Solidity.

Определение `mapping` (соответствий) выглядит как-то так:

```
// Для финансового приложения мы храним uint, который содержит остаток на счете пользователя: 
mapping (address => uint) public accountBalance;
// Или может использоваться для хранения / поиска имен пользователей на основе userId 
mapping (uint => string) userIdToName;
```

Соответствия - это, по сути, распределенное хранилище типа «ключ — значение», в котором можно хранить и искать данные. В первом примере ключ — это «адрес», а значение - «uint», а во втором примере ключ - «uint», а значение — «строка». 

# Проверь себя

Чтобы хранить информацию о правах собственности на зомби, используем два соответствия: одно отслеживает адрес, которому принадлежит зомби, второе отслеживает, сколькими зомби владеет пользователь.

1. Создай `mapping` (соответствие) под названием `zombieToOwner`. Ключ — `uint` (мы будем хранить и искать зомби по id). Значение - `address`. Cделаем это сооветствие открытым (public).

2. Создай `mapping` (соответствие) под названием `ownerZombieCount`, где ключ — `address`, а значение — `uint`.
