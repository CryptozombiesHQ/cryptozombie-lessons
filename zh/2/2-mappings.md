---
title: 映射（Mapping）和地址（Address）
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          // 在这里定义映射

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

我们通过给数据库中的僵尸指定“主人”， 来支持“多玩家”模式。

如此一来，我们需要引入2个新的数据类型：`mapping`（映射） 和 `address`（地址）。

## Addresses （地址）

以太坊区块链由** _ account _ **(账户)组成，你可以把它想象成银行账户。一个帐户的余额是** _以太_ **（在以太坊区块链上使用的币种），你可以和其他帐户之间支付和接受以太币，就像你的银行帐户可以电汇资金到其他银行帐户一样。

每个帐户都有一个“地址”，你可以把它想象成银行账号。这是账户唯一的标识符，它看起来长这样：

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

（这是 CryptoZombies 团队的地址，如果你喜欢 CryptoZombies 的话，请打赏我们一些以太币！😉）

我们将在后面的课程中介绍地址的细节，现在你只需要了解**地址属于特定用户（或智能合约）的**。

所以我们可以指定“地址”作为僵尸主人的 ID。当用户通过与我们的应用程序交互来创建新的僵尸时，新僵尸的所有权被设置到调用者的以太坊地址下。

## Mapping（映射）

在第1课中，我们看到了** _ 结构体 _ ** 和 ** _ 数组 _ **。 ** _映射_ **是另一种在 Solidity 中存储有组织数据的方法。

映射是这样定义的：

```
//对于金融应用程序，将用户的余额保存在一个 uint类型的变量中：
mapping (address => uint) public accountBalance;
//或者可以用来通过userId 存储/查找的用户名
mapping (uint => string) userIdToName;

```

映射本质上是存储和查找数据所用的键-值对。在第一个例子中，键是一个 `address`，值是一个 `uint`，在第二个例子中，键是一个`uint`，值是一个 `string`。

# 实战演习

为了存储僵尸的所有权，我们会使用到两个映射：一个记录僵尸拥有者的地址，另一个记录某地址所拥有僵尸的数量。

1.创建一个叫做 `zombieToOwner` 的映射。其键是一个`uint`（我们将根据它的 id 存储和查找僵尸），值为 `address`。映射属性为`public`。

2.创建一个名为 `ownerZombieCount` 的映射，其中键是 `address`，值是 `uint`。
