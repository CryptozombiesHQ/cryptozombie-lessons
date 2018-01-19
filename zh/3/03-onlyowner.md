---
title: onlyOwner 函数修饰符
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

          // Modify this function:
          function setKittyContractAddress(address _address) external {
            kittyContract = KittyInterface(_address);
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
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

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

            function _createZombie(string _name, uint _dna) internal {
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

限制我们的 `ZombieFactory` 基础合约继承自 `Ownable`，我们可以在 `ZombieFeeding` 中使用 `onlyOwner` 函数修饰符

这需要我们知道合约继承是如何工作的. 我们记得:

```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```
我们看到 `ZombieFeeding` 继承于 `ZombieFactory`， 而 `ZombieFactory` 继承于 `Ownable`， 因此，`ZombieFeeding` 也是继承于 `Ownable` ，并且可以从 `Ownable` 合约中访问 函数／事件／修饰符。这同样适用于任何继承 `ZombieFeeding`的合约

## 函数修饰符

`函数修饰符` 看起来像是一个函数，但是关键字使用 `modifier` 而不是 `function` 。它无法像一个函数那样被直接调用
-相反我们可以在函数定义的最后附加 `函数修饰符` 的名称来改变该函数的一些行为。

让我们仔细看一下 `onlyOwner`:

```
/**
 * @dev Throws if called by any account other than the owner.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

我们将使用下面的修饰符:

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // Note the usage of `onlyOwner` below:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

请注意`likeABoss`上的`onlyOwner`修饰符。 当你调用 `likeABoss` 时，`onlyOwner` 的内部代码会率先执行，然后当执行到 `_;` 时，在 `onlyOwner` 的声明里，他会返回并执行 `likeABoss`中的代码。

因此，虽然`函数修饰符`有其他使用方法，但最常见的用例之一是在函数执行之前添加 `require` 检查。

在 `onlyOwner`的情况下，添加这个修饰符到一个函数中，使得它只有部署者可以调用该函数。

>Note: 通常，在函数中给予部署者特殊权利是必要的，但也可能会被恶意使用。例如，所有者可以添加一个后门函数，允许他将任何人的僵尸都转移到自己身上。

>所以，记住这一点很重要，因为一个DApp在 以太坊 上并不意味着它是去中心化的 - 你必须真正阅读完整的源代码以确保它不受所有者的特殊控制，你需要担心它。
作为开发人员，在保持对DApp的控制方面要有一个非常谨慎的平衡，这样你就可以修复潜在的问题，并构建一个用户可以信任的无所有者平台来保护他们的数据

## 练习

现在，我们可以限制对 `setKittyContractAddress` 的访问，这样没有人可以在将来访问它了。

1. 添加 `onlyOwner` 修饰符到 `setKittyContractAddress` 函数。
