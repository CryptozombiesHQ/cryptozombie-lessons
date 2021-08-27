---
title: Отправитель
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
              // Начало здесь
              NewZombie(id, _name, _dna);
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
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Теперь, когда у нас есть карта соответсвий для отслеживания владельцев зомби, надо обновить метод `_createZombie`.

Для этого нам понадобится `msg.sender` (отправитель).

## Отправитель

В Solidity существуют определенные глобальные переменные, доступные всем функциям. Одной из них является `msg.sender` (отправитель), который ссылается на `address` (адрес) человека или смарт-контракта, вызвавшего текущую функцию.

> Примечание: В Solidity выполнение функции всегда начинается с внешнего вызова. Контракт в блокчейне ничего не делает, пока кто-то не вызовет одну из его функций. Поэтому всегда будет нужен `msg.sender`.

Пример использования `msg.sender` для обновления `mapping`:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Обнови соответсвие `favoriteNumber`, чтобы сохранить `_myNumber` под `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ Синтаксис для сохранения в карте соответствия такой же, как для массива
}

function whatIsMyNumber() public view returns (uint) {
  // Затребуй значение, сохраненное в адресе отправителя 
  // Оно будет равно `0`, если отправитель еще не вызывал `setMyNumber`
  return favoriteNumber[msg.sender];
}
```

В этом элементарном примере любой может вызвать `setMyNumber` и сохранить `uint` в нашем контракте, который будет привязан к их адресу. Затем, когда они вызывают `whatIsMyNumber`, им вернется сохраненный `uint`.

Использование `msg.sender` обеспечивает безопасность блокчейна Ethereum. Единственный способ изменить чужие данные - украсть приватный ключ адреса Ethereum.

# Проверь себя

Обновим метод `_createZombie` из Урока 1, чтобы дать право собственности зомби тому, кто вызвал функцию. 

1. Во-первых, когда мы получим `id` нового зомби, обновим нашу карту соответсвий  `zombieToOwner`, чтобы сохранить `msg.sender` под этим `id`.

2. Во-вторых, увеличим `ownerZombieCount` для этого `msg.sender`. 

В Solidity можно увеличить `uint` с помощью `++`, как в javascript:

```
uint number = 0;
number++;
// `number` теперь равен `1`
```

Готовый ответ должен содержать две строчки кода. 
