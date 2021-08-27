---
title: 컨트랙트의 불변성
actions: ['checkAnswer', 'hints']
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

          // 1. 이 줄을 지우게:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. 여기서 대입을 빼고 그냥 선언으로 바꾸게:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. 여기 setKittyContractAddress 메소드를 추가하게

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

지금까지 본 것만으로는, 솔리디티는 자바스크립트 같은 다른 언어와 꽤 비슷해보였을 것이네. 하지만 이더리움 DApp에는 일반적인 애플리케이션과는 다른 여러가지 특징이 있지.

첫째로, 자네가 이더리움에 컨트랙트를 배포하고 나면, 컨트랙트는 **변하지 않는다네(Immutable)**. 다시 말하자면 컨트랙트를 수정하거나 업데이트할 수 없다는 것이지.

자네가 컨트랙트로 배포한 최초의 코드는 항상, 블록체인에 영구적으로 존재한다네. 이것이 바로 솔리디티에 있어서 보안이 굉장히 큰 이슈인 이유라네. 만약 자네의 컨트랙트 코드에 결점이 있다면, 그것을 이후에 고칠 수 있는 방법이 전혀 없다네. 자네는 사용자들에게 결점을 보완한 다른 스마트 컨트랙트 주소를 쓰라고 말하고 다녀야 할 것이네.

그러나 이것 또한 스마트 컨트랙트의 한 특징이네. 코드는 곧 법인 것이지. 자네가 어떤 스마트 컨트랙트의 코드를 읽고 검증을 했다면, 자네는 자네가 함수를 호출할 때마다, 코드에 쓰여진 그대로 함수가 실행될 것이라고 확신할 수 있네. 그 누구도 배포 이후에 함수를 수정하거나 예상치 못한 결과를 발생시키지 못한다네.

## 외부 의존성

레슨 2에서, 우리는 크립토키티 컨트랙트의 주소를 우리 DApp에 직접 써넣었네. 그런데 만약 크립토키티 컨트랙트에 버그가 있었고, 누군가 모든 고양이들을 파괴해버렸다면 어떻게 될 것 같은가?

그럴 일은 잘 없겠지만, 만약 그런 일이 발생한다면 우리의 DApp은 완전히 쓸모가 없어질 것이네. 우리 DApp은 주소를 코드에 직접 써넣기 때문에 어떤 고양이들도 받아올 수 없겠지. 우리 좀비들은 고양이를 먹을 수 없을 것이고, 우리는 그걸 고치기 위해 우리의 컨트랙트를 수정할 수도 없을 것이네.

이런 이유로, 대개의 경우 자네가 자네 DApp의 중요한 일부를 수정할 수 있도록 하는 함수를 만들어놓는 것이 합리적이겠지. 

예를 들자면 우리 DApp에 크립토키티 컨트랙트 주소를 직접 써넣는 것 대신, 언젠가 크립토키티 컨트랙트에 문제가 생기면 해당 주소를 바꿀 수 있도록 해주는 `setKittyContractAddress` 함수를 만들 수 있을 것이네.

## 직접 해보기

레슨 2에서 우리가 만든 코드를 크립토키티 컨트랙트 주소의 업데이트가 가능하도록 바꿔보세.

1. 우리가 직접 주소를 써넣었던 `ckAddress`가 있는 줄을 지우게.

2. 우리가 `kittyContract`를 생성했던 줄을 변수 선언만 하도록 변경하게 - 어떤 것도 대입을 하지 않도록 하게.

3. `setKittyContractAddress`라는 이름의 함수를 생성하게. 이 함수는 `address` 타입의 변수 `_address`를 하나의 인자로 받고, `external` 함수여야 하네.

4. 함수 내에서, `kittyContract`에 `KittyInterface(_address)`를 대입하는 한 줄의 코드를 작성하게.

> 참고: 자네가 이 함수에서 보안 취약점을 발견했더라도, 걱정하지 말게 - 우린 다음 챕터에서 그걸 고칠 것이네 ;)
