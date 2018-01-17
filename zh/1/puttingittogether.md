---
title: 搭建在一起
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          // start here

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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

我们接近完成我们的随记僵尸制造器了，让我们写一个公共的函数把所有的部件连接起来。

我们写一个公共函数，它又一个输入变量僵尸的名字，之后用它生成僵尸的DNA。

# 测试一把

1. 建立一个 `public` 函数，命名为`createRandomZombie`. 它又一个输入变量 `_name` (数据类型是 `string`). _(注: 定义一个公共函数 `public`， 如同你定义一个私有 `private`函数的做法一样)_

2. 函数的第一行应该调用 `_generateRandomDna` 函数，作用于`_name`, 结果保存在一个类型为 `uint` 的变量里，命名为 `randDna`.

3. 第二行调用 `_createZombie` 函数， 输入参数： `_name` 和 `randDna`.

4. 结果因该生成4行代码 (包括函数的结束符号 `}` )。
