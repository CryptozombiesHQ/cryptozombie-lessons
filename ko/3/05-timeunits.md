---
title: 시간 단위
actions: ['정답 확인하기', '힌트 보기']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. 여기에 `cooldownTime` 정의

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
                // 2. 다음 라인을 업데이트:
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
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
---

`level`은 따로 설명이 필요 없지. 나중에 배틀 시스템이 구현되면 더 많은 배틀에서 승리한 좀비가 레벨 업을 해서 더 많은 능력을 가질 수 있을 거네.

`readyTime`은 좀더 설명할 필요가 있지. 이 변수를 이용해서 "쿨다운 시간"를 추가하고자 하는데, 쿨다운 시간는 좀비가 먹이를 먹거나 공격한 후 다시 그 행위를 할 수 있기 전에 대기해야 하는 시간을 의미하지. 이런 개념이 없으면 좀비는 하루에 1,000번을 공격하고 번식할 수 있는데, 일면 게임이 너무 쉬워지지. 

좀비가 다시 먹이를 먹거나 공격할 수 있을 때가지 기다려야 하는 시간을 파악하기 위해 솔리디티가 제공하는 시간 단위를 이용할 수 있네. 

## 시간 단위

솔리디티는 시간을 처리하는 데 쓰이는 고유의 시간 단위를 제공하지.

`now`라는 변수는 현재 유닉스 타임스탬프(1970년 1월 1일 이후 경과한 시간을 초로 표시한 것)를 반환할 걸세. 내가 이 코스를 집필할 때의 유닉스 시간이 `1515527488`이네.

> 참고: 유닉스 타임은 전통적으로 32비트 숫자로 저장되지. 이로 인해 "2038년" 문제, 즉 32비트 타임스탬프에 오버플로우가 발생해서 많은 구형 컴퓨터 시스템이 고장나는 문제가 발생할 걸세. 그러니 지금부터 향후 20년 동안 우리 댑을 유지하려면 64비트 숫자를 쓸 수도 있겠지만, 그렇게 되면 유저들이 우리 댑을 쓸 때 더 많은 가스를 소비하게 되겠지. 설계 결정을 잘 내려야 하네!

솔리디티에는 `seconds`, `minutes`, `hours`, `days`, `weeks`, `years`이라는 시간 단위도 있지. 이 단위들은 각 시간의 길이를 초(`uint`)로 변환하지. 그러니 `1 분`은 `60`, `1시간`은 `3600` (60초 x 60분), `1일`은 `86400` (24시간 x 60초 x 60분) 등이 되지. 

이러한 시간 단위들이 어떻게 활용될 수 있는지 다음 예시를 통해 살펴 보게:

```
uint lastUpdated;

// `lastUpdated`를 `now`로 설정한다
function updateTimestamp() public {
  lastUpdated = now;
}

// `updateTimestamp`가 호출된 이후 5분이 경과하면 `true`을 반환하고,
// 5분이 경과하지 않았으면 `false`를 반환한다 
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

이러한 시간 단위들을 좀비 `cooldown` 특성을 구현하는 데 이용할 수 있겠네. 


## 직접 해보기 

우리 댑에 쿨다운 시간을 추가해 보세. 좀비가 공격하거나 먹이를 먹은 후 다시 공격하려면 **하루**를 기다리도록 해 보세. 

1. Declare a `uint` called `cooldownTime`라는 `uint`형 변수를 선언하고, `1 days`로 설정한다. (문법이 틀렸지만, "1 day"로 설정하면 컴파일되지 않는다)

2. 이전 챕터에서 `level`과 `readyTime`을 `Zombie` 구조체에 추가한 바 있다. 따라서 `_createZombie()`를 업데이트하여 새로운 `Zombie` 구조체 생성 시 전달되는 인자 수가 올바르도록 한다. 

  `zombies.push`코드를 업데이트하여 2개의 인자를 추가한다: `level`에 대해서는 `1`을, `readyTime`에 대해서는 `uint32(now + cooldownTime)`을 입력한다.

> 참고: `uint32(...)`코드가 필요하네. 왜냐면 기본적으로 `now`가 `uint256`를 반환하기 때문이지. 그러니 명시적으로 `uint32`로 변환할 필요가 있지. 

`now + cooldownTime`은 (초로 환산한) 현재 유닉스 타임스탬프에 하루를 초로 환산한 값을 더한 값이지. 즉, 1일이 지난 현재 유닉스 타임스탬프 값과 같지. 나중에 좀비의 `readyTime`이 `now`보다 큰지 비교해서 해당 좀비를 다시 쓸 수 있는 시간이 경과했는지 판단할 수 있네.  

다음 챕터에서는 `readyTime`에 기초해서 좀비의 행위를 제한하는 기능을 구현할 걸세.
