---
title: 시간 단위
actions: ['checkAnswer', 'hints']
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
            // 1. `cooldownTime`을 여기에 정의하게

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
                // 2. 아래 줄을 업데이트하게:
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
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
---

`level` 속성은 뭔지 말 안 해도 알겠지? 나중에 우리가 전투 시스템을 만들게 되면, 전투에서 더 많이 이긴 좀비는 시간이 지나며 레벨업을 하게 될 것이고 더 많은 기능이 생길 것이네.

`readyTime` 속성은 조금 설명이 필요할 듯하군. 이것의 목표는 좀비가 먹이를 먹거나 공격을 하고 나서 다시 먹거나 공격할 수 있을 때까지 기다려야 하는 "재사용 대기 시간"을 추가하는 것이네. 이 속성 없이는, 좀비는 하루에 천 번 이상 공격하거나 증식할 수 있지. 이러면 게임이 너무 쉬워져 버릴 것이네.

좀비가 다시 공격할 때까지 기다려야 하는 시간을 측정하기 위해, 우리는 솔리디티의 시간 단위(Time units)를 사용할 것이네.


## 시간 단위(Time units)

솔리디티는 시간을 다룰 수 있는 단위계를 기본적으로 제공하네.

`now` 변수를 쓰면 현재의 유닉스 타임스탬프(1970년 1월 1일부터 지금까지의 초 단위 합) 값을 얻을 수 있네. 내가 이 글을 쓸 때 유닉스 타임의 값은 `1515527488`이군.

>참고: 유닉스 타임은 전통적으로 32비트 숫자로 저장되네. 이는 유닉스 타임스탬프 값이 32비트로 표시가 되지 않을 만큼 커졌을 때 많은 구형 시스템에 문제가 발생할 "Year 2038" 문제를 일으킬 것이네. 그러니 만약 우리 DApp이 지금부터 20년 이상 운영되길 원한다면, 우리는 64비트 숫자를 써야 할 것이네. 하지만 우리 유저들은 그동안 더 많은 가스를 소모해야 하겠지. 설계를 보고 결정을 해야 하네!

솔리디티는 또한 `seconds`, `minutes`, `hours`, `days`, `weeks`, `years` 같은 시간 단위 또한 포함하고 있다네. 이들은 그에 해당하는 길이 만큼의 초 단위 `uint` 숫자로 변환되네. 즉 `1 minutes`는 `60`, `1 hours`는 `3600`(60초 x 60 분), `1 days`는 `86400`(24시간 x 60분 x 60초) 같이 변환되네.

이 시간 단위들이 유용하게 사용될 수 있는 예시는 다음과 같네:

```
uint lastUpdated;

// `lastUpdated`를 `now`로 설정
function updateTimestamp() public {
  lastUpdated = now;
}

// 마지막으로 `updateTimestamp`가 호출된 뒤 5분이 지났으면 `true`를, 5분이 아직 지나지 않았으면 `false`를 반환
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

우리는 이런 시간 단위들은 좀비의 `cooldown` 기능을 추가할 때 사용할 것이네.

## 직접 해보기

우리 DApp에 재사용 대기 시간을 추가하고, 좀비들이 공격하거나 먹이를 먹은 후 **1일**이 지나야만 다시 공격할 수 있도록 할 것이네.

1. `cooldownTime`이라는 `uint` 변수를 선언하고, 여기에 `1 days`를 대입하게.(문법적으로 이상하게 보여도 넘어가게. 자네가 "1 day"를 대입한다면, 컴파일이 되지 않을 것일세!)

2. 우리가 이전 챕터에서 우리의 `Zombie` 구조체에 `level`과 `readyTime`을 추가했으니, 우린 `Zombie` 구조체를 생성할 때 함수의 인수 개수가 정확히 맞도록 `_createZombie()` 함수를 업데이트해야 하네.

  코드의 `zombies.push` 줄에 2개의 인수를 더 사용하도록 업데이트하게: `1`(`level`에 사용), `uint32(now + cooldownTime)`(`readyTime`에 사용).

>참고: `now`가 기본적으로 `uint256`을 반환하기 때문에, `uint32(...)` 부분이 필수적이네. 이렇게 함으로써 해당 데이터를 `uint32`로 명시적으로 변환하는 것이지.

`now + cooldownTime`은 현재 유닉스 타임스탬프(초 단위)에 1일을 초 단위로 바꾼 것의 합과 같을 것이네. 바꿔 말해 지금부터 하루 뒤의 유닉스 타임스탬프 값과 같은 것이지. 이후에 우리는 좀비를 다시 사용하기 위해 충분한 시간이 지났는지 확인할 수 있도록 좀비의 `readyTime`이 `now`보다 큰지 비교할 것이네.

다음 챕터에서는 `readyTime`에 기반하여 행동을 제한하도록 하는 기능들을 구현할 것이네.
