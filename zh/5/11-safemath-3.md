---
title: SafeMath 第三部分
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";
        import "./safemath.sol";

        contract ZombieFactory is Ownable {

          using SafeMath for uint256;
          // 1. 为 uint32 声明 使用 SafeMath32
          // 2. 为 uint16 声明 使用 SafeMath16

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
            // 注意: 我们选择不处理2038年问题，所以不用担心 readyTime 的溢出
            // 反正在2038年我们的APP早完蛋了
            uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
            zombieToOwner[id] = msg.sender;
            // 3. 在这里使用 SafeMath 的 `add` 方法:
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

        /**
         * @title SafeMath32
         * @dev SafeMath library implemented for uint32
         */
        library SafeMath32 {

          function mul(uint32 a, uint32 b) internal pure returns (uint32) {
            if (a == 0) {
              return 0;
            }
            uint32 c = a * b;
            assert(c / a == b);
            return c;
          }

          function div(uint32 a, uint32 b) internal pure returns (uint32) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint32 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          function sub(uint32 a, uint32 b) internal pure returns (uint32) {
            assert(b <= a);
            return a - b;
          }

          function add(uint32 a, uint32 b) internal pure returns (uint32) {
            uint32 c = a + b;
            assert(c >= a);
            return c;
          }
        }

        /**
         * @title SafeMath16
         * @dev SafeMath library implemented for uint16
         */
        library SafeMath16 {

          function mul(uint16 a, uint16 b) internal pure returns (uint16) {
            if (a == 0) {
              return 0;
            }
            uint16 c = a * b;
            assert(c / a == b);
            return c;
          }

          function div(uint16 a, uint16 b) internal pure returns (uint16) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint16 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          function sub(uint16 a, uint16 b) internal pure returns (uint16) {
            assert(b <= a);
            return a - b;
          }

          function add(uint16 a, uint16 b) internal pure returns (uint16) {
            uint16 c = a + b;
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
        using SafeMath32 for uint32;
        using SafeMath16 for uint16;

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
          ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
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

太好了，这下我们的 ERC721 实现不会有溢出或者下溢了。

回头看看我们在之前课程写的代码，还有其他几个地方也有可能导致溢出或下溢。

比如， 在 ZombieAttack 里面我们有：

```
myZombie.winCount++;
myZombie.level++;
enemyZombie.lossCount++;
```

我们同样应该在这些地方防止溢出。（通常情况下，总是使用 SafeMath 而不是普通数学运算是个好主意，也许在以后 Solidity 的新版本里这点会被默认实现，但是现在我们得自己在代码里实现这些额外的安全措施）。

不过我们遇到个小问题 — `winCount` 和 `lossCount` 是 `uint16`， 而 `level` 是 `uint32`。 所以如果我们用这些作为参数传入 SafeMath 的 `add` 方法。 它实际上并不会防止溢出，因为它会把这些变量都转换成 `uint256`:

```
function add(uint256 a, uint256 b) internal pure returns (uint256) {
  uint256 c = a + b;
  assert(c >= a);
  return c;
}

// 如果我们在`uint8` 上调用 `.add`。它将会被转换成 `uint256`.
// 所以它不会在 2^8 时溢出，因为 256 是一个有效的 `uint256`.
```

这就意味着，我们需要再实现两个库来防止 `uint16` 和 `uint32` 溢出或下溢。我们可以将其命名为 `SafeMath16` 和 `SafeMath32`。

代码将和 SafeMath 完全相同，除了所有的 `uint256` 实例都将被替换成 `uint32` 或 `uint16`。

我们已经将这些代码帮你写好了，打开 `safemath.sol` 合约看看代码吧。

现在我们需要在 ZombieFactory 里使用它们。

## Putting it to the Test

分配：

1. 声明我们将为 `uint32` 使用`SafeMath32`。

2. 声明我们将为 `uint16` 使用`SafeMath16`。

3. 在 ZombieFactory 里还有一处我们也应该使用 SafeMath 的方法， 我们已经在那里留了注释提醒你。
