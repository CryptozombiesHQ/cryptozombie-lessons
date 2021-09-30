---
title: Msg.sender
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
              // 여기서 시작
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
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
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

좀비 소유자를 추적하는 매핑을 가지고 있으니 `_createZombie` 메소드를 업데이트해서 이 매핑을 이용하도록 하고 싶네.

이를 위해, `msg.sender`라는 것을 이용할 필요가 있네. 

## msg.sender

솔리디티에는 모든 함수에서 이용 가능한 특정 전역 변수들이 있지. 그 중의 하나가 현재 함수를 호출한 사람 (혹은 스마트 컨트랙트)의 주소를 가리키는 `msg.sender`이지.

> 참고: 솔리디티에서 함수 실행은 항상 외부 호출자가 시작하네. 컨트랙트는 누군가가 컨트랙트의 함수를 호출할 때까지 블록체인 상에서 아무 것도 안 하고 있을 것이네. 그러니 항상 `msg.sender`가 있어야 하네. 

`msg.sender`를 이용하고 `mapping`을 업데이트하는 예시가 여기에 있네: 

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // `msg.sender`에 대해 `_myNumber`가 저장되도록 `favoriteNumber` 매핑을 업데이트한다 `
  favoriteNumber[msg.sender] = _myNumber;
  // ^ 데이터를 저장하는 구문은 배열로 데이터를 저장할 떄와 동일하다 
}

function whatIsMyNumber() public view returns (uint) {
  // sender의 주소에 저장된 값을 불러온다 
  // sender가 `setMyNumber`을 아직 호출하지 않았다면 반환값은 `0`이 될 것이다
  return favoriteNumber[msg.sender];
}
```

이 간단한 예시에서 누구나 `setMyNumber`을 호출하여 본인의 주소와 연결된 우리 컨트랙트 내에 `uint`를 저장할 수 있지. 

`msg.sender`를 활용하면 자네는 이더리움 블록체인의 보안성을 이용할 수 있게 되지. 즉, 누군가 다른 사람의 데이터를 변경하려면 해당 이더리움 주소와 관련된 개인키를 훔치는 것 밖에는 다른 방법이 없다는 것이네.

# 직접 해보기

레슨 1에서 다뤘던 `_createZombie` 메소드를 업데이트하여 이 함수를 호출하는 누구나 좀비 소유권을 부여하도록 해 보세. 

1. 먼저, 새로운 좀비의 `id`가 반환된 후에  `zombieToOwner` 매핑을 업데이트하여 `id`에 대하여 `msg.sender`가 저장되도록 해보자. 

2. 그 다음, 저장된 `msg.sender`을 고려하여 `ownerZombieCount`를 증가시키자.

자바스크립트와 마찬가지로 솔리디티에서도 `uint`를 `++`로 증가시킬 수 있다. 

```
uint number = 0;
number++;
// `number`는 이제 `1`이다
```

자네의 최종 답안은 코드 2줄로 표현되어야 하네.
