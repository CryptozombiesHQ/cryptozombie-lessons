---
title: 수학 연산
actions: ["정답 확인하기", "힌트 보기"]
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }
---

솔리디티에서 수학은 꽤 간단하지. 다음 연산은 대부분의 프로그래밍 언어의 수학 연산과 동일하네:

- 덧셈: `x + y`
- 뺄셈: `x - y`,
- 곱셈: `x * y`
- 나눗셈: `x / y`
- 모듈로 / 나머지: `x % y` _(이를테면, `13 % 5`는 `3`이네. 왜냐하면 13을 5로 나누면 나머지가 3이기 때문이지)_

솔리디티는 **_지수 연산_**도 지원하지 (즉, "x의 y승", x^y이지):

```
uint x = 5 ** 2; // 즉, 5^2 = 25
```

# 직접 해보기

우리의 좀비 DNA가 16자리 숫자가 되도록 하기 위해 또다른 `unit`형 변수를 생성하고 10^16 값을 배정하세. 이로써 이 값을 이후 모듈로 연산자 `%`와 함께 이용하여 16자리보다 큰 수를 16자리 숫자로 줄일 수 있네.

1. `dnaModulus`라는 `uint`형 변수를 생성하고 **10의 `dnaDigits`승**을 배정한다.
