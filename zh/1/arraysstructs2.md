---
title: 使用数据结构和数组
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

### 创建新的数据结构

还记得上个例子中的 `Person` 结构吗？

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

现在我们学习创建新的 `Person`结构，然后把它加入到 `people` 数组中.

```
// create a New Person:
Person satoshi = Person(172, "Satoshi");

// Add that person to the Array:
people.push(satoshi);
```

你也可以两步并一步，用一行代码更简洁:

```
people.push(Person(16, "Vitalik"));
```

> 注：`array.push()` 在数组的尾部加新元素 **end** ，所以元素在数组中的顺序就是我们添加的顺序， 如:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers is now equal to [5, 10, 15]
```

# 测试一把

让createZombie做点儿什么吧

1. 在function里先创建一个`Zombie`, 然后把它加入 `zombies` 数组中. 新创见的僵尸的`name` 和 `dna`，是来自function的输入变量
2. 让我们用一行代码简洁地完成它。
