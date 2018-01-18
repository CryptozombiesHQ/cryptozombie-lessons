---
title: Inheritance
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // Start here

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

      contract ZombieFeeding is ZombieFactory {

      }

---

我们的游戏代码越来越长。 当代码过于冗长的时候，最好将代码和逻辑分拆到多个不同的合约中，以便于管理。

有个让Solidity的更易于管理的功能，就是** _继承_ **合约：



```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

由于 `BabyDoge` 是从 “Doge”哪里 **_ _inherits__** （继承)过来的。 这意味着当您编译和部署了`BabyDoge`，它将可以访问`catchphrase（）`和`anotherCatchphrase（）`以及我们在`Doge`中定义的其他公共函数。

这可以用于逻辑继承（比如表达子类的时候，`Cat`是一种`Animal`）。 但也可以简单地将类似的逻辑组合到不同的类中以组织代码。

＃小测试

在接下来的章节中，我们将要为僵尸实现各种功能，让它可以“饲养”和“繁殖”。 我们把这些运算放到父类“ZombieFactory”中，这样所有继承自“ZombieFactory”的类都可以使用这些方法了。

1.在ZombieFactory下创建一个叫“ZombieFeeding”的合约，使它继承自“ZombieFactory”合约。

