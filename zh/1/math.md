---
title: 数学运算
actions: ['答案', '提示']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //这里开始

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

在 Solidity 中，数学运算很直观明了，与其它程序设计语言相同:

* 加法: `x + y`
* 减法: `x - y`,
* 乘法: `x * y`
* 除法: `x / y`
* 商 / 余数: `x % y` _(例如, `13 % 5` 余 `3`, 因为13除以5，余3)_

Solidity 还支持 **_乘方操作_** (如：x 的 y次方） // 例如： 5 ** 2 = 25
```

# 测试一把

为了保证我们的僵尸的DNA只含有16个字符，我们先造一个`uint`数据，让它等于10^16。这样一来以后我们可以用模运算符 `%` 把一个整数变成16位。

1. 建立一个`uint`类型的变量，名字叫`dnaModulus`, 令其等于 **10 的 `dnaDigits` 次方**.
