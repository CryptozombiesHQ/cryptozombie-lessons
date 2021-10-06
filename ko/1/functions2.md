---
title: Private / Public 함수
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

          function createZombie(string memory _name, uint _dna) public {
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

솔리디티에서 함수는 기본적으로 `public`으로 선언되네. 즉, 누구나 (혹은 다른 어느 컨트랙트가) 자네 컨트랙트의 함수를 호출하고 코드를 실행할 수 있다는 의미지.

확실히 이는 항상 바람직한 건 아닐 뿐더러, 자네 컨트랙트를 공격에 취약하게 만들 수 있지. 그러니 기본적으로 함수를 `private`으로 선언하고, 공개할 함수만 `public`으로 선언하는 것이 좋지.

private 함수를 선언하는 방법을 살펴보도록 하겠네:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

private는 컨트랙트 내의 다른 함수들만이 이 함수를 호출하여 `numbers` 배열로 무언가를 추가할 수 있다는 것을 의미하지.

위의 예시에서 볼 수 있듯이 `private` 키워드는 함수명 다음에 적네. 함수 인자명과 마찬가지로 private 함수명도 언더바(`_`)로 시작하는 것이 관례라네.

# 직접 해보기

우리 컨트랙트의 `createZombie` 함수는 현재 기본적으로 public으로 선언되어 있네. 즉, 누구나 이 함수를 호출해서 새로운 좀비를 컨트랙트에서 만들 수 있다는 뜻이지! 이 함수를 private로 선언해 보세.

1. `createZombie` 함수를 변경하여 private 함수로 만든다. 함수명에 대한 관례를 잊지 말 것!
