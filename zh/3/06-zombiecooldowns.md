---
title: 僵尸冷却
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          // 1. 在这里定义 `_triggerCooldown` 函数

          // 2. 在这里定义 `_isReady` 函数

          function feedAndMultiply(uint _zombieId, uint _targetDna, string species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        KittyInterface kittyContract;

        function setKittyContractAddress(address _address) external onlyOwner {
          kittyContract = KittyInterface(_address);
        }

        function _triggerCooldown(Zombie storage _zombie) internal {
          _zombie.readyTime = uint32(now + cooldownTime);
        }

        function _isReady(Zombie storage _zombie) internal view returns (bool) {
            return (_zombie.readyTime <= now);
        }

        function feedAndMultiply(uint _zombieId, uint _targetDna, string species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(species) == keccak256("kitty")) {
            newDna = newDna - newDna % 100 + 99;
          }
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

      }
---


现在，`Zombie` 结构体中定义好了一个 `readyTime` 属性，让我们跳到 `zombiefeeding.sol`， 去实现一个”冷却周期定时器“。

按照以下步骤修改 `feedAndMultiply`：

1. ”捕猎“行为会触发僵尸的”冷却周期“

2. 僵尸在这段”冷却周期“结束前不可再捕猎小猫

这将限制僵尸，防止其无限制地捕猎小猫或者整天不停地繁殖。将来，当我们增加战斗功能时，我们同样用”冷却周期“限制僵尸之间打斗的频率。

首先，我们要定义一些辅助函数，设置并检查僵尸的 `readyTime`。

## 将结构体作为参数传入

由于结构体的存储指针可以以参数的方式传递给一个 `private` 或 `internal` 的函数，因此结构体可以在多个函数之间相互传递。

遵循这样的语法：

```
function _doStuff(Zombie storage _zombie) internal {
  // do stuff with _zombie
}
```

这样我们可以将某僵尸的引用直接传递给一个函数，而不用是通过参数传入僵尸ID后，函数再依据ID去查找。

## 实战演习

1. 先定义一个 `_triggerCooldown` 函数。它要求一个参数，`_zombie`，表示一某个僵尸的存储指针。这个函数可见性设置为 `internal`。

2. 在函数中，把 `_zombie.readyTime` 设置为 `uint32（now + cooldownTime）`。

3. 接下来，创建一个名为 `_isReady` 的函数。这个函数的参数也是名为 `_zombie` 的 `Zombie storage`。这个功能只具有 `internal` 可见性，并返回一个 `bool` 值。

4. 函数计算返回`(_zombie.readyTime <= now)`，值为 `true` 或 `false`。这个功能的目的是判断下次允许猎食的时间是否已经到了。
