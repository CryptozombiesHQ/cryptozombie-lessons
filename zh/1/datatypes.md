---
title: 状态变量和整数
actions: ['答案', '提示']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //这里开始

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

真棒！我们已经为我们的合约做了一个外壳， 下面学习 Solidity 中如何使用变量。

**_状态变量_**是被永久地保存在合约中。也就是说它们被写入以太币区块链中. 想象成写入一个数据库。

##### 例子:
```
contract Example {
  // 这个无符号整数将会永久的被保存在区块链中
  uint myUnsignedInteger = 100;
}
```

在上面的例子中，定义 `myUnsignedInteger` 为 `uint` 类型，并赋值100。

## 无符号整数: `uint`

`uint` 无符号数据类型， 指**其值不能是负数**，对于有符号的整数存在名为 `int` 的数据类型。

> 注: Solidity中， `uint` 实际上是 `uint256`代名词， 一个256位的无符号整数。你也可以定义位数少的uints — `uint8`， `uint16`， `uint32`， 等…… 但一般来讲你愿意使用简单的 `uint`， 除非在某些特殊情况下，这我们后面会讲。

# 实战演习

我们的僵尸DNA将由一个十六位数字组成。

定义 `dnaDigits` 为 `uint` 数据类型, 并赋值 `16`。
