---
title: 함수 접근 제어자 더 알아보기
actions: ['정답 확인하기', '힌트 보기']
material:
  editor:
    language: sol
    startingCode:
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

            // edit function definition below
            function _createZombie(string _name, uint _dna) private {
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
                _createZombie(_name, randDna);
            }

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

        }
    answer: >
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
              _createZombie(_name, randDna);
          }

      }
---

**지난 레슨의 코드에 실수가 있네!**

자네가 코드를 컴파일하려고 하면 컴파일러가 에러 메시지를 출력할 거네. 

문제는 `ZombieFeeding` 컨트랙트 내에서 `_createZombie` 함수를 호출하려고 했다는 거지. 그런데 `_createZombie` 함수는 `ZombieFactory` 컨트랙트 내의 `private` 함수이지. 즉, `ZombieFactory` 컨트랙트를 상속하는 어떤 컨트랙트도 이 함수에 접근할 수 없다는 뜻이지.   

## Internal과 External

`public`과 `private` 이외에도 솔리디티에는 `internal`과 `external`이라는 함수 접근 제어자가 있지.

`internal`은 함수가 정의된 컨트랙트를 상속하는 컨트랙트에서도 접근이 가능하다 점을 제외하면 `private`과 동일하지. **(우리한테 필요한 게 바로 `internal`인 것 같군! 

`external`은 함수가 컨트랙트 바깥에서만 호출될 수 있고 컨트랙트 내의 다른 함수에 의해 호출될 수 없다는 점을 제외하면 `public`과 동일하지. 나중에 `external`과 `public`이 각각 왜 필요한지 살펴 볼 것이네. 

`interal`이나 `external` 함수를 선언하는 건 `private`과 `public` 함수를 선언하는 구문과 동일하네:

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // eat 함수가 internal로 선언되었기 때문에 여기서 호출이 가능하다 
    eat();
  }
}
```

# 직접 해보기

1. `_createZombie()` 함수를 `private`에서 `internal`로 바꾸어 선언하여 이 함수가 정의된 컨트랙트를 상속하는 컨트랙트에서도 접근 가능하도록 한다.

  이미 `zombiefactory.sol` 탭이 활성화되어 있다.
                                                      