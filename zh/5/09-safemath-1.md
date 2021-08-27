---
title: 预防溢出
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";
        // 1. 在这里引入

        contract ZombieFactory is Ownable {

          // 2. 在这里定义 using safemath 

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;
          uint cooldownTime = 1 days;

          struct Zombie {
            string name;
            uint dna;
            uint32 level;
            uint32 readyTime;
            uint16 winCount;
            uint16 lossCount;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) internal {
            uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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
      "zombieownership.sol": |
        pragma solidity ^0.4.19;

        import "./zombieattack.sol";
        import "./erc721.sol";
        
        contract ZombieOwnership is ZombieAttack, ERC721 {

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) public view returns (uint256 _balance) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) public view returns (address _owner) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to]++;
            ownerZombieCount[_from]--;
            zombieToOwner[_tokenId] = _to;
            Transfer(_from, _to, _tokenId);
          }

          function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            _transfer(msg.sender, _to, _tokenId);
          }

          function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _to;
            Approval(msg.sender, _to, _tokenId);
          }

          function takeOwnership(uint256 _tokenId) public {
            require(zombieApprovals[_tokenId] == msg.sender);
            address owner = ownerOf(_tokenId);
            _transfer(owner, msg.sender, _tokenId);
          }
        }
      "zombieattack.sol": |
        pragma solidity ^0.4.19;

        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          uint randNonce = 0;
          uint attackVictoryProbability = 70;

          function randMod(uint _modulus) internal returns(uint) {
            randNonce++;
            return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
          }

          function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            Zombie storage enemyZombie = zombies[_targetId];
            uint rand = randMod(100);
            if (rand <= attackVictoryProbability) {
              myZombie.winCount++;
              myZombie.level++;
              enemyZombie.lossCount++;
              feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
            } else {
              myZombie.lossCount++;
              enemyZombie.winCount++;
              _triggerCooldown(myZombie);
            }
          }
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
          }

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
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

          modifier onlyOwnerOf(uint _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            _;
          }

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }
        }
      "ownable.sol": |
        pragma solidity ^0.4.19;
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
      "safemath.sol": |
        pragma solidity ^0.4.18;

        /**
         * @title SafeMath
         * @dev Math operations with safety checks that throw on error
         */
        library SafeMath {

          /**
          * @dev Multiplies two numbers, throws on overflow.
          */
          function mul(uint256 a, uint256 b) internal pure returns (uint256) {
            if (a == 0) {
              return 0;
            }
            uint256 c = a * b;
            assert(c / a == b);
            return c;
          }

          /**
          * @dev Integer division of two numbers, truncating the quotient.
          */
          function div(uint256 a, uint256 b) internal pure returns (uint256) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint256 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          /**
          * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
          */
          function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            assert(b <= a);
            return a - b;
          }

          /**
          * @dev Adds two numbers, throws on overflow.
          */
          function add(uint256 a, uint256 b) internal pure returns (uint256) {
            uint256 c = a + b;
            assert(c >= a);
            return c;
          }
        }
      "erc721.sol": |
        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

          function balanceOf(address _owner) public view returns (uint256 _balance);
          function ownerOf(uint256 _tokenId) public view returns (address _owner);
          function transfer(address _to, uint256 _tokenId) public;
          function approve(address _to, uint256 _tokenId) public;
          function takeOwnership(uint256 _tokenId) public;
        }
    answer: |
      pragma solidity ^0.4.19;

      import "./ownable.sol";
      import "./safemath.sol";

      contract ZombieFactory is Ownable {

        using SafeMath for uint256;

        event NewZombie(uint zombieId, string name, uint dna);

        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        uint cooldownTime = 1 days;

        struct Zombie {
          string name;
          uint dna;
          uint32 level;
          uint32 readyTime;
          uint16 winCount;
          uint16 lossCount;
        }

        Zombie[] public zombies;

        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;

        function _createZombie(string _name, uint _dna) internal {
          uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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
---

恭喜你，我们完成了 ERC721 的实现。

并不是很复杂，对吧？很多类似的以太坊概念，当你只听人们谈论它们的时候，会觉得很复杂。所以最简单的理解方式就是你自己来实现它。

不过要记住那只是最简单的实现。还有很多的特性我们也许想加入到我们的实现中来，比如一些额外的检查，来确保用户不会不小心把他们的僵尸转移给`0` 地址（这被称作 “烧币”, 基本上就是把代币转移到一个谁也没有私钥的地址，让这个代币永远也无法恢复）。
或者在 DApp 中加入一些基本的拍卖逻辑。（你能想出一些实现的方法么？）

但是为了让我们的课程不至于离题太远，所以我们只专注于一些基础实现。如果你想学习一些更深层次的实现，可以在这个教程结束后，去看看 OpenZeppelin 的 ERC721 合约。

### 合约安全增强: 溢出和下溢

我们将来学习你在编写智能合约的时候需要注意的一个主要的安全特性：防止溢出和下溢。

什么是 **_溢出_** (**_overflow_**)?

假设我们有一个 `uint8`, 只能存储8 bit数据。这意味着我们能存储的最大数字就是二进制 `11111111` (或者说十进制的 2^8 - 1 = 255).

来看看下面的代码。最后 `number` 将会是什么值？

```
uint8 number = 255;
number++;
```

在这个例子中，我们导致了溢出 — 虽然我们加了1， 但是 `number` 出乎意料地等于 `0`了。  (如果你给二进制 `11111111` 加1, 它将被重置为 `00000000`，就像钟表从 `23:59` 走向 `00:00`)。

下溢(`underflow`)也类似，如果你从一个等于 `0` 的 `uint8` 减去 `1`, 它将变成 `255` (因为 `uint` 是无符号的，其不能等于负数)。

虽然我们在这里不使用 `uint8`，而且每次给一个 `uint256` 加 `1` 也不太可能溢出  (2^256 真的是一个很大的数了)，在我们的合约中添加一些保护机制依然是非常有必要的，以防我们的 DApp 以后出现什么异常情况。

### 使用 SafeMath

为了防止这些情况，OpenZeppelin 建立了一个叫做 SafeMath 的 **_库_**(**_library_**)，默认情况下可以防止这些问题。

不过在我们使用之前…… 什么叫做库?

一个**_库_** 是 Solidity 中一种特殊的合约。其中一个有用的功能是给原始数据类型增加一些方法。

比如，使用 SafeMath 库的时候，我们将使用 `using SafeMath for uint256` 这样的语法。 SafeMath 库有四个方法 — `add`， `sub`， `mul`， 以及 `div`。现在我们可以这样来让 `uint256` 调用这些方法：

```
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```

我们将在下一章来学习这些方法，不过现在我们先将 SafeMath 库添加进我们的合约。

## 实战演习

我们已经帮你把 OpenZeppelin 的 `SafeMath` 库包含进 `safemath.sol`了，如果你想看一下代码的话，现在可以看看，不过我们下一章将深入进去。

首先我们来告诉我们的合约要使用 SafeMath。我们将在我们的 `ZombieFactory` 里调用，这是我们的基础合约 — 这样其他所有继承出去的子合约都可以使用这个库了。

1. 将 `safemath.sol` 引入到 `zombiefactory.sol`.

2. 添加定义： `using SafeMath for uint256;`.
