---
title: Ownable 컨트랙트 
actions: ['정답 확인하기', '힌트 보기']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. 여기서 import

        // 2. 여기서 상속:
        contract ZombieFactory {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;

            struct Zombie {
                string name;
                uint dna;
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

          function setKittyContractAddress(address _address) external {
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
         *   이로써 "유저 접근 제어"의 구현을 단순화한다. 
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

이전 챕터에서 보안 상의 문제점을 발견했나?

`setKittyContractAddress`는 `external` 함수이니까 누구나 호출할 수 있네! 즉, 이 함수를 호출하는 누구나 크립토키티 컨트렉트의 주소를 변경할 수 있어서 모든 유저가 우리 앱을 이용하지 못하게 할 수 있지.  

이 주소를 업데이트하는 기능이 우리 앱에서 필요하지만, 누구나 이 기능을 수행할 수 있기를 바라지는 않네. 

이런 경우에 대해 취할 수 있는 흔한 조치는 컨트렉트를 `Ownable`로 설정하는 것이지. 즉, 특별 권한을 가진 소유자(자네)가 있다는 뜻이지. 

## OpenZeppelin의 `Ownable` 컨트렉트

아래 코드는 **_OpenZeppelin_** 솔리디티 라이브러리에서 가져 온 `Ownable` 컨트렉트네. OpenZeppelin은 커뮤니티의 검증을 거친 안전한 스마트 컨트랙트의 라이브러리지. 자네는 이 라이브러리를 자네의 댑에 활용할 수 있네. 이 레슨을 마치고 나서 레슨 4가 나오는 걸 기다리는 동안 OpenZeppelin 사이트에 가서 관련 내용을 읽어볼 것을 강력 추천하네! 

아래 컨트랙트를 쭉 읽어 보게. 아직 배우지 않은 내용 몇 가지를 발견할 걸세. 하지만 걱정 말게. 나중에 배우게 될 걸세. 

```
/**
 * @title Ownable
 * @dev Ownable 컨트랙트는 소유자 주소를 가지며, 기본적인 권한 통제 기능을 제공한다. 
 * 이로써 "유저 접근 제어"의 구현을 단순화한다. 
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
```

우리가 여태껏 다루지 않았던 몇 가지 내용은 다음과 같네:

- 생성자: `function Ownable()`는 **_생성자_**이지. 즉, 컨트렉트와 동일한 이름을 가진 특수 함수로, 선택적으로 이용할 수 있지. 생성자는 컨트렉트가 처음 생성될 때 한 번만 실행되지. 
- 함수 접근 제어자 `modifier onlyOwner()`: 이 접근 제어자는 다른 함수를 수식하는 데 이용되는 일종의 반쪽짜리 함수로, 함수 실행 전에 몇 가지 요구사항을 확인할 때 보통 이용되지. 이 경우, `onlyOwner` 함수를 접근 제한을 위해 이용하여 **오직** 컨트렉트 **소유자**만이 이 함수를 호출할 수 있도록 할 수 있다. 다음 챕터에서 이 함수 접근 제어자와 이상한 `_;`에 대해 더 살펴 볼 걸세. 
- `indexed` 키워드: 이 키워드는 아직 필요하지 않으니 걱정하지 말게.  

`Ownable` 컨트렉트는 기본적으로 다음 기능을 수행하지:

1. 컨트렉트가 생성될 때, 생성자가 `owner`를 `msg.sender`(컨트렉트를 구축한 사람)으로 설정하지.

2. `onlyOwner` 접근 제어자를 추가하여 `owner`만이 특정 함수를 접근할 수 있도록 하지.

3. 자네가 컨트렉트 소유권을 새로운 `owner`에게 넘길 수 있도록 하지. 

`onlyOwner`는 컨트랙트라면 갖춰야 하는 기본 요구사항이라서 대부분의 솔리디티 댑은 `Ownable` 컨트랙트를 그대로 가져와서 프로젝트를 시작하고, 첫 컨트랙트가 `Ownable`을 상속하도록 하지. 

`setKittyContractAddress` 함수를 `onlyOwner`로 제한하고자 하기 때문에 우리 프로젝트에도 동일하게 `Ownable` 컨트렉트를 이용할 것이네. 

## 직접 해보기

미리 `Ownable` 컨트렉트 코드를 새 파일인 `ownable.sol`에 복사해 두었네. `ZombieFactory`가 `Ownable`를 상속하도록 해 보세. 

1. 우리 코드를 변경하여 `ownable.sol` 파일을 `import`하도록 한다. 잘 모르겠다면 `zombiefeeding.sol`을 참고할 것. 

2. `ZombieFactory` 컨트랙트를 변경하여 `Ownable`을 상속하도록 한다. 다시 말하지만, 잘 모르겠다면 `zombiefeeding.sol`을 참고할 것. 
