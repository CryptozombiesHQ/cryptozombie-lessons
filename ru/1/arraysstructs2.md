---
title: Как работать со структурами и массивами
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

          function createZombie(string _name, uint _dna) {
              // Начало здесь
          }

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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Создаем новую структуру

Помнишь структуру `Person` (личность) из предыдущего примера?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Посмотри, как создать новые личности `Person` и добавить их в массив `people`(люди):

```
// Создать новую личность:
Person satoshi = Person(172, "Satoshi");

// Добавить личность в массив:
people.push(satoshi);
```

Можно совместить и записать одной строчкой, чтобы код выглядел чище:

```
people.push(Person(16, "Vitalik"));
```

Обрати внимание, что `array.push()` обозначает конец массива, поэтому элементы выстраиваются в порядке добавления. Пример: 

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// Числа равны [5, 10, 15]
```

# Проверь себя

Заставим функцию createZombie что-нибудь сделать!

1. Заполни тело функции таким образом, чтобы она создавала нового `Zombie` и добавляла его в массив `zombies`. Имя `name` и ДНК `dna` нового зомби должны браться из параметров функции.
2. Запиши все одной строчкой, чтобы код выглядел чисто.
