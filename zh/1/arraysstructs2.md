---
title: 使用结构体和数组
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

          function createZombie(string _name, uint _dna) {
              // 这里开始
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### 创建新的结构体

还记得上个例子中的 `Person` 结构吗？

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

现在我们学习创建新的 `Person`结构，然后把它加入到名为`people` 数组中.

```
// 创建一个新的Person:
Person satoshi = Person(172, "Satoshi");

// 将新创建的satoshi添加进people数组:
people.push(satoshi);
```

你也可以两步并一步，用一行代码更简洁:

```
people.push(Person(16, "Vitalik"));
```

> 注：`array.push()` 在数组的 **尾部** 加入新元素 ，所以元素在数组中的顺序就是我们添加的顺序， 如:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers is now equal to [5, 10, 15]
```

# 测试一把

让我们创建名为createZombie的函数来做点儿什么吧

1. 在函数体里新创建一个`Zombie`, 然后把它加入 `zombies` 数组中. 新创建的僵尸的`name` 和 `dna`，来自于函数的参数
2. 让我们用一行代码简洁地完成它。
