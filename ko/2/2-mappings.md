---
title: 매핑과 주소 
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

          // 여기서 매핑 선언

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
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

데이터베이스에 저장된 좀비들에게 주인을 설정하여 우리 게임을 멀티 플레이어 게임으로 만들어 보세.

이걸 하려면 `mapping`과 `address`라는 2가지 새로운 자료형이 필요할 거네. 

## 주소

이더리움 블록체인은 은행 계좌와 같은 **_계정들_**로 이루어져 있지. 계정은 이더리움 블록체인상의 통화인 **_이더_**의 잔액을 가지지. 자네의 은행 계좌에서 다른 계좌로 돈을 송금할 수 있듯이, 계정을 통해 다른 계정과 이더를 주고 받을 수 있지. 

각 계정은 은행 계좌 번호와 같은 `주소`를 가지고 있네. 주소는 특정 계정을 가리키는 고유 식별자로, 다음과 같이 표현되지:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(이 주소는 크립토좀비 팀의 주소지. 자네가 크립토좀비를 즐기고 있다면 우리에게 이더 몇 개를 보내줄 수 있겠지! 😉)

이후 레슨에서 주소에 관한 핵심 내용을 알아 볼 것일세. 지금은 자네가 **"주소는 특정 유저(혹은 스마트 컨트랙트)가 소유한다"**라는 점만 이해하면 되네.  

그러니까 주소를 우리 좀비들에 대한 소유권을 나타내는 고유 ID로 활용할 수 있네. 유저가 우리 앱을 통해 새로운 좀비를 생성하면 좀비를 생성하는 함수를 호출한 이더리움 주소에 그 좀비에 대한 소유권을 부여하지. 

## 매핑

레슨 1에서 **_구조체_**와 **_배열_**을 살펴 봤네. **_매핑_**은 솔리디티에서 구조화된 데이터를 저장하는 또다른 방법이지. 

다음과 같이 `매핑`을 정의하지:

```
// 금융 앱용으로, 유저의 계좌 잔액을 보유하는 uint를 저장한다: 
mapping (address => uint) public accountBalance;
// 혹은 userID로 유저 이름을 저장/검색하는 데 매핑을 쓸 수도 있다 
mapping (uint => string) userIdToName;
```

매핑은 기본적으로 키-값 (key-value) 저장소로, 데이터를 저장하고 검색하는 데 이용된다. 첫번째 예시에서 키는 `address`이고 값은 `uint`이다. 두번째 예시에서 키는 `uint`이고 값은 `string`이다. 

# 직접 해보기

좀비 소유권을 저장하기 위해 2가지 매핑을 이용하고자 하네: 하나는 좀비 소유자의 주소를 추적하기 위한 것이고, 다른 하나는 소유한 좀비의 숫자를 추적하기 위한 것이네. 

1. `zombieToOwner`라는 매핑을 생성한다. 키는 `uint`이고 (좀비 ID로 좀비를 저장하고 검색할 것이다), 값은 `address`이다. 이 매핑을 `public`으로 설정하자.

2. `ownerZombieCount`라는 매핑을 생성한다. 키는 `address`이고 값은 `uint`이다.
