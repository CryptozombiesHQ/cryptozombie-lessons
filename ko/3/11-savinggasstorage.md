---
title: 저장하는 게 비싸다
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
            // 여기서 시작
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

          return result;
        }

      }
---

솔리디티에서 비싼 연산 중의 하나가 바로 `storage`를 이용하는 것이지. 특히 쓰는 게 비싸지. 

왜냐면 자네가 데이터를 쓰거나 변경할 때 블록체인에 영구적으로 기록되기 떄문이지. 영원히! 전 세계 수천 개의 노드가 하드 드라이브에 그 데이터를 저장해야 하고, 블록체인의 규모가 커짐에 따라 데이터 양도 계속 늘어날 것이네. 그러니 그에 따른 비용을 지불해야 하지. 

비용을 줄이려면 정말 필요할 때가 아니면 저장소에 데이터를 쓰는 걸 피해야 하지. 이 떄문에 가끔씩 프로그래밍 로직이 비효율적인 것처럼 보일 때가 있지. 이를테면 빠른 검색을 위해 변수에 배열을 간단히 저장하기 보다는 함수가 호출될 때마다 배열을 `메모리`에 다시 생성하는 거지. 

대다수의 프로그래밍 언어에서는 대규모 데이터 셋에 대해 반복문을 실행하는 게 비싸지. 하지만 솔리디티의 `external view` 함수에서는 그게 `storage`를 이용하는 것보다 훨씬 더 싸네. 왜냐면 `view` 함수를 유저들이 공짜로 이용할 수 있기 때문이지. (가스 때문에 유저들이 실제 돈을 지불해야 하네!)

다음 챕터에서 `for` 반복문을 살펴 볼 걸세. 하지만 먼저 메모리에 배열을 선언하는 방법을 살펴 보도록 하지. 

## 메모리에 배열 선언하기 

배열에 `memory` 키워드를 이용하여 함수 내에 새로운 배열을 생성하면 저장소에 아무 것도 쓸 필요가 없지. 배열은 함수 호출이 종료될 때까지만 존재할 것이고, 이는 `storage`에 있는 배열을 업데이트하는 것보다 가스 측면에서 훨씬 더 저렴하지. 외부에서 호출되는 `view` 함수에서 이렇게 배열을 이용하면 공짜라네. 

메모리에 배열을 선언하는 방법은 다음과 같네:

```
function getArray() external pure returns(uint[]) {
  // 메모리에 길이가 3인 배열 인스턴스를 생성한다
  uint[] memory values = new uint[](3);
  // 몇 가지 값을 배열에 추가한다
  values.push(1);
  values.push(2);
  values.push(3);
  // 배열을 반환한다
  return values;
}
```

자네에게 구문을 보여주려고 사소한 예시를 들어 보았지만, 다음 챕터에서 이 구조를 `for` 반복문과 조합하여 실제 사용하는 것을 보이도록 하겠네. 

> 참고: 메모리 배열은 **반드시** 길이 인자값과 함께 생성되어야 하네 (이 예시에서는 길이 인자값이 `3`이지). 지금으로선 메모리 배열의 크기를 `array.push()`를 통해 늘릴 수 없네. 저장소에 있는 배열은 이게 가능하지. 물론 솔리디티 나중 버전에서 가능하게 될 수도 있지만 말이지.

## 직접 해보기

`getZombiesByOwner` 함수에서, 특정 유저가 소유한 모든 좀비를 가진 `uint[]` 배열을  반환하고자 하네.

1. `uint[] memory` 변수 `result`를 선언한다. 

2. 이 변수에 새로운 `uint` 배열을 설정한다. 배열의 길이는 `_owner`가 소유한 좀비 수여야 하고, 이 값은 `ownerZombieCount[_owner]`을 통해 얻을 수 있다. 

3. 함수 마지막 부분에서 `result`를 반환한다. 현재로선 배열이 비어 있지만, 다음 챕터에서 배열을 채울 것이다. 