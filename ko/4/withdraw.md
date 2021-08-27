---
title: 출금
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 1. 여기에 withdraw 함수를 생성하게

          // 2. 여기에 setLevelUpFee를 생성하게

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
---

이전 챕터에서, 우린 컨트랙트에 이더를 보내는 방법을 배웠네. 그럼 이더를 보낸 다음에는 어떤 일이 일어날까?

자네가 컨트랙트로 이더를 보내면, 해당 컨트랙트의 이더리움 계좌에 이더가 저장되고 거기에 갇히게 되지 - 자네가 컨트랙트로부터 이더를 인출하는 함수를 만들지 않는다면 말이야.

자네는 다음과 같이 컨트랙트에서 이더를 인출하는 함수를 작성할 수 있네:

```
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    owner.transfer(this.balance);
  }
}
```

우리가 `Ownable` 컨트랙트를 import 했다고 가정하고 `owner`와 `onlyOwner`를 사용하고 있다는 것을 참고하게.

자네는 `transfer` 함수를 사용해서 이더를 특정 주소로 전달할 수 있네. 그리고 `this.balance`는 컨트랙트에 저장돼있는 전체 잔액을 반환하지. 그러니 100명의 사용자가 우리의 컨트랙트에 1이더를 지불했다면, `this.balance`는 100이더가 될 것이네.

자네는 `transfer` 함수를 써서 특정한 이더리움 주소에 돈을 보낼 수 있네. 예를 들어, 만약 누군가 한 아이템에 대해 초과 지불을 했다면, 이더를 `msg.sender`로 되돌려주는 함수를 만들 수도 있네:

```
uint itemFee = 0.001 ether;
msg.sender.transfer(msg.value - itemFee);
```

혹은 구매자와 판매자가 존재하는 컨트랙트에서, 판매자의 주소를 storage에 저장하고, 누군가 판매자의 아이템을 구매하면 구매자로부터 받은 요금을 그에게 전달할 수도 있겠지: `seller.transfer(msg.value)`.

이런 것들이 이더리움 프로그래밍을 아주 멋지게 만들어주는 예시들이네 - 자네는 이것처럼 누구에게도 제어되지 않는 분산 장터들을 만들 수도 있네.

## 직접 해보기

1. 우리 컨트랙트에 `withdraw` 함수를 생성하게. 이 함수는 위에서 본 `GetPaid` 예제와 동일해야 하네.

2. 이더의 가격은 과거에 비해 10배 이상 뛰었네. 그러니 지금 이 글을 쓰는 시점에서는 0.001이더가 1달러 정도 되지만, 만약 이게 다시 10배가 되면 0.001 ETH는 10달러가 될 것이고 우리의 게임은 더 비싸질 것이네.

  그러니 컨트랙트의 소유자로서 우리가 `levelUpFee`를 설정할 수 있도록 하는 함수를 만드는 것이 좋겠지.
  
  a. `setLevelUpFee`라는 이름의, `uint _fee`를 하나의 인자로 받고 `external`이며 `onlyOwner` 제어자를 사용하는 함수를 생성하게.
  
  b. 이 함수는 `levelUpFee`를 `_fee`로 설정해야 하네.
