---
title: Require
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
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              // start here
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

在第一课中，我们成功让用户通过调用`createRandomZombie`并输入一个名字来创建新的僵尸。 但是，如果用户持续调用这个函数，并创建出无限多个僵尸加入他们的军团，这游戏就太没意思了！

于是，我们作出限定：每个玩家仅允许一次调用随机创建函数。 这样一来，新玩家可以在刚开始玩游戏时通过调用它，为其军团创建初始僵尸。

我们怎样才能限定每个玩家只调用一次随机创建函数呢？

答案是使用`require`。 `require`使得函数在某些状况下运行时候抛出异常，迫使程序终止：

```
function sayHiToVitalik(string _name) public returns (string) {
  // 比较 _name 是否等于 "Vitalik". 如果成立，抛出异常并终止程序
  // (敲黑板: Solidity 并不支持原生的字符串比较, 我们只能通过比较
  // 两字符串的 keccak256 哈希码来进行判断)
  require(keccak256(_name) == keccak256("Vitalik"));
  // 如果返回TRUE, 运行如下语句
  return "Hi!";
}
```


如果你使用参数`sayHiToVitalik（“Vitalik”）`调用创建函数
，它会返回“Hi！”。而如果调用时候使用了其他参数，它则会抛出异常并停止运行。

因此，在调用一个函数之前，用`require`验证前置条件是非常有必要的。

＃实战演习

在我们的僵尸游戏中，我们不希望用户通过反复调用`createRandomZombie`来給他们的军队创建无限多个僵尸 - 这将使得游戏非常无聊。

我们使用了`require`来确保这个函数只有在每个用户第一次调用它的时候运行，用以创建初始僵尸。

1.在`createRandomZombie`的前面放置`require`语句。 使得函数先检查`ownerZombieCount [msg.sender]`是否等于`0`，不然就抛出一个错误。

>注意：在Solidity中，关键词放置的顺序并不重要 
- 虽然参数的两个位置是等效的。 但是，由于我们的答案检查器比较呆板，它只能认定其中一个为正确答案 
- 于是在这里，我们就约定把`ownerZombieCount [msg.sender]`放前面吧 