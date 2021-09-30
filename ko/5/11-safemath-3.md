---
title: SafeMath 파트 3
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
          // 1. using SafeMath32 for uint32를 선언하게.
          // 2. using SafeMath16 for uint16를 선언하게.

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
            // 참고: 우리는 Year 2038 문제를 막지 않기로 하겠네... 그러니 readyTime에서 오버플로우를 걱정할 필요는 없네.
            // 우리 앱은 2038년에는 좀 꼬이겠지 ;)
            uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
            zombieToOwner[id] = msg.sender;
            // 3. 여기에 SafeMath의 `add`를 사용하게:
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

        contract ZombieAttack is ZombieHelper {
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
          * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
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

훌륭하군, 이제 우리의 ERC721 구현은 오버플로우 & 언더플로우에서 안전하네!

이전 레슨에서 우리가 작성한 코드로 돌아가 보면, 우리 코드에 오버플로우나 언더플로우가 발생할 수 있는 지점이 몇 개 더 있네.

예를 들어, ZombieAttack에서:

```
myZombie.winCount++;
myZombie.level++;
enemyZombie.lossCount++;
```

여기서도 안전을 위해 오버플로우를 막아야 할 것이네(일반적으로 기본 수학 연산보다 SafeMath를 쓰는 것이 좋네. 향후의 솔리디티 버전에서는 이게 기본으로 포함될 수도 있겠지만, 지금은 우리 코드에 추가적인 보안 조치를 해야 하네).

하지만 여기에 작은 문제가 있네 - `winCount`와 `lossCount`는 `uint16`이고, `level`은 `uint32`인 것이지. 즉 우리가 이런 인수들을 써서 SafeMath의 `add` 메소드를 사용하면, 이 타입들을 `uint256`으로 바꿀 것이기 때문에 실제로 오버플로우를 막아주지 못하네.

```
function add(uint256 a, uint256 b) internal pure returns (uint256) {
  uint256 c = a + b;
  assert(c >= a);
  return c;
}

// 만약 `uint8`에 `.add`를 호출한다면, 타입이 `uint256`로 변환되네.
// 그러니 2^8에서 오버플로우가 발생하지 않을 것이네. 256은 `uint256`에서 유효한 숫자이기 때문이지.
```

이는 즉 `uint16`과 `uint32`에서 오버플로우/언더플로우를 막기 위해 2개의 라이브러리를 더 만들어야 한다는 것을 의미하네. 우리는 이들을 `SafeMath16`과 `SafeMath32`라고 부를 것이네.

코드는 모든 `uint256`들이 `uint32` 또는 `uint16`으로 바뀐다는 것 말고는 SafeMath와 정확히 같을 것이네. 

내가 자네를 위해 먼저 그 코드를 구현해 놓았네 - `safemath.sol`로 가서 구현한 코드를 확인해보게.

이제 우리는 ZombieFactory에 이를 사용하여 구현해야 할 것이네.

## 직접 해보기

과제:

1. 우리가 `SafeMath32`를 `uint32`에 쓴다는 것을 선언하게.

2. 우리가 `SafeMath16`을 `uint16`에 쓴다는 것을 선언하게.

3. ZombieFactory에 SafeMath 메소드를 사용해야 할 곳이 한 줄 더 있네. 어딘지 가리키는 주석을 남겨놓았네.
