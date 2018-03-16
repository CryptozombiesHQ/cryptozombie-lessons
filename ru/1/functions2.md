---
title: Закрытые и открытые функции
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
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

По умолчанию функции в Solidity `public` (открытые): любой человек или контракт может вызвать и исполнить функцию твоего контракта. 

Разумеется, это не всегда желательно, потому что в контракте могут найтись уязвимости для атак. Лучше по умолчанию помечать функции как «закрытые» и потом задавать «открытые» функции, которые не страшно выставить на всеобщее обозрение.

Вот как задать закрытую функцию:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

Это означает, что только другие функции внутри контракта смогут вызвать и исполнить функцию добавления к массиву `numbers`. 

Как видишь, после имени функции идет ключевое слово `private`. Как и параметры, названия закрытых функций принято записывать, начиная со знака подчеркивания (`_`).

# Проверь себя

На данный момент функция контракта `createZombie` (создать зомби) по умолчанию является открытой — любой может вызвать ее и создать зомби внутри нашего контакта! Давай закроем ее. 

1. Измени тип функции `createZombie` на закрытый. Не забудь записать имя функции так, как принято!
