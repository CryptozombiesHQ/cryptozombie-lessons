---
title: 함수 접근 제어자 더 알아보기 
actions: ['정답 확인하기', '힌트 보기']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          // 여기서 시작

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

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

      }
---

대단해! 우리 좀비들이 쿨다운 타이머를 갖게 되었군. 

다음으로, 추가적인 도우미 메소드 몇 가지를 추가할 걸세. 자네를 위해 `zombiehelper.sol`라는 파일을 생성하고 거기에 `zombiefeeding.sol` 파일을 `import`했네. 이렇게 하면 우리 코드가 정리가 잘 될 걸세. 

좀비가 특정 레벨에 다다르면 특별한 능력을 획득하도록 만들어 보세. 하지만 그렇게 하려면, 먼저는 함수 접근 제어자에 대해서 좀더 배워야 하네. 

## 인자값이 있는 함수 접근 제어자

이전에 간단한 `onlyOwner` 예시를 살펴보았네. 하지만 함수 접근 제어자도 인자값을 전달받을 수 있지. 이를테면: 

```
// 유저의 나이를 저장하기 위한 매핑:
mapping (uint => uint) public age;

// 유저가 특정 나이 이상인지 확인하는 접근 제어자:
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

// 운전하려면 나이가 16세 이상이어야 한다 (적어도 미국에서는).
// 다음과 같이 인자값을 가진 `olderThan` 접근 제어자를 호출할 수 있다:
function driveCar(uint _userId) public olderThan(16, _userId) {
  // 함수 로직
}
```

`olderThan` 접근 제어자가 함수처럼 인자값을 가지며, `driverCar` 함수가 인자를 접근 제어자로 달한다는 것을 알 수 있다.

특수 능력에 대한 접근을 제한하기 위해 좀비 `level`을 이용하는 `modifier`를 만들어 보세.

## 직접 해보기

1. `ZombieHelper` 파일에 `aboveLevel`이라는 `modifier`를 생성하고, `uint`형인 `_level`과 `_zombieId`를 인자값으로 전달받도록 한다.

2. 함수는 `zombies[_zombieId].level`이 `_level` 이상인지 확인해야 한다.

3. 접근 제어자의 마지막 라인에서 `_;`를 이용하여 함수의 나머지 부분을 호출해야 함을 기억할 것. 
