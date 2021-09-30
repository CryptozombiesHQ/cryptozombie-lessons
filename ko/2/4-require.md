---
title: Require
actions: ['정답 확인하기', '힌트 보기']
material:
  editor:
    language: sol
    startingCode: |
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
              // 여기서 시작
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
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
---

레슨 1에서 유저가 `createPseudoRandomZombie`를 호출하여 좀비 이름을 입력하면 새로운 좀비를 생성할 수 있도록 했네. 하지만, 만일 유저가 이 함수를 계속 호출해서 무제한으로 좀비를 생성한다면 게임이 매우 재미있지는 않을 걸세. 

각 플레이어가 이 함수를 한 번만 호출할 수 있도록 만들어 보세. 이로써 새로운 플레이어들이 게임을 처음 시작할 때 좀비 군대를 구성할 첫 좀비를 생성하기 위해 `createPseudoRandomZombie`함수를 호출하게 될 것이네.

어떻게 하면 이 함수가 각 플레이어마다 한 번씩만 호출되도록 할 수 있을까? 

이를 위해 `require`를 활용할 것이네. `require`를 활용하면 특정 조건이 참이 아닐 때 함수가 에러 메시지를 발생하고 실행을 멈추게 되지: 

```
function sayHiToVitalik(string _name) public returns (string) {
  // _name이 "Vitalik"인지 비교한다. 참이 아닐 경우 에러 메시지를 발생하고 함수를 벗어난다
  // (참고: 솔리디티는 고유의 스트링 비교 기능을 가지고 있지 않기 때문에 
  // 스트링의 keccak256 해시값을 비교하여 스트링 값이 같은지 판단한다)
  require(keccak256(_name) == keccak256("Vitalik"));
  // 참이면 함수 실행을 진행한다:
  return "Hi!";
}
```

`sayHiToVitalik("Vitalik")`로 이 함수를 실행하면 "Hi!"가 반환될 것이네. "Vitalik"이 아닌 다른 값으로 이 함수를 호출할 경우, 에러 메시지가 뜨고 함수가 실행되지 않을 걸세.

그러므로 `require`는 함수를 실행하기 전에 참이어야 하는 특정 조건을 확인하는 데 있어서 꽤 유용하지.

# 직접 해보기

우리의 좀비 게임에서 유저가 `createPseudoRandomZombie` 함수를 반복적으로 호출해서 자신의 군대에 좀비를 무제한으로 생성하는 것을 원하지 않네. 그렇게 되면 게임이 재미없게 될 걸세. 

`require`를 활용하여 유저들이 첫 좀비를 만들 때 이 함수가 유저 당 한 번만 호출되도록 해 보세. 

1. `require` 키워드를 `createPseudoRandomZombie` 앞부분에 입력한다. `require` 함수가 `ownerZombieCount[msg.sender]`이 0과 같은지 확인하도록 하고, 0이 아닌 경우 에러 메시지를 출력하도록 한다.  

> 참고: 솔리디티에서 값을 비교할 때 어떤 항이 먼저 오느냐는 중요하지 않네. 어떤 순서든 동일하지. 하지만, 우리가 작성한 확인 기능은 매우 기본적이라서 한 가지 답만을 참이라고 하네. 그러니 `ownerZombieCount[msg.sender]`을 가장 먼저 작성 해주게.  
