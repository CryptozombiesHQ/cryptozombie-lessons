---
title: 가스
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

            struct Zombie {
                string name;
                uint dna;
                // 여기에 새로운 데이터 추가
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
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
---

대단하군! 이제 다른 유저가 우리 컨트랙트를 함부로 이용하는 걸 예방하면서도, 댑의 핵심 부분을 업데이트할 수 있는 방법을 알게 되었군. 

다른 프로그래밍 언어와 다른 솔리디티만의 또다른 특징에 대해 알아 보도록 하세:

## 가스 — 이더리움 댑을 가동시키는 연료 

솔리디티에서 유저들은 댑 함수를 실행할 때마다 **_가스_**라는 통화로 비용을 지불해야 하지. 유저들이 이더(이더리움 상의 통화)로 가스를 구입해야 하니 댑 함수를 실행하려면 이더를 소비해야만 하네. 

함수 로직의 복잡도에 따라서 함수 실행 시 필요한 가스 양이 달라지지. 개별 연산마다 **_가스 비용_**을 가지는데, 이는 연산을 수행하는 데 필요한 컴퓨팅 리소스에 따라 대개 결정되지 (이를테면, 저장소에 쓰는 작업은 두 정수를 더하는 것보다 훨씬 더 비싸다). 함수의 총 **_가스 비용_**은 개별 연산이 갖는 가스 비용의 총합이네. 

함수 실행 시 유저가 돈을 지불해야 하기 때문에 이더리움에서는 코드 최적화가 다른 프로그래밍 언어에 비해 훨씬 더 중요하지. 자네의 코드가 엉성하면 유저들이 함수를 실행할 때 더 많은 돈을 지불해야 하고, 결국에는 수천명의 유저들이 불필요하게 수백만 달러를 허비할 수 있지.

## 왜 가스가 필요할까? 

이더리움은 거대하고 느리지만 극도로 안전한 컴퓨터와 같지. 자네가 함수를 실행할 때, 네트워크 상의 모든 개별 노드는 동일한 함수를 실행하여 출력값을 확인하지. 수천 개의 노드가 모든 함수 실행을 확인하니 이더리움이 탈중심화되는 거고 이더리움 상의 데이터를 변조하거나 검열할 수 없는 거지. 

이더리움 개발자들은 누군가가 무한 루프를 통해 네트워크를 마비시키거나 강도 높은 연산으로 시스템 리소스를 독점 이용하지 못하도록 하고 싶었지. 그래서 개발자들은 트랜잭션을 유료로 만들어 유저들이 저장 뿐만 아니라 연산 시간에 대해서도 비용을 지불하도록 했지. 

> 참고: 크립토좀비 개발자들이 Loom Network에서 진행 중인 프로젝트와 같은 사이드 체인에서는 이러한 사실이 적용되지 않을 수도 있지. 이더리움 메인넷에서 월드 오브 워크래프트 같은 게임을 돌린다는 게 도무지 말이 되지 않지. 가스 비용이 무지 비쌀 것이네. 하지만 상이한 컨센서스 알고리즘을 가진 사이드체인에서는 돌릴 수 있겠지. 이후 레슨에서 사이드체인과 이더리움 메인넷에서 구축할 수 있는 댑의 종류에 대해 더 살펴 보도록 하겠네. 

## 가스 절약을 위한 구조체 패킹

레슨 1에서 `uint`의 종류로 `unit8`, `uint16`, `uint32` 등이 있다고 언급한 적이 있지. 

솔리디티가 `uint` 크기에 관계 없이 256비트의 저장소를 보유하고 있기 때문에 보통 이런 하위 자료형을 이용해도 이득이 없네. 이를테면, `uint` 대신에 `uint8`를 이용해도 가스 절약이 안 되지. 

하지만 구조체 내부에서 예외가 적용되지.

구조체 내에 여러 개의 `uint`가 있는 경우, 가능한 한 작은 크기의 `uint`를 이용하면 솔리디티가 변수들을 함께 싸서 적은 공간을 차지하도록 하지. 다음 예시를 보게:

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// 구조체 패킹으로 인해 `mini`가 `normal`보다 가스가 덜 든다.
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

이로 인해 구조체 내에 최대한 작은 하위 정수 자료형을 이용하는 게 좋지. 

또한, 동일한 자료형을 함께 모으면 (즉, 구조체 내에 동일한 자료형을 바로 옆에 위치시키면) 솔리디티가 저장소 공간을 최소화할 수 있지. 이를테면, `uint c; uint32 a; uint32 b;`를 가진 구조체는 `uint32 a; uint c; uint32 b;`를 가진 구조체보다 가스를 덜 소비하는데, 이는 `uint32`변수들이 함께 모여 있기 때문이지. 

## 직접 해보기

이번 레슨에서는 `level`과 `readyTime`이라는 특성을 우리 좀비들에게 추가할 걸세. 참고로 `readyTime`은 좀비가 먹이를 먹는 횟수를 제한하기 위한 대기 시간을 구현할 때 필요할 걸세.  

그럼 `zombiefactory.sol`로 돌아 가보세.

1. 좀비 구조체에 `uint32`형인 `level`과 `readyTime`을 추가한다. 이 두 변수를 함께 모아 구조체 마지막 부분에 위치시킨다. 

32비트는 좀비의 레벨과 타임스탬프를 저장하기는 데 있어 넘치도록 충분한 공간이니, 이를 통해 `uint`형(256비트) 변수 두 개를 이용하는 것보다 데이터를 더 꽉 싸서 가스를 절약할 수 있을 걸세.
