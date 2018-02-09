---
title: For 반복문
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

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
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
            // 여기서 시작
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

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
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

이전 챕터에서, 가끔씩 `for` 반복문을 활용하여 함수 내에 컨텐츠를 가진 배열을 만들 수 있다고 언급했네. 물론 그 배열을 저장소에 저장하지는 않고 말이네. 

왜 그런지 살펴 보겠네.

`getZombiesByOwner` 함수에서 순진한 구현 방법은 `ZombieFactory` 컨트랙트에 소유자와 좀비 군대의 `mapping`을 저장하는 것이지. 

```
mapping (address =>uint[]) public ownerToZombies
```

그러면 새로운 좀비를 생성할 때마다 `ownerToZombies[owner].push(zombieId)`을 이용하여 좀비를 소유자의 좀비 배열에 추가하면 되겠지. 따라서 `getZombiesByOwner`는 매우 간단한 함수가 되지:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### 이 접근의 문제점

이러한 접근은 단순하기 때문에 매력적이지. 하지만 좀비를 다른 소유자에게 넘기는 함수 (이후 레슨에서 꼭 추가할 함수네!)를 추가할 경우 어떤 일이 발생하는지 살펴 보도록 하세.

좀비 소유권 전환 함수는 다음 기능을 필요로 할 걸세:
1. 좀비를 새로운 소유자의 `ownerToZombies` 배열에 추가한다. 
2. 이전 소유자의 `ownerToZombies` 배열에서 좀비를 제거한다. 
3. 이전 소유자의 배열에 있는 모든 좀비를 한 자리씩 옮겨서 구멍을 매운다.
4. 배열 길이를 1만큼 줄인다.

3번째 단계는 가스 측면에서 극도로 비싸지. 왜냐면 위치가 바뀐 모든 좀비에 대해서 쓰기 작업을 해야 하기 때문이지. 20마리의 좀비를 가진 유저가 좀비 한 마리를 판매한 경우, 배열의 순서를 유지하려면 19번의 쓰기를 실행해야 할 거네. 

저장소에 쓰는 작업이 솔리디티에서 가장 비싼 작업 중의 하나이기 때문에, 소유권 전환 함수를 호출하는 건 가스 측면에서 극도로 비싸지. 설상가상으로 유저가 소유한 좀비 수, 판매된 좀비의 인덱스 값에 따라 가스 값이 달라지게 되니 유저는 가스를 얼마나 보내야 하는지 알 수가 없게 되지. 

> 참고: 물론, 배열에서 마지막에 위치한 좀비로 구멍을 매우고 배열 길이를 1만큼 줄일 수 있지. 하지만 그렇게 하면 좀비를 트레이드할 때마다 좀비 군대의 순서가 바뀌게 되지.

`view` 함수가 외부에서 호출되면 가스를 소모하지 않기 때문에 단순히 `getZombiesByOwner` 내에 for 반복문으로 전체 좀비 배열을 검색하고 유저가 소유한 좀비의 배열을 만들어 낼 수 있네. 그 다음에 이용하는 `transfer` 함수는 훨씬 저렴하지. 왜냐면 보관소의 배열 순서를 바꿀 필요가 없기 때문이지. 직관과는 다르게 이 접근법은 전반적으로 더 저렴하네.

## `for` 반복문 이용하기

솔리디티의 `for` 반복문은 자바스크립트와 유사하지.

짝수 배열을 만드는 예시를 살펴 보도록 하겠네:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // 새 배열의 인덱스를 추적한다:
  uint counter = 0;
  // for 반복문으로 1부터 10까지 반복한다:
  for (uint i = 1; i <= 10; i++) {
    // `i`가 짝수이면...
    if (i % 2 == 0) {
      // 짝수를 배열에 추가한다
      evens[counter] = i;
      // `evens` 배열의 다음 빈 인덱스로 카운터를 증가시킨다:
      counter++;
    }
  }
  return evens;
}
```

이 함수는 `[2, 4, 6, 8, 10]`을 가진 배열을 반환할 것이네.

## 직접 해보기

`for` 반복문을 이용하여 `getZombiesByOwner` 함수를 마무리해 보세. `for` 반복문은 다음 기능을 수행할 걸세: 
1. 우리 댑의 모든 좀비를 모두 검색한다
2. 검색 시 좀비 소유자를 비교해서 매치가 있는지 확인한다.
3. 매치가 있으면 `result` 배열을 반환하기 전에 추가한다. 

1. `uint`형 `counter`를 선언하고 `0`으로 설정한다. 이 변수로 `result` 배열의 인덱스를 추적할 것이네.

2. `uint i = 0`에서 시작하여 `i < zombies.length`를 만족할 때까지 실행되는 `for` 반복문을 선언한다. 이 반복문은 배열에 있는 모든 좀비를 검색할 것이다. 

3. `for` 반복문에 `if`문을 생성하여 `zombieToOwner[i]`이 `_owner`과 같은지 확인한다. 여기서 두 주소를 비교하여 매치가 있는지 확인한다.

4. `if` 문 내에 다음을 작성한다:
   1. `result[counter]`를 `i`로 설정하여 좀비 ID를 `result` 배열에 추가한다. 
   2. `counter`를 1만큼 증가시킨다. (위의 `for` 반복문을 참고할 것).

이게 전부네. 이 함수는 가스를 소비하지 않고 `_owner`가 소유한 모든 좀비들을 반환할 것이네. 
