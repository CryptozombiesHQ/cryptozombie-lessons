---
title: "보너스: 키티 유전자"
actions: ['정답 확인하기', '힌트 보기']
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 여기에 있는 함수 정의를 변경:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // 여기에 if 문 추가
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // 여기에 있는 함수 호출을 변경: 
            feedAndMultiply(_zombieId, kittyDna);
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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

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

우리의 함수 로직이 이제 완료되었군... 하지만 한 가지를 보너스로 추가해 보도록 하세. 

고양이 유전자와 조합되어 생성된 좀비가 몇 가지 독특한 특성을 가져서 고양이 좀비로 보이도록 해 보세. 

이를 위해 좀비 DNA에 몇 가지 특별한 키티 코드를 추가할 수 있네. 

레슨 1에서 배운 내용을 떠올려 보면, 좀비의 외모를 결정하는 데 있어서 16자리 DNA 중에서 처음 12자리만 이용되지. 그러니 마지막에서 2자리 숫자를 활용하여 "특별한" 특성을 만들어 보세. 

고양이 좀비는 DNA 마지막 2자리로 `99`를 갖는다고 해 보세 (고양이는 9개의 목숨을 가졌다고 할 만큼 생명력이 강하므로). 그러면 우리 코드에서는 만약(`if`) 좀비가 고양이에서 생성되면 좀비 DNA의 마지막 2자리를 `99`로 설정한다. 

## If 문

솔리디티에서 if 문은 자바스크립트의 if 문과 동일하다: 
```
function eatBLT(string sandwich) public {
  // 스트링 간의 동일 여부를 판단하기 위해 keccak256 해시 함수를 이용해야 한다는 것을 기억하자 
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# 직접 해보기

우리의 좀비 코드에 고양이 유전자에 대한 내용을 구현해 보세.  

1. 먼저, `feedAndMultiply` 함수 정의를 변경하여 `_species`라는 `string`을 세번째 인자 값으로 전달받도록 한다. 

2. 그 다음, 새로운 좀비 DNA를 계산한 후에 `if` 문을 추가하여 `_species`와 `"kitty"` 스트링 각각의 `keccak256` 해시값을 비교하도록 한다. 

3. `if` 문 내에서 DNA 마지막 2자리를 `99`로 대체하고자 한다. 한가지 방법은 `newDna = newDna - newDna % 100 + 99;` 로직을 이용하는 것이다. 

  > 설명: `newDna`가 `334455`라고 하면 `newDna % 100`는 `55`이고, 따라서 `newDna - newDna % 100`는 `334400`이다. 마지막으로 여기에 `99`를 더하면 `334499`를 얻게 된다.

4. 마지막으로, `feedOnKitty` 함수 내에서 이뤄지는 함수 호출을 변경해야 한다. `feedAndMultiply`가 호출될 때, `"kitty"`를 마지막 인자값으로 전달한다. 
