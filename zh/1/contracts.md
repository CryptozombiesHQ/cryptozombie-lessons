---
title: "合同"
actions: ['答案', '提示']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. 这里写版本指令

      //2. 这里建立智能合同
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

从最基本的开始入手:

Solidity的代码都包裹在 **合约**里面. 一份 `合约` 就是以太应币应用的基本模块， 所有的变量和函数都属于一份合同, 它是你所有应用的起点.

一份名为`HelloWorld`的空合约如下:

```
contract HelloWorld {

}
```

## 版本指令

所有的solidity源码都必须冠以 "version pragma" — 标明 Solidity 编译器的版本. 以避免将来新的编译器可能破坏你的代码。

例如: `pragma solidity ^0.4.19;` (此时此刻，solidity 的最新版本是 0.4.19).

综上所述， 下面就是一个最基本的合约 — 每次建立一个新的项目时的第一段代码:

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# 测试一把

为了建立我们的僵尸部队， 让我们先建立一个基础合约，称为 `ZombieFactory`.

1. 在右边的输入框里输入`0.4.19`，我们的合约基于这个版本的编译器

2. 建立一个空合约`ZombieFactory`.

一切完毕，点击下面 "答案" . 如果没效果，点击 "提示".
