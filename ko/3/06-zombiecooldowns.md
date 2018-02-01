---
title: 좀비 쿨다운 
actions: ['정답 확인하기', '힌트 보기']
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

          // 1. 여기에 `_triggerCooldown` 함수 정의

          // 2. 여기에 `_isReady` 함수 정의

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
         * @dev Ownable 컨트랙트는 소유자 주소를 가지며, 기본적인 권한 통제 기능을 제공한다. 
         *      이로써 "유저 접근 제어"의 구현을 단순화한다. 
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev Ownable 컨트랙트는 컨트랙트의 원'소유자'를 sender 계정으로 설정한다.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev 소유자가 아닌 계정에 의해 호출되는 경우, 실행을 중단한다. 
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev 현 소유자가 컨트랙트 통제권을 새 소유자에게 넘겨 주도록 한다. 
           * @param newOwner 소유권을 넘겨 받는 주소.
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

`Zombie` 구조체에 `readyTime` 변수가 있으니 `zombiefeeding.sol`로 가서 쿨다운 타이머를 구현해 보세.

`feedAndMultiply`를 변경하여 다음과 같은 기능을 갖도록 해 보세:

1. 먹이를 먹으면 좀비 쿨다운이 실행된다.

2. 쿨다운 시간이 지날 때까지 좀비가 고양이를 먹을 수 없게 된다.

이 기능을 통해 좀비가 무제한으로 고양이를 먹고 하루 종일 번식하는 게 불가능하게 되지. 이후에 배틀 기능이 추가되면 다른 좀비를 공격하는 것도 쿨다운 적용을 받도록 할 걸세.

먼저, 좀비의 `readyTime`을 설정하고 확인하는 도우미 함수를 정의할 것이네. 

## 구조체를 인자로 전달하기 

구조체 포인터를 인자 값으로 `private`이나 `internal` 함수에 전달할 수 있지. 이는 `Zombie` 구조체를 함수끼리 전달하는 경우에 유용하지.

구문은 다음과 같지:

```
function _doStuff(Zombie storage _zombie) internal {
  // _zombie를 활용하여 무언가를 한다
}
```

좀비 ID를 전달해서 검색하는 대신, 이렇게 좀비 구조체에 대한 참조값을 함수에 전달할 수 있지. 

## 직접 해보기 

1. `_triggerCooldown` 함수를 정의한다. 이 함수는 `_zombie`라는 `Zombie storage` 포인터를 인자로 전달받으며, `internal`로 선언되어야 한다.

2. 함수는 `_zombie.readyTime`을 `uint32(now + cooldownTime)`로 설정해야 한다.

3. 다음으로 `_isReady`라는 함수를 생성한다. 이 함수도 `_zombie`라는 `Zombie storage` 포인터를 인자로 전달받으며, `internal view`로 선언된다. 반환값 자료형은 `bool`이다. 

4. 이 함수는 `(_zombie.readyTime <= now)`을 반환해야 하는데, 이 값은 `true`나 `false`가 된다. 이 함수는 좀비가 먹이를 먹은 시간 이후 충분한 시간이 경과했는지 우리에게 알려주는 기능을 한다. 
