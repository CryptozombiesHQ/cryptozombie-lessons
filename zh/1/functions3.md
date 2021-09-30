---
title: 函数的更多属性
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
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {

          }

      }
---

本章中我们将学习函数的返回值和修饰符。

## 返回值

要想函数返回一个数值，按如下定义：

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

Solidity 里，函数的定义里可包含返回值的数据类型(如本例中 `string`)。

## 函数的修饰符

上面的函数实际上没有改变 Solidity 里的状态，即，它没有改变任何值或者写任何东西。

这种情况下我们可以把函数定义为 **_view_**, 意味着它只能读取数据不能更改数据:

```
function sayHello() public view returns (string) {
```

Solidity 还支持 **_pure_** 函数, 表明这个函数甚至都不访问应用里的数据，例如：

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

这个函数甚至都不读取应用里的状态 — 它的返回值完全取决于它的输入参数，在这种情况下我们把函数定义为 **_pure_**.

> 注：可能很难记住何时把函数标记为 pure/view。 幸运的是， Solidity 编辑器会给出提示，提醒你使用这些修饰符。

# 实战演习

我们想建立一个帮助函数，它根据一个字符串随机生成一个DNA数据。

1. 创建一个 `private` 函数，命名为 `_generatePseudoRandomDna`。它只接收一个输入变量 `_str` (类型 `string`), 返回一个 `uint` 类型的数值。

2. 此函数只读取我们合约中的一些变量，所以标记为`view`。

3. 函数内部暂时留空，以后我们再添加代码。
