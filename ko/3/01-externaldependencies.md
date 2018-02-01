---
title: 컨트랙트의 변조 불가능성 
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

          // 1. 이 코드를 제거:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. "=" 다음에 나오는 부분이 없는 단순한 선언으로 변경:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. setKittyContractAddress 메소드를 여기에 추가

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
---

지금까지는 솔리디티가 자바스크립트와 같은 다른 프로그래밍 언어와 크게 다르지 않았네. 하지만 일반 애플리케이션과 비교했을 때 많은 측면에서 이더리움 댑은 상당히 다르지. 

먼저, 자네가 컨트랙트를 이더리움에 구축한 이후 이더리움 댑은 **_변조가 불가능_**하지. 즉, 댑을 다시는 변경하거나 업데이트할 수 없다는 뜻이지. 

자네가 컨트랙트에 구현한 원래 코드는 블록체인 상에 영구적으로 존재하게 되지. 이 때문에 솔리디티에서 보안이 중대한 이슈로 떠오르지. 컨트렉트 코드에 결점이 있는 경우, 이후에 코드를 패치할 방법이 없지. 자네는 유저에게 패치가 된 스마트 컨트랙트의 주소를 이용하라고 해야 할 걸세. 

하지만 이 또한 스마트 컨트랙트의 특징이지. 코드가 법이야. 스마트 컨트랙트의 코드를 읽고 정확한지 확인한 경우, 어떤 함수를 호출할 때마다 이 함수가 코드에 따라 어떤 일을 수행할 것인지 분명히 알 수 있지. 어느 누구도 이후에 그 함수를 변경해서 예상치 못한 결과값이 나오도록 할 수 없지. 

## 외부 의존성

레슨 2에서 크립토키티 컨트랙트 주소를 우리 댑에 하드 코딩했지. 하지만 크립토키티 컨트랙트에 버그가 있어서 누군가가 크립토키티를 모두 없애버린 경우 어떤 일이 발생할까? 

그런 일이 일어날 가능성이 적지만, 만에 하나 발생하면 우리 댑은 완전히 쓸모 없게 될 거네. 우리 댑이 하드 코딩된 주소를 가리키고 있는데, 이 주소가 어떤 고양이도 더 이상 반환하지 않기 때문이지. 우리 좀비들도 고양이를 먹을 수 없을 거고, 우린 컨트랙트를 패치할 수도 없을 거네. 

이 때문에, 댑의 핵심 부분을 업데이트할 수 있도록 하는 함수를 생성하는 게 말이 되지. 

이를테면, 우리 댑에 크립토키티 컨트랙트 주소를 하드 코딩하는 대신에, 크립토키티 컨트랙트에 무슨 일이 일어나는 걸 대비해 주소 값을 나중에 바꿀 수 있도록 `setKittyContractAddress` 함수를 생성해야 할 걸세.

## 직접 해보기

레슨 2에서 작성했던 코드를 업데이트해서 크립토키티 컨트랙트 주소를 바꿀 수 있도록 해 보세. 

1. `ckAddress`를 하드 코딩한 부분을 삭제한다. 

2. `kittyContract`를 생성했던 코드를 변경하여 `kittyContract`를 변수로 선언만 하고 어떠한 값도 부여하지 않는다. 

3. `setKittyContractAddress`라는 함수를 생성한다. 이 함수는 `address`형인 `_address` 인자 하나를 전달받고, `external` 함수로 선언되어야 한다. 

4. `kittyContract`에 `KittyInterface(_address)`를 부여하는 코드를 함수에 한 줄 추가한다. 

> 참고: 이 함수에 보안상 결점이 있다는 것을 눈치챘다면 걱정 말게. 다음 챕터에서 해결할 것이네 ;) 
