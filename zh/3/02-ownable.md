---
title: 私有合同
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Import here

        // 2. Inherit here:
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
---

你是否发现了前一章的安全漏洞？

`setKittyContractAddress` 函数是 `external` 类型，所以任何人都可以调用它！这意味着，任何调用该方法的人都可以更改 `CryptoKitties` 的合约地址，并且所有用户都能破解我们的 `app`。

我们确实希望能够在合约中更新这个地址，但是我们不希望所有人都可以更新它。

处理此类事件，通常的做法是使用 `Ownable` 合约 -这意味着他们有一个拥有特殊权限的所有者(你自己)

## OpenZeppelin 的 `Ownable` 合约

下面是一个从 *_OpenZeppelin_** 的`Solidity`库获得的 `Ownable` 合约。`OpenZeppelin` 是一个安全的、社区审查的智能合约库，可以在自己的`DApps`中使用。
当这节课结束后，在你焦急地等待第 4 课的发布时，我们强烈建议你去看看他们的网站以便进一步学习！

阅读下面的合约。你会发现一些我们还没有学习到的东西，但别担心，我们在之后会讨论他们。

```
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
```

这里有一些我们之前从未见过的新东西:

- 构造函数: `function Ownable()` 是一个 **_构造函数_**, 它是一个可选的特殊函数，与合约名称相同，只在第一次创建合约时执行。
- 函数修饰符: `modifier onlyOwner()`。修饰符是用于修改其他函数的 `half-functions`(半函数)，通常用于在执行之前检查某些要求。在这种情况下，`onlyOwner` 可以用来限制访问，因此只有合约的所有者才能执行该函数。在下一章中，我们将讨论函数修饰符，以及奇怪的`_;`

- `indexed` 关键字: 不用担心这个，我们暂时还不需要它。

所以 `Ownable` 合约基本上是这样的:

1. 当创建一个合约时, 它的构造函数将 `owner` 设置为 `msg.sender` (部署者的address)

2. 它添加一个 `onlyOwner` 修饰符, 它可以将某些功能限定到只有 `owner` 才能访问

3. 它允许你将合约转移到一个新的 `owner` 上

`onlyOwner` 是智能合约中最常见的需求，大多数 `DApps` 都是从复制/粘贴 `Ownable`合约开始的，然后他们的第一个合约就继承了它。

因为我们想使用 `onlyOwner` 来限制 `setKittyContractAddress` 方法，所以我们会为我们的合约做同样的事情。

## 练习

我们已经将 `Ownable` 合约复制到新文件`ownable.sol`中，让我们来着手使 `ZombieFactory` 继承它。

1. 修改我们的代码以导入合约 `ownable.sol`。如果你不记得如何做，看一看 `zombiefeeding.sol`

2. 修改 `ZombieFactory` 合约继承 `Ownable`。如果你不记得如何做，看一看 `zombiefeeding.sol`
