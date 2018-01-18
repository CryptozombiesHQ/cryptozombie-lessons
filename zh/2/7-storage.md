---
title: Storage vs Memory
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Start here

        }
      "zombiefactory.sol": |
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
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

在Solidity中，有两个地方可以存储变量 - “存储”或“内存”。

**_Storage_**（存储）变量是指永久存储在区块链中的变量。 **_Memory_**（内存） 变量则是临时的，当外部函数对某合约调用完成时，内存型变量即被移除。 您可以把它想象成存储在你电脑的硬盘或是RAM中数据的关系。

大多数时候您都用不到这些关键字，默认情况下Solidity会自动处理它们。 状态变量（在函数之外声明的变量）默认为“存储”形式，并永久写入区块链；而在函数内部声明的变量是“内存”型的，它们函数调用结束后消失。

然而也有一些情况下，您需要手动声明存储类型，主要用于处理函数内的** _ structs _ **和** _ arrays _ ** 时：


```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Seems pretty straightforward, but solidity will give you a warning
    // telling you you should explicitly declare `storage` or `memory` here.

    // So instead, you should declare with the `storage` keyword, like:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...in which case `mySandwich` is a pointer to `sandwiches[_index]`
    // in storage, and...
    mySandwich.status = "Eaten!";
    // ...this will permanently change `sandwiches[_index]` on the blockchain.

    // If you just want a copy, you can use `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...in which case `anotherSandwich` will simply be a copy of the 
    // data in memory, and...
    anotherSandwich.status = "Eaten!";
    // ...will just modify the temporary variable and have no effect 
    // on `sandwiches[_index + 1]`. But you can do this:
    sandwiches[_index + 1] = anotherSandwich;
    // ...if you want to copy the changes back into blockchain storage.
  }
}
```

如果您还没有完全理解究竟应该使用哪一个，也不用担心 -- 在本教程中，我们将告诉您何时使用“存储”或是“内存”，并且当您不得不使用到这些关键字的时候，Solidity编译器也发警示提醒您的。

现在，只要知道在某些场合下也需要您显式地声明“存储”或“内存”就够了！

# 实战演习

是时候给我们的僵尸增加“猎食”和“繁殖”功能了！

当一个僵尸猎食其他生物体时，它自身的DNA将与猎物生物的DNA结合在一起，形成一个新的僵尸DNA。

1.创建一个名为`feedAndMultiply`的函数。 使用两个参数：`_zombieId`（`单元(uint)`）和`_targetDna`（也是`uint`类型）。 设置属性为“public”(公开)的。

2.我们不希望别人用我们的僵尸去捕猎。 首先，我们确保对自己僵尸的所有权。 通过添加一个`require`语句来确保`msg.sender`只能是这个僵尸的主人（类似于我们在`createRandomZombie`函数中做过的那样）。

>注意：同样，因为我们的答案检查器比较呆萌，只认识把“msg.sender”在前的答案，如果您切换了参数的顺序，它就不认得了。 但您正常编码时，如何安排参数顺序都是正确的。

3. 为了获取这个僵尸的DNA，我们的函数需要声明一个名为myZombie的本地`僵尸'（这是一个“存储”形的指针）。 在我们的`zombies`数组中将这个变量设置为索引`_zombieId`。

到目前为止，包括关闭`}`的那一行， 你该一共写了4行代码。

下一章里，我们会继续丰富这个功能。