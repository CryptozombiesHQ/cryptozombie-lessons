---
title: 배열
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

      }
---

어떤 것의 모음집이 필요할 때 **_배열_**을 사용할 수 있네. 솔리디티에는 **_정적_** 배열과 **_동적_** 배열이라는 두 종류의 배열이 있지:

```
// 2개의 원소를 담을 수 있는 고정 길이의 배열:
uint[2] fixedArray;
// 또다른 고정 배열으로 5개의 스트링을 담을 수 있다:
string[5] stringArray;
// 동적 배열은 고정된 크기가 없으며 계속 크기가 커질 수 있다:
uint[] dynamicArray;
```

**_구조체_**의 배열을 생성할 수도 있다. 이전 챕터의 `Person` 구조체를 이용하면:

```
Person[] people; // 이는 동적 배열로, 원소를 계속 추가할 수 있다.
```

상태 변수가 블록체인에 영구적으로 저장될 수 있다는 걸 기억하나? 그러니 이처럼 구조체의 동적 배열을 생성하면 마치 데이터베이스처럼 컨트랙트에 구조화된 데이터를 저장하는 데 유용하네.

## Public 배열

`public`으로 배열을 선언할 수 있지. 솔리디티는 이런 배열을 위해 **_getter_** 메소드를 자동적으로 생성하지. 구문은 다음과 같네:

```
Person[] public people;
```

그러면 다른 컨트랙트들이 이 배열을 읽을 수 있게 되지 (쓸 수는 없네). 이는 컨트랙트에 공개 데이터를 저장할 때 유용한 패턴이지.

# 직접 해보기

우리 앱에 좀비 군대를 저장하고 싶네. 그리고 우리 좀비들을 다른 앱에 자랑하고 싶네. 그러니 좀비 군대 저장소를 public으로 해야 하네.

1. `Zombie` **_구조체_**의 public 배열을 생성하고 이름을 `zombies`로 한다.
