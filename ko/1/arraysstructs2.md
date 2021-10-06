---
title: 구조체와 배열 활용하기
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

          function createZombie (string memory _name, uint _dna) public {
              // 여기서 시작
          }

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

          function createZombie (string memory _name, uint _dna) public {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### 새로운 구조체 생성하기

지난 예시의 `Person` 구조체를 기억하나?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

이제 새로운 `Person`를 생성하고 `people` 배열에 추가하는 방법을 살펴보도록 하지.

```
// 새로운 사람을 생성한다:
Person satoshi = Person(172, "Satoshi");

// 이 사람을 배열에 추가한다:
people.push(satoshi);
```

이 두 코드를 조합하여 깔끔하게 한 줄로 표현할 수 있네:

```
people.push(Person(16, "Vitalik"));
```

참고로 `array.push()`는 무언가를 배열의 **끝**에 추가해서 모든 원소가 순서를 유지하도록 하네. 다음 예시를 살펴보도록 하지:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers 배열은 [5, 10, 15]과 같다.
```

# 직접 해보기

createZombie 함수가 무언가 할 수 있도록 만들어 보세!

1. 함수에 코드를 넣어 새로운 `Zombie`를 생성하여 `zombies` 배열에 추가하도록 한다. 새로운 좀비를 위한 `name`과 `dna`는 `createZombie`함수의 인자값이어야 한다.
2. 코드를 한 줄로 간결하게 작성해 보자.
