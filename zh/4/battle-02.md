---
title: 随机数
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // 在这里开始
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

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
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
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiehelper.sol";

      contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
      }

---

你太棒了！接下来我们梳理一下战斗逻辑。

优秀的游戏都需要一些随机元素，那么我们在 Solidity 里如何生成随机数呢？

真正的答案是你不能，或者最起码，你无法安全地做到这一点。

我们来看看为什么

## 用 `keccak256` 来制造随机数。

Solidity 中最好的随机数生成器是 `keccak256` 哈希函数.

我们可以这样来生成一些随机数

```
// 生成一个0到100的随机数:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

这个方法首先拿到 `now` 的时间戳、 `msg.sender`、 以及一个自增数 `nonce` （一个仅会被使用一次的数，这样我们就不会对相同的输入值调用一次以上哈希函数了）。

然后利用 `keccak` 把输入的值转变为一个哈希值, 再将哈希值转换为 `uint`, 然后利用 `% 100` 来取最后两位, 就生成了一个0到100之间随机数了。

### 这个方法很容易被不诚实的节点攻击

在以太坊上, 当你在和一个合约上调用函数的时候, 你会把它广播给一个节点或者在网络上的 **_transaction_** 节点们。 网络上的节点将收集很多事务, 试着成为第一个解决计算密集型数学问题的人，作为“工作证明”，然后将“工作证明”(Proof of Work, PoW)和事务一起作为一个 **_block_** 发布在网络上。

一旦一个节点解决了一个PoW, 其他节点就会停止尝试解决这个 PoW, 并验证其他节点的事务列表是有效的，然后接受这个节点转而尝试解决下一个节点。

**这就让我们的随机数函数变得可利用了**

我们假设我们有一个硬币翻转合约——正面你赢双倍钱，反面你输掉所有的钱。假如它使用上面的方法来决定是正面还是反面 (`random >= 50` 算正面, `random < 50` 算反面)。

如果我正运行一个节点，我可以 **只对我自己的节点** 发布一个事务，且不分享它。 我可以运行硬币翻转方法来偷窥我的输赢 — 如果我输了，我就不把这个事务包含进我要解决的下一个区块中去。我可以一直运行这个方法，直到我赢得了硬币翻转并解决了下一个区块，然后获利。

## 所以我们该如何在以太坊上安全地生成随机数呢

因为区块链的全部内容对所有参与者来说是透明的， 这就让这个问题变得很难，它的解决方法不在本课程讨论范围，你可以阅读 <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>这个 StackOverflow 上的讨论</a> 来获得一些主意。 一个方法是利用 **_oracle_** 来访问以太坊区块链之外的随机数函数。

当然， 因为网络上成千上万的以太坊节点都在竞争解决下一个区块，我能成功解决下一个区块的几率非常之低。 这将花费我们巨大的计算资源来开发这个获利方法 — 但是如果奖励异常地高(比如我可以在硬币翻转函数中赢得 1个亿)， 那就很值得去攻击了。

所以尽管这个方法在以太坊上不安全，在实际中，除非我们的随机函数有一大笔钱在上面，你游戏的用户一般是没有足够的资源去攻击的。

因为在这个教程中，我们只是在编写一个简单的游戏来做演示，也没有真正的钱在里面，所以我们决定接受这个不足之处，使用这个简单的随机数生成函数。但是要谨记它是不安全的。

## 实战演习

我们来实现一个随机数生成函数，好来计算战斗的结果。虽然这个函数一点儿也不安全。

1. 给我们合约一个名为 `randNonce` 的 `uint`，将其值设置为 `0`。

2. 建立一个函数，命名为 `randMod` (random-modulus)。它将作为`internal` 函数，传入一个名为 `_modulus`的 `uint`，并 `returns` 一个 `uint`。

3. 这个函数首先将为 `randNonce`加一， (使用 `randNonce++` 语句)。

4. 最后，它应该 (在一行代码中) 计算 `now`, `msg.sender`, 以及 `randNonce` 的 `keccak256` 哈希值并转换为 `uint`—— 最后 `return` `% _modulus` 的值。 （天! 听起来太拗口了。如果你有点理解不过来，看一下我们上面计算随机数的例子，它们的逻辑非常相似）
