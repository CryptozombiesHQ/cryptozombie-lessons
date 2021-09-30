---
title: Наследование
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // Начало здесь

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

      contract ZombieFeeding is ZombieFactory {

      }

---

Код уже довольно длинный! Чтобы не делать один длиннющий контракт и организовать код, можно разбить логику кода на несколько контрактов. 

В Solidity есть фича, которая помогает управлять длинными контрактами — **_наследование_**:

```
contract Doge {
  function catchphrase() public returns (string) {
    return "Клевый песик";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Клевый щеночек";
  }
}
```

`BabyDoge` (щенок) **_наследует_** `Doge` (Псу!). Если ты скомпилируешь и развернешь `BabyDoge`, он получит доступ и к `catchphrase()` и к `anotherCatchphrase()` (и ко всем остальным открытым функциям, которые мы опишем в `Doge`).

Это можно использовать для логического наследования (как с подтипами, `Cat` (кошка) это `Animal` (животное)), или для простой организации кода, группируя вместе одинаковую логику  внутри различных классов. 

# Проверь себя

В следующих главах мы собираемся наделить зомби способностью питаться и размножаться. Поместим эту логику в класс, который наследует все методы из `ZombieFactory`. 

1. Создай контракт под названием `ZombieFeeding` сразу под `ZombieFactory`. Этот контракт наследует контракту из нашей Фабрики Зомби `ZombieFactory`. 
