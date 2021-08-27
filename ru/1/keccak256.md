---
title: Keccak256 и преобразование типов данных
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Нужно, чтобы функция `_generatePseudoRandomDna` (сгенерировать случайную ДНК) возвращала (полу-) случайный `uint`. Как этого добиться? 

В Ethereum есть встроенная хэш-функция `keccak256` (произносится как «кечак»), разновидность SHA3. Хеш-функция обычно преображает входную строку в случайное 256-битное шестнадцатеричное число. Небольшое изменение в строке приведет к сильному изменению хэша. 

Эта функция полезна для выполнения многих задач в Ethereum, но сейчас мы используем ее для обычной генерации псевдослучайных чисел. 

Пример:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Как видишь, функция возвращает абсолютно другое значение, хотя мы изменили всего одну входную букву. 

> Примечание: в блокчейне остро стоит проблема генерации **безопасных** случайных чисел. Приведенный нами метод небезопасен, но для текущей задачи годится, поскольку безопасность не входит в приоритетные задачи ДНК зомби. 

## Преобразование типов данных

Периодически типы данных надо конвертировать. Смотри пример: 

```
uint8 a = 5;
uint b = 6;
// Выдаст ошибку, потому что a * b возвращает uint, а не uint8:
uint8 c = a * b; 
// Чтобы код работал, нужно преобразовать b в uint8:
uint8 c = a * uint8(b); 
```

В примере выше `a * b` возвращал `uint`, но мы попытались сохранить его как `uint8`, что потенциально могло привести к проблемам. Если преобразовать тип данных в `uint8`, то код будет работать, а компилятор не выдаст ошибку. 

# Проверь себя

Давай заполним тело функции `_generatePseudoRandomDna` (сгенерировать случайную ДНК)! Для этого: 

1. Первая строчка кода должна взять `keccak256`-хэш от `_str`, чтобы сгенерировать превдослучайное шестнадцатеричное
 число, преобразовать его в `uint` и сохранить результат в `uint` с именем `rand`. 

2. Мы хотим, чтобы зомби-ДНК содержала только 16 цифр (помнишь `dnaModulus`?). Поэтому следующая строчка кода должна `return` (возвращать) вычисленное выше значение модуля (`%`) `dnaModulus`. 
