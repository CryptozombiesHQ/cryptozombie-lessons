---
title: onlyOwner 함수 접근 제어자
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

          // 이 함수를 변경:
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

우리의 베이스 컨트랙트인 `ZombieFactory`가 `Ownable`을 상속하기 때문에 `ZombieFeeding` 컨트랙트에서도 `onlyOwner` 함수를 이용할 수 있지. 

이는 컨트렉트 상속의 효과이지. 다음을 기억하게:

```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```

그러므로 `ZombieFeeding`도 `Ownable`을 상속하게 되고, `Ownable` 컨트랙트의 함수, 이벤트, 접근 제어자를 접근할 수 있게 되지. 이는 `ZombieFeeding`를 상속하는 어떤 컨트랙트나 동일하게 적용되네. 

## 함수 접근 제어자

함수 접근 제어자는 함수와 똑같은 것처럼 보이지만 `function` 대신에 `modifier` 키워드를 이용하지. 또한, 직접 호출되지도 못하지. 대신, 접근 제어자 키워드를 함수 선언의 마지막에 추가해서 함수의 작동 방식을 변경하네. 

`onlyOwner`을 자세히 살펴 보세:

```
/**
 * @dev 소유자가 아닌 계정에 의해 호출되는 경우, 실행을 중단한다. 
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

다음과 같이 접근 제어자를 이용할 수도 있지:

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // 아래와 같이 `onlyOwner`를 이용한다:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

`likeABoss` 함수에 `onlyOwner` 접근 제어자가 쓰인 것을 참고하게. `likeABoss` 함수가 호출되면 `onlyOwner` 코드가 **먼저** 실행되고, `_;` 문에 다다르면 `likeABoss`로 돌아와 코드가 실행되지. 

접근 제어자를 활용하는 다른 여러 방식이 있지만, 가장 자주 이용되는 방법 중의 하나는 함수 실행 전에 `require` 체크를 추가하는 것이지. So while there are other ways you can use modifiers, one of the most common use-cases is to add quick `require` check before a function executes.

`onlyOwner`의 경우, 이 접근 제어자를 함수에 추가하면 **오직** 컨트렉트 **소유자**(컨트렉트를 자네가 구축했으면 자네가 소유자네)만이 그 함수를 호출할 수 있게 되지. 

> 참고: 이처럼 소유자에게 컨트랙트에 대한 특별 권한을 부여하는 게 종종 필요하지만, 또한 악의적으로 이용될 수도 있다네. 이를테면, 소유자가 백도어 함수를 컨트랙트에 추가해서 다른 사람의 좀비를 자신의 것으로 만들 수 있지!

> 그러니 댑이 이더리움 상에 구축된다고 하더라도 무조건 댑이 탈중심화되었다고 할 수 없다는 점을 기억하도록 하게. 이 때문에 자네는 전체 소스 코드를 읽어서 소유자가 특별 권한을 행사하고자 코드에 추가한 내용이 있는지 확인해야 하네. 개발자는 버그가 생기면 해결할 수 있도록 댑을 통제할 수 있어야 하는 한편, 유저가 신뢰하고 유저 데이터가 안전하게 유지되는 소유자 없는 플랫폼을 만들어야 하는데, 양자 사이에 세심하게 균형을 맞출 필요가 있지.

## 직접 해보기

이제 `setKittyContractAddress`에 대한 접근을 제한해서 우리만 함수를 변경할 수 있도록 할 수 있겠지. 

1. `setKittyContractAddress`에 `onlyOwner` 접근 제어자를 추가한다.
