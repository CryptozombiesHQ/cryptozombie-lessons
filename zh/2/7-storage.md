---
title: Storage与Memory
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

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
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

在 Solidity 中，有两个地方可以存储变量 —— `storage` 或 `memory`。

**_Storage_** 变量是指永久存储在区块链中的变量。 **_Memory_** 变量则是临时的，当外部函数对某合约调用完成时，内存型变量即被移除。 你可以把它想象成存储在你电脑的硬盘或是RAM中数据的关系。

大多数时候你都用不到这些关键字，默认情况下 Solidity 会自动处理它们。 状态变量（在函数之外声明的变量）默认为“存储”形式，并永久写入区块链；而在函数内部声明的变量是“内存”型的，它们函数调用结束后消失。

然而也有一些情况下，你需要手动声明存储类型，主要用于处理函数内的** _ 结构体 _ **和** _ 数组 _ ** 时：


```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ 看上去很直接，不过 Solidity 将会给出警告
    // 告诉你应该明确在这里定义 `storage` 或者 `memory`。

    // 所以你应该明确定义 `storage`:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...这样 `mySandwich` 是指向 `sandwiches[_index]`的指针
    // 在存储里，另外...
    mySandwich.status = "Eaten!";
    // ...这将永久把 `sandwiches[_index]` 变为区块链上的存储

    // 如果你只想要一个副本，可以使用`memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...这样 `anotherSandwich` 就仅仅是一个内存里的副本了
    // 另外
    anotherSandwich.status = "Eaten!";
    // ...将仅仅修改临时变量，对 `sandwiches[_index + 1]` 没有任何影响
    // 不过你可以这样做:
    sandwiches[_index + 1] = anotherSandwich;
    // ...如果你想把副本的改动保存回区块链存储
  }
}
```

如果你还没有完全理解究竟应该使用哪一个，也不用担心 —— 在本教程中，我们将告诉你何时使用 `storage` 或是 `memory`，并且当你不得不使用到这些关键字的时候，Solidity 编译器也发警示提醒你的。

现在，只要知道在某些场合下也需要你显式地声明 `storage` 或 `memory`就够了！

# 实战演习

是时候给我们的僵尸增加“猎食”和“繁殖”功能了！

当一个僵尸猎食其他生物体时，它自身的DNA将与猎物生物的DNA结合在一起，形成一个新的僵尸DNA。

1. 创建一个名为 `feedAndMultiply` 的函数。 使用两个参数：`_zombieId`（ `uint`类型 ）和` _targetDna` （也是 `uint` 类型）。 设置属性为 `public` 的。

2. 我们不希望别人用我们的僵尸去捕猎。 首先，我们确保对自己僵尸的所有权。 通过添加一个`require` 语句来确保 `msg.sender` 只能是这个僵尸的主人（类似于我们在 `createPseudoRandomZombie` 函数中做过的那样）。

>注意：同样，因为我们的答案检查器比较呆萌，只认识把 `msg.sender` 放在前面的答案，如果你切换了参数的顺序，它就不认得了。 但你正常编码时，如何安排参数顺序都是正确的。

3. 为了获取这个僵尸的DNA，我们的函数需要声明一个名为 `myZombie` 数据类型为`Zombie`的本地变量（这是一个 `storage` 型的指针）。 将其值设定为在 `zombies` 数组中索引为`_zombieId`所指向的值。

到目前为止，包括函数结束符 `}` 的那一行， 总共4行代码。

下一章里，我们会继续丰富这个功能。
