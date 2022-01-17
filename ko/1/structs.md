---
title: 구조체
actions: ["정답 확인하기", "힌트 보기"]
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

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

      }
---

자네가 좀 더 복잡한 자료형을 필요로 할 때가 가끔 있을 거네. 이를 위해 솔리디티는 **_구조체_**를 제공하지:

```
struct Person {
  uint age;
  string name;
}

```

구조체를 통해 여러 특성을 가진, 보다 복잡한 자료형을 생성할 수 있지.

> 참고로 `string`이라는 새로운 자료형을 방금 소개했네. 스트링은 임의의 길이를 가진 UTF-8 데이터를 위해 활용되네. 이를테면 `string greeting = "Hello world!"` 이렇게 말이지.

# 직접 해보기

우리 앱에서 좀비 몇 마리를 생성하기를 원할 것이네! 좀비들이 다양한 특성을 가질 것이니 구조체를 활용하기에 안성맞춤이군.

1. `Zombie`라는 `struct`를 생성한다.

2. 우리의 `Zombie` 구조체는 `name` (`string`형)과 `dna` (`uint`형)이라는 2가지 특성을 가진다.
