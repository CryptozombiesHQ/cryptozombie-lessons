---
title: 数组
actions: ['checkAnswer', 'hints']
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

          // 这里开始

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

      }
---

如果你想建立一个集合，可以用 **_数组_**. Solidity支持两种数组: **_静态_** 数组和**_动态_** 数组:

```
// Array with a fixed length of 2 elements:
uint[2] fixedArray;
// another fixed Array, can contain 5 strings:
string[5] stringArray;
// a dynamic Array - has no fixed size, can keep growing:
uint[] dynamicArray; 
```

你也可以建立一个 **_数据结构_**的集合 例如，上一章提到的 `Person` 数据结构:

```
Person[] people; // dynamic Array, we can keep adding to it
```

记住：状态变量被永久保存在区域链中。 所以在你的合同中建立一个动态数组保存数据结构是非常有意义的，如同一个小数据库。

## 公共数组

你可以定义`public`数组, Solidity 会自动创建 **_getter_** 方法. 语法如下:

```
Person[] public people;
```

其它的合同可以读（但不能写）这个数组，所以这是在合同中保存公共数据的一个有用的模式。

# 测试一把

目标是把一个僵尸部队保存在我们的APP里，而且我们想让其它APP看到这些骄傲的僵尸。为此我们要定义公共数组。

1. 建立一个公共的僵尸数据结构数组，命名为：`zombies`.
