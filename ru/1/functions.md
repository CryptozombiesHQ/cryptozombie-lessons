---
title: Как задавать функции
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

          function createZombie(string _name, uint _dna) {

          }

      }
---

Вот как задать функцию в Solidity :

```
function eatHamburgers(string _name, uint _amount) {

}
```

Функция `eatHamburgers` (есть гамбургеры) берет два параметра: `string` и `uint`. Пока тело функции оставим пустым. 

> Примечание: обычно (но не обязательно) имена переменных в параметрах функций записывают со знаком подчеркивания в начале, чтобы было проще отличить их от глобальных переменных. В наших урокам мы тоже будем пользоваться этим обычаем.

Примерно так будет называться функция:

```
eatHamburgers("vitalik", 100);
```

# Проверь себя

Чтобы начать производить зомби, зададим функцию.

1. Создай функцию под названием `createZombie` (создать зомби), которая берет 2 параметра: **__name_** (имя, строка `string`) и **__dna_** (ДНК, тип `uint`).

Пока оставь тело функции пустым, мы заполним его позже. 
