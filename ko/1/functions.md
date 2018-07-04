---
title: 함수 선언
actions: ['정답 확인하기', '힌트 보기']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

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
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

솔라디티에서 함수 선언은 다음과 같이 하네:

```
function eatHamburgers(string _name, uint _amount) {

}
```

이 함수는 `eatHamburgers`라는 함수로, `string`과 `uint` 2개의 인자를 전달받고 있군. 현재로선 함수의 내용이 비어 있네.

> 참고: 함수 인자명을 언더바(`_`)로 시작해서 전역 변수와 구별하는 것이 관례이네 (의무는 아님). 본 튜토리얼 전체에서 이 관례를 따를 것이네.

이 함수를 다음과 같이 호출할 수 있지:

```
eatHamburgers("vitalik", 100);
```

# 직접 해보기

우리 앱에서 좀비들을 생성할 수 있을 필요가 있을 거네. 이를 위한 함수를 생성해 보세.

1. `createZombie`라는 함수를 생성한다. 이 함수는 다음 2개의 인자를 전달받아야 한다: **__name_** (`string`형)과 **__dna_** (`uint`형).

함수의 내용은 지금으로선 비어 두면 되네. 나중에 채울 것이니까.
