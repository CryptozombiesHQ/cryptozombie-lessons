---
title: 注释
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieownership.sol": |
        pragma solidity ^0.4.19;

        import "./zombieattack.sol";
        import "./erc721.sol";
        import "./safemath.sol";

        /// TODO: 把这里变成 natspec 标准的注释把
        contract ZombieOwnership is ZombieAttack, ERC721 {

          using SafeMath for uint256;

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) public view returns (uint256 _balance) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) public view returns (address _owner) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
            ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
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
      "zombiefactory.sol": |
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
        pragma solidity ^0.4.19;
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

      import "./zombieattack.sol";
      import "./erc721.sol";
      import "./safemath.sol";

      contract ZombieOwnership is ZombieAttack, ERC721 {

        using SafeMath for uint256;

        mapping (uint => address) zombieApprovals;

        function balanceOf(address _owner) public view returns (uint256 _balance) {
          return ownerZombieCount[_owner];
        }

        function ownerOf(uint256 _tokenId) public view returns (address _owner) {
          return zombieToOwner[_tokenId];
        }

        function _transfer(address _from, address _to, uint256 _tokenId) private {
          ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
          ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
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
---

僵尸游戏的 Solidity 代码终于完成啦。

在以后的课程中，我们将学习如何将游戏部署到以太坊，以及如何和 Web3.js 交互。

不过在你离开第五课之前，我们来谈谈如何 **给你的代码添加注释**.

## 注释语法

Solidity 里的注释和 JavaScript 相同。在我们的课程中你已经看到了不少单行注释了：

```
// 这是一个单行注释，可以理解为给自己或者别人看的笔记
```

只要在任何地方添加一个 `//` 就意味着你在注释。如此简单所以你应该经常这么做。

不过我们也知道你的想法：有时候单行注释是不够的。毕竟你生来话痨。

所以我们有了多行注释：

```
contract CryptoZombies { 
  /* 这是一个多行注释。我想对所有花时间来尝试这个编程课程的人说声谢谢。
  它是免费的，并将永远免费。但是我们依然倾注了我们的心血来让它变得更好。

   要知道这依然只是区块链开发的开始而已，虽然我们已经走了很远，
   仍然有很多种方式来让我们的社区变得更好。
   如果我们在哪个地方出了错，欢迎在我们的 github 提交 PR 或者 issue 来帮助我们改进：
    https://github.com/loomnetwork/cryptozombie-lessons

    或者，如果你有任何的想法、建议甚至仅仅想和我们打声招呼，欢迎来我们的Discord：
     https://discord.gg/GbwwAqv7Ue
  */
}
```

特别是，最好为你合约中每个方法添加注释来解释它的预期行为。这样其他开发者（或者你自己，在6个月以后再回到这个项目中）可以很快地理解你的代码而不需要逐行阅读所有代码。

Solidity 社区所使用的一个标准是使用一种被称作 **_natspec_** 的格式，看起来像这样：

```
/// @title 一个简单的基础运算合约
/// @author H4XF13LD MORRIS 💯💯😎💯💯
/// @notice 现在，这个合约只添加一个乘法
contract Math {
  /// @notice 两个数相乘
  /// @param x 第一个 uint
  /// @param y  第二个 uint
  /// @return z  (x * y) 的结果
  /// @dev 现在这个方法不检查溢出
  function multiply(uint x, uint y) returns (uint z) {
    // 这只是个普通的注释，不会被 natspec 解释
    z = x * y;
  }
}
```

`@title`（标题） 和 `@author` （作者）很直接了.

`@notice` （须知）向 **用户** 解释这个方法或者合约是做什么的。 `@dev` （开发者） 是向开发者解释更多的细节。

`@param` （参数）和 `@return` （返回） 用来描述这个方法需要传入什么参数以及返回什么值。

注意你并不需要每次都用上所有的标签，它们都是可选的。不过最少，写下一个 `@dev` 注释来解释每个方法是做什么的。

## 实战演习

如果你还没注意到：CryptoZombies 的答案检查器在工作的时候将忽略所有的注释。所以这一章我们其实无法检查你的 natspec 注释了。全靠你自己咯。

话说回来，到现在你应该已经是一个 Solidity 小能手了。我们就假定你已经学会这些了。

大胆去做些尝试把，给 `ZombieOwnership` 加上一些 natspec 标签:

1. `@title` — 例如：一个管理转移僵尸所有权的合约

2. `@author` — 你的名字

3. `@dev` — 例如：符合 OpenZeppelin 对 ERC721 标准草案的实现
