---
title: 함수 선언
actions: ["정답 확인하기", "힌트 보기"]
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          // 여기서 시작

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string memory _name, uint _dna) public {

          }

      }
---

솔리디티에서 함수 선언은 다음과 같이 하네:

```
function eatHamburgers(string memory _name, uint _amount) public {

}
```

이 함수는 `eatHamburgers`라는 함수로, `string`과 `uint` 2개의 인자를 전달받고 있군. 현재로선 함수의 내용이 비어 있네. 우리는 함수를 `public` 으로 선언을 할걸세. 우리는 또한 `_name` 변수가 `memory` 안에 저장 될 수 있도록 선언해 줄 수 있다네. 배열, 구조체, 매핑, 문자열과 같은 참조 타입에서 이렇게 저장위치를 지정할 수 있다네.

참고타입이 뭔지 궁금한가?

자, 솔라디티 함수에 값을 전달하는 두가지 방법이 있다네

- 값 타입은, 솔라디티 컴파일러가 매개 변수의 값을 새롭게 복사하여서 함수에 전달하는 방법이네. 이 방법은 초기 변수가 변경될까 걱정하지 않고 함수를 변경할 수 있다네
- 참조 타입은, 자네가 만든 함수가 원래 변수에 대한 참조와 같이 호출된다는 것을 의미하네. 따라서 자네의 함수가 받는 변수를 바꾼다면 원래의 변수의 값도 변경이 된다네.

> 참고: 함수 인자명을 언더스코어(`_`)로 시작해서 전역 변수와 구별하는 것이 관례이네 (의무는 아님). 본 튜토리얼 전체에서 이 관례를 따를 것이네.

이 함수를 다음과 같이 호출할 수 있지:

```
eatHamburgers("vitalik", 100);
```

# 직접 해보기

우리 앱에서 좀비들을 생성할 수 있을 필요가 있을 거네. 이를 위한 함수를 생성해 보세.

1. `createZombie`라는 `public`함수를 생성한다. 이 함수는 다음 2개의 인자를 전달받아야 한다: **\_name** (`string`형)과 **\_dna** (`uint`형). `memory` 키워드를 이용해서 첫 번째 인자를 전달받는다.

함수의 내용은 지금으로선 비어 두면 되네. 나중에 채울 것이니까.
