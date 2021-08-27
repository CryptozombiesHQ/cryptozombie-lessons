---
title: 僵尸的DNA
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // start here
          }

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
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

我们来把 `feedAndMultiply` 函数写完吧。

获取新的僵尸DNA的公式很简单：计算猎食僵尸DNA和被猎僵尸DNA之间的平均值。

例如：

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // newZombieDna 将等于 3333333333333333
}
```

以后，我们也可以让函数变得更复杂些，比方给新的僵尸的 DNA 增加一些随机性之类的。但现在先从最简单的开始 —— 以后还可以回来完善它嘛。

# 实战演习

1. 首先我们确保 `_targetDna` 不长于16位。要做到这一点，我们可以设置 `_targetDna` 为 `_targetDna ％ dnaModulus` ，并且只取其最后16位数字。

2. 接下来为我们的函数声明一个名叫 `newDna` 的 `uint`类型的变量，并将其值设置为 `myZombie`的 DNA 和 `_targetDna` 的平均值（如上例所示）。
 
>注意：您可以用 `myZombie.name` 或 `myZombie.dna` 访问 `myZombie` 的属性。

3. 一旦我们计算出新的DNA，再调用 `_createZombie` 就可以生成新的僵尸了。如果你忘了调用这个函数所需要的参数，可以查看 `zombiefactory.sol` 选项卡。请注意，需要先给它命名，所以现在我们把新的僵尸的名字设为`NoName` - 我们回头可以编写一个函数来更改僵尸的名字。

>注意：对于 Solidity 高手，你可能会注意到我们的代码存在一个问题。别担心，下一章会解决这个问题的 ;）
