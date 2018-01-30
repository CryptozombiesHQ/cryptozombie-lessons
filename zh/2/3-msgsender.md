---
title: Msg.sender
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

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              // start here
              NewZombie(id, _name, _dna);
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
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              NewZombie(id, _name, _dna);
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

现在有了一套映射来记录僵尸的所有权了，我们可以修改`_createZombie`方法来运用它们。

为了做到这一点，我们要用到“msg.sender”。

## msg.sender

在Solidity中，有一些全局变量可以被所有功能调用。 其中一个就是“msg.sender”，它指的是当前调用者（或智能合约）的“地址”。

>注意：在Solidity中，功能执行始终需要从外部调用者开始。 一个合约只会在区块链上什么也做不了，除非有调用者呼叫其中的函数。 调用者就是`msg.sender`。

以下是使用`msg.sender`来更新`mapping`的例子：

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Update our `favoriteNumber` mapping to store `_myNumber` under `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ The syntax for storing data in a mapping is just like with arrays
}

function whatIsMyNumber() public view returns (uint) {
  // Retrieve the value stored in the sender's address
  // Will be `0` if the sender hasn't called `setMyNumber` yet
  return favoriteNumber[msg.sender];
}
```

在这个小小的例子中，任何人都可以调用`setMyNumber`并在我们的合约中存下一个`单元（uint）`并且与他们的地址相绑定。 然后，他们调用“whatIsMyNumber”就会返回他们存储的“单元（uint）”。

使用“msg.sender”很安全，因为它具有以太坊区块链的安全保障 - 除非窃取与以太坊地址相关联的私钥，否则是没有办法修改其他人的数据的。

# 实战演习

我们来修改第1课的`_createZombie`方法，将僵尸分配给函数调用者吧。

1.首先，在得到新的僵尸`id`后，更新`zombieToOwner`映射，在`id`下面存入`msg.sender`。

然后，我们为这个“msg.sender”名下的`ownerZombieCount`加1。

跟在javascript中一样， 在Solidity中你也可以用`++`使`uint`递增。

```
uint number = 0;
number++;
// `number` 现在是 `1`了
```

修改两行代码即可。
