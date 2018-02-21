---
title: Структуры
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

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

      }
---

Часто нужны более сложные типы данных. Для этого в Solidity есть **_structs_** (структуры):

```
struct Person {
  uint age;
  string name;
}

```

С помощью структур ты создашь более сложные типы данных с несколькими свойствами.

> Примечание: мы только что ввели новый тип `string` (строка). Строки используются для данных в кодировке UTF-8 произвольной длины. Пример строки приветствия = «Привет, мир!»

# Проверь себя

Мы собираемся создать зомби! У них будет несколько свойств, поэтому структура подойдет как нельзя лучше. 

1. Создай `struct` (структуру) с именем `Zombie`.

2. У нашей структуры `Zombie` будет 2 свойства: `name` (имя) (`string` (строка)), и `dna` (ДНК) (`uint`).
