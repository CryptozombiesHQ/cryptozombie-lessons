---
title: 오버플로우 막기
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";
        // 1. 여기서 import 하게.

        contract ZombieFactory is Ownable {

          // 2. 여기에 using safemath를 선언하게.

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

축하하네, ERC721 구현을 완료했네!

너무 빡빡하진 않았을 것이네. 그렇지? 이런 이더리움에 관한 많은 것들에 대해 사람들이 말하는 걸 듣다 보면 굉장히 복잡하게 느껴지네. 그러니 이를 이해하는 가장 좋은 방법은 실제로 직접 구현해보는 것이네.

이건 그저 가장 간단한 구현 버전이라는 것을 명심하게. 구현에 더 추가할 수 있는 추가적인 기능들이 많이 있네. 예를 들면 사용자들이 의도치 않게 그들의 좀비를 `0`번 주소로 보내는 것(토큰을 "소각한다(burning)"고 하는 것이지 - 기본적으로 누구도 개인키를 가지고 있지 않은 주소로 보내서 복구할 수 없게 하는 것이네)을 막기 위해 추가적인 확인을 할 수 있겠지. 혹은 DApp 자체에 기본적인 경매 로직을 넣는 것도 가능할 것이네(이를 구현하는 방법을 생각해낼 수 있겠나?).

하지만 우리는 이 레슨을 다루기 쉽게 유지하고 싶기 때문에, 가장 기본적인 구현만 진행하였네. 더 깊이 있는 구현의 예시를 보고 싶다면, 이 튜토리얼이 끝난 후 OpenZeppelin ERC721 컨트랙트를 참고해보도록 하게.

### 컨트랙트 보안 강화: 오버플로우와 언더플로우

이제 스마트 컨트랙트를 작성할 때 자네가 인지하고 있어야 할 하나의 주요한 보안 기능을 살펴볼 것이네: 오버플로우와 언더플로우를 막는 것이지.

**_오버플로우_**가 무엇인가?

우리가 8비트 데이터를 저장할 수 있는 `uint8` 하나를 가지고 있다고 해보지. 이 말인즉 우리가 저장할 수 있는 가장 큰 수는 이진수로 `11111111`(또는 십진수로 2^8 - 1 = 255)가 되겠지.

다음 코드를 보게. 마지막에 `number`의 값은 무엇이 되겠나?

```
uint8 number = 255;
number++;
```

이 예시에서, 우리는 이 변수에 오버플로우를 만들었네 - 즉 `number`가 직관과는 다르게 0이 되네. 우리가 증가를 시켰음에도 말이야. 자네가 이진수 `11111111`에 1을 더하면, 이 수는 `00000000`으로 돌아가네. 시계가 `23:59`에서 `00:00`으로 가듯이 말이야.

언더플로우는 이와 유사하게 자네가 `0` 값을 가진 `uint8`에서 `1`을 빼면, `255`와 같아지는 것을 말하네(`uint`에 부호가 없어, 음수가 될 수 없기 때문이지).

우리가 여기서 `uint8`을 사용하지 않고, `uint256`을 `1`씩 증가시킨다고 오버플로우가 발생하지는 않을 것 같지만(2^256은 정말 큰 숫자이네), 미래에 우리의 DApp에 예상치 못한 문제가 발생하지 않도록 여전히 우리의 컨트랙트에 보호 장치를 두는 것이 좋을 것이네.

### SafeMath 사용하기

이를 막기 위해, OpenZeppelin에서 기본적으로 이런 문제를 막아주는 SafeMath라고 하는 **_라이브러리_**를 만들었네.

이것을 살펴보기 전에 먼저... 라이브러리가 무엇인가?

**_라이브러리(Library)_**는 솔리디티에서 특별한 종류의 컨트랙트이네. 이게 유용하게 사용되는 경우 중 하나는 기본(native) 데이터 타입에 함수를 붙일 때이네.

예를 들어, SafeMath 라이브러리를 쓸 때는 `using SafeMath for uint256`이라는 구문을 사용할 것이네.
SafeMath 라이브러리는 4개의 함수를 가지고 있네 - `add`, `sub`, `mul`, 그리고 `div`가 있네. 그리고 이제 우리는 `uint256`에서 다음과 같이 이 함수들에 접근할 수 있네.

```
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```

이 함수들이 어떤 것들인지는 다음 챕터에서 알아볼 것이네. 지금은 우리 컨트랙트에 SafeMath 라이브러리를 추가하도록 하지.

## 직접 해보기

자네를 위해 `safemath.sol`에 OpenZeppelin의 `SafeMath` 라이브러리를 먼저 포함해 놓았네. 자네가 원한다면 그 코드를 슬쩍 먼저 봐도 좋지만, 우리는 다음 챕터에서 이 부분을 더 깊이 있게 볼 것이네.

먼저 우리 컨트랙트가 SafeMath 라이브러리를 쓰도록 만들어보세. 우리는 이를 가장 기초가 되는 컨트랙트인 ZombieFactory에 적용할 것이네 - 이렇게 하면 이를 상속하는 하위 컨트랙트에서 모두 쓸 수 있지.

1. `safemath.sol`을 `zombiefactory.sol`에 임포트하게.

2. `using SafeMath for uint256;` 선언을 추가하게.
