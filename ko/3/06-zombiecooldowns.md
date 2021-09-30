---
title: 좀비 재사용 대기 시간
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

          // 1. `_triggerCooldown` 함수를 여기에 정의하게

          // 2. `_isReady` 함수를 여기에 정의하게

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
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

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(_species) == keccak256("kitty")) {
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

이제 `Zombie` 구조체에 `readyTime` 속성을 가지고 있으니, `zombiefeeding.sol`로 들어가서 재사용 대기 시간 타이머를 구현해보도록 하지.

우린 `feedAndMultiply`를 다음과 같이 수정할 것이네: 

1. 먹이를 먹으면 좀비가 재사용 대기에 들어가고,

2. 좀비는 재사용 대기 시간이 지날 때까지 고양이들을 먹을 수 없네.

이렇게 하면 좀비들이 끊임없이 고양이들을 먹고 온종일 증식하는 것을 막을 수 있지. 나중에 우리가 전투 기능을 추가하면, 다른 좀비들을 공격하는 것도 재사용 대기 시간에 걸리도록 할 것이네.

먼저, 우리가 좀비의 `readyTime`을 설정하고 확인할 수 있도록 해주는 헬퍼 함수를 정의할 것이네.

## 구조체를 인수로 전달하기

자네는 `private` 또는 `internal` 함수에 인수로서 구조체의 storage 포인터를 전달할 수 있네. 이건 예를 들어 함수들 간에 우리의 `Zombie` 구조체를 주고받을 때 유용하네.

문법은 이와 같이 생겼네:

```
function _doStuff(Zombie storage _zombie) internal {
  // _zombie로 할 수 있는 것들을 처리
}
```

이런 방식으로 우리는 함수에 좀비 ID를 전달하고 좀비를 찾는 대신, 우리의 좀비에 대한 참조를 전달할 수 있네.

## 직접 해보기

1. `_triggerCooldown`을 정의하면서 시작하지. 이 함수는 1개의 인수로 `Zombie storage` 포인터 타입인 `_zombie`를 받네. 이 함수는 `internal`이어야 하네.

2. 함수의 내용에서는 `_zombie.readyTime`을 `uint32(now + cooldownTime)`으로 설정해야 하네.

3. 다음으로, `_isReady`라고 불리는 함수를 만들게. 이 함수 역시 `_zombie`라는 이름의 `Zombie storage` 타입 인수를 받네. `internal view`여야 하고, `bool`을 리턴해야 하네.

4. 함수의 내용에서는 `(_zombie.readyTime <= now)`를 리턴해야 하고, 이는 `true` 아니면 `false`로 계산될 것이네. 이 함수는 우리에게 좀비가 먹이를 먹은 후 충분한 시간이 지났는지 알려줄 것이네.
