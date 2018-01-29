---
title: 定义函数
actions: ['答案', '提示']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // 这里开始

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

在 Solidity 中函数定义的句法如下:

```
function eatHamburgers(string _name, uint _amount) {

}
```

这是一个称作为 `eatHamburgers` 的函数，它接受两个参数：一个 `string` 和 一个 `uint`。现在函数本身还是空的。

> 注：: 习惯上函数里的变量都是以(`_`)开头 (但不是硬性规定) 以区别全局变量。我们整个教程都会沿用这个习惯。

我们的函数定义如下:

```
eatHamburgers("vitalik", 100);
```

# 测试一把

在我们的应用里，我们要能创建一些僵尸，让我们写一个函数做这件事吧！

1. 建立一个函数 `createZombie`. 它接受两个输入变量: **名字** (类型`string`), 和 **__dna_** (类型`uint`)。

暂时让函数空着——我们在后面会增加内容。