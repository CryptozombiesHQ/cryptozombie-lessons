---
title: 상태 변수 & 정수
actions: ["정답 확인하기", "힌트 보기"]
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          // 여기서 시작

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

잘했네! 이제 우리 컨트랙트를 위한 뼈대를 갖추게 되었네. 이제 솔리디티에서 변수를 다루는 방법을 배워 보도록 하지.

**_상태 변수_**는 컨트랙트 저장소에 영구적으로 저장되네. 즉, 이더리움 블록체인에 기록된다는 거지. 데이터베이스에 데이터를 쓰는 것과 동일하네.

##### 예시:

```
contract Example {
  // 이 변수는 블록체인에 영구적으로 저장된다
  uint myUnsignedInteger = 100;
}
```

이 예시 컨트랙트에서는 `myUnsignedInteger`라는 `uint`를 생성하여 100이라는 값을 배정했네.

## 부호 없는 정수: `uint`

`uint` 자료형은 부호 없는 정수로, **값이 음수가 아니어야 한다는** 의미네. 부호 있는 정수를 위한 `int` 자료형도 있네.

> 참고: 솔리디티에서 `uint`는 실제로 `uint256`, 즉 256비트 부호 없는 정수의 다른 표현이지. `uint8`, `uint16`, `uint32` 등과 같이 uint를 더 적은 비트로 선언할 수도 있네. 하지만 앞으로의 레슨에서 다루게 될 특수한 경우가 아니라면 일반적으로 단순히 `uint`를 사용하지.

# 직접 해보기

우리의 좀비 DNA는 16자리 숫자로 결정될 걸세.

`dnaDigits`라는 `uint`를 선언하고 `16`이라는 값을 배정해 보게.
