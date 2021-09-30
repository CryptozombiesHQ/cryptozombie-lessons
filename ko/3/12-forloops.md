---
title: For 반복문
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
            // 여기서 시작하게
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

이전 챕터에서, 때때로 자네가 함수 내에서 배열을 다룰 때, 그냥 storage에 해당 배열을 저장하는 것이 아니라 `for` 반복문을 사용해서 구성해야 할 때가 있을 것이라 했었네.

왜 그런지 살펴보세.

`getZombiesByOwner`를 구현할 때, 기초적인 구현 방법은 `ZombieFactory` 컨트랙트에서 소유자의 좀비 군대에 대한 `mapping`을 만들어 저장하는 것일 걸세.

```
mapping (address => uint[]) public ownerToZombies
```

그리고나서 새로운 좀비를 만들 때마다, 해당 소유자의 좀비 배열에 `ownerToZombies[owner].push(zombieId)`를 사용해서 새 좀비를 추가하겠지. `getZombiesByOwner` 함수는 굉장히 이해하기 쉬운 함수가 될 게야:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### 이 방식의 문제

이러한 접근 방법은 구현의 간단함 때문에 매력적으로 보이지. 하지만 만약 나중에 한 좀비를 원래 소유자에서 다른 사람에게 전달하는 함수를 구현하게 된다면 어떤 일이 일어날지 생각해보세(이후의 레슨에서 우린 분명 이 기능을 원하게 될 것일세).

좀비 전달 함수는 이런 내용이 필요할 것이네:
1. 전달할 좀비를 새로운 소유자의 `ownerToZombies` 배열에 넣는다.
2. 기존 소유자의 `ownerToZombies` 배열에서 해당 좀비를 지운다.
3. 좀비가 지워진 구멍을 메우기 위해 기존 소유자의 배열에서 모든 좀비를 한 칸씩 움직인다.
4. 배열의 길이를 1 줄인다.

3번째 단계는 극단적으로 가스 소모가 많을 것이네. 왜냐하면 위치를 바꾼 모든 좀비에 대해 쓰기 연산을 해야 하기 때문이지. 소유자가 20마리의 좀비를 가지고 있고 첫 번째 좀비를 거래한다면, 배열의 순서를 유지하기 위해 우린 19번의 쓰기를 해야 할 것이네.

솔리디티에서 storage에 쓰는 것은 가장 비용이 높은 연산 중 하나이기 때문에, 이 전달 함수에 대한 모든 호출은 가스 측면에서 굉장히 비싸게 될 것이네. 더 안 좋은 점은, 이 함수가 실행될 때마다 다른 양의 가스를 소모할 것이라는 점이네. 사용자가 자신의 군대에 얼마나 많은 좀비를 가지고 있는지, 또 거래되는 좀비의 인덱스에 따라 달라지겠지. 즉 사용자들은 거래에 가스를 얼마나 쓰게 될지 알 수 없게 되네.

참고: 물론, 빈 자리를 채우기 위해 마지막 좀비를 움직인 다음, 배열의 길이를 하나 줄여도 되겠지. 하지만 그렇게 하면 교환이 일어날 때마다 좀비 군대의 순서가 바뀌게 될 것이네.

`view` 함수는 외부에서 호출될 때 가스를 사용하지 않기 때문에, 우린 `getZombiesByOwner` 함수에서 for 반복문을 사용해서 좀비 배열의 모든 요소에 접근한 후 특정 사용자의 좀비들로 구성된 배열을 만들 수 있을 것이네. 그러고 나면 `transfer` 함수는 훨씬 비용을 적게 쓰게 되겠지. 왜냐하면 storage에서 어떤 배열도 재정렬할 필요가 없으니까 말이야. 일반적인 직관과는 반대로 이런 접근법이 전체적으로 비용 소모가 더 적네.

## `for` 반복문 사용하기

솔리디티에서 `for` 반복문의 문법은 자바스크립트의 문법과 비슷하네.

짝수로 구성된 배열을 만드는 예시를 한번 보세:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // 새로운 배열의 인덱스를 추적하는 변수
  uint counter = 0;
  // for 반복문에서 1부터 10까지 반복함
  for (uint i = 1; i <= 10; i++) {
    // `i`가 짝수라면...
    if (i % 2 == 0) {
      // 배열에 i를 추가함
      evens[counter] = i;
      // `evens`의 다음 빈 인덱스 값으로 counter를 증가시킴
      counter++;
    }
  }
  return evens;
}
```

이 함수는 `[2, 4, 6, 8, 10]`를 가지는 배열을 반환할 것이네.

## 직접 해보기

`for` 반복문을 써서 `getZombiesByOwner` 함수를 끝내보도록 하지. 반복문 안에서는 우리 DApp 안에 있는 모든 좀비들에 접근하고, 그들의 소유자가 우리가 찾는 자인지 비교하여 확인한 후, 조건에 맞는 좀비들을 `result` 배열에 추가한 후 반환할 것이네.

1. `counter`라는 이름의 `uint`를 하나 선언하고 `0`을 대입하게. 우린 `result` 배열에서 인덱스를 추적하기 위해 이 변수를 사용할 것이네.

2. `uint i = 0`에서 시작해서 `i < zombies.length`까지 증가하는 `for` 반복문을 선언하게. 이 반복문에서 우리 배열의 모든 좀비에 접근할 것이네.

3. `for` 반복문 안에서, `zombieToOwner[i]`가 `_owner`와 같은지 확인하는 `if` 문장을 만들게. 이 문장은 두 개의 주소값이 같은지 비교하는 것이네.

4. `if` 문장 안에서:
   1. `result[counter]`에 `i`를 대입해서 `result` 배열에 좀비의 ID를 추가하게.
   2. `counter`를 1 증가시키게(위의 `for` 반복문 예시를 참고하게).

이게 끝이라네 - 이 함수는 이제 `_owner`가 소유한 모든 좀비를 가스를 소모하지 않고 반환하게 될 것이네.
