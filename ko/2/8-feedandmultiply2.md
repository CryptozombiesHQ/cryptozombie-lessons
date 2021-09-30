---
title: 좀비 DNA
actions: ['정답 확인하기', '힌트 보기']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // 여기서 시작
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
    answer: >
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
---

`feedAndMultiply` 함수 작성을 마무리해 보세! 

새로운 좀비의 DNA를 계산하는 공식은 간단하네: 먹이를 먹는 좀비의 DNA와 먹이의 DNA의 평균을 내는 거지.

예시:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ 3333333333333333이 될 것이다
}
```

자네가 원한다면 나중에 공식을 좀더 복잡하게 할 수도 있을 거네. 하지만 지금으로선 공식을 간단하게 하도록 하지. 나중에 언제든지 변경할 수 있으니까. 

# 직접 해보기

1. 먼저, `_targetDna`가 16자리보다 크지 않도록 해야 한다. 이를 위해, `_targetDna`를 `_targetDna % dnaModulus`와 같도록 해서 마지막 16자리 수만 취하도록 한다. 

2. 그 다음, 함수가 `newDna`라는 `uint`를 선언하고 `myZombie`의 DNA와 `_targetDna`의 평균 값을 부여해야 한다. (위의 예시 참고) 

  > 참고: `myZombie.name`와 `myZombie.dna`를 이용하여 `myZombie` 구조체의 변수에 접근할 수 있지. 

3. 새로운 DNA 값을 얻게 되면 `_createZombie` 함수를 호출한다. 이 함수를 호출하는 데 필요한 인자 값을 `zombiefactory.sol` 탭에서 확인할 수 있다. 참고로, 이 함수는 좀비의 이름을 인자 값으로 필요로 한다. 그러니 새로운 좀비의 이름을 현재로서는 "NoName"으로 하도록 하자. 나중에 좀비 이름을 변경하는 함수를 작성할 수 있을 것이다.

> 참고: 솔리디티가 자네를 위해 열심히 일해서 자네가 코드의 문제점을 알아 차렸을 수도 있겠군. 걱정 말게. 다음 챕터에서 문제를 해결할 걸세 ;) 
