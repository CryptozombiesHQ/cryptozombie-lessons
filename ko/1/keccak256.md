---
title: Keccak256과 형 변환
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              // 여기서 시작
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

우리가 `_generatePseudoRandomDna` 함수의 반환값이 (반) 랜덤인 `uint`가 되기를 원하면, 어떻게 하면 되겠는가?

이더리움은 SHA3의 한 버전인 `keccak256`를 내장 해시 함수로 가지고 있지. 해시 함수는 기본적으로 입력 스트링을 랜덤 256비트 16진수로 매핑하네. 스트링에 약간의 변화라도 있으면 해시 값은 크게 달라지네. 

해시 함수는 이더리움에서 여러 용도로 활용되지만, 여기서는 의사 난수 발생기(pseudo-random number generator)로 이용하도록 하지.

예시:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

이 예시를 보면 입력값의 한 글자가 달라졌음에도 불구하고 반환값은 완전히 달라짐을 알 수 있지. 

> 참고: 블록체인에서 **안전한** 의사 난수 발생기는 매우 어려운 문제네. 여기서 우리가 활용한 방법은 안전하지는 않지만, 좀비 DNA에 있어서 보안은 최우선순위가 아니니 우리의 목적에는 충분히 적합할 것이네. 

## 형 변환

가끔씩 자네가 자료형 간에 변환을 할 필요가 있지. 다음 예시를 살펴보세:

```
uint8 a = 5;
uint b = 6;
// a * b가 uint8이 아닌 uint를 반환하기 때문에 에러 메시지가 난다:
uint8 c = a * b; 
// b를 uint8으로 형 변환해서 코드가 제대로 작동하도록 해야 한다:
uint8 c = a * uint8(b); 
```

위의 예시에서 `a * b`는 `uint`를 반환하지. 하지만 우리는 이 반환값을 `uint8`에 저장하려고 하니 잠재적으로 문제를 야기할 수 있네. 반환값을 `uint8`으로 형 변환하면 코드가 제대로 작동하고 컴파일러도 에러 메시지를 주지 않을 걸세.

# 직접 해보기

`_generatePseudoRandomDna` 함수의 내용을 채워 보세! 여기에 함수가 무엇을 해야 하는지 나와 있네:

1. 코드 첫 줄에서는 `_str`을 이용한 `keccak256` 해시값을 받아서 의사 난수 16진수를 생성하고 이를 `uint`로 형 변환한 다음, `rand`라는 `uint`에 결과값을 저장해야 한다. 

2. 우리는 좀비의 DNA가 16자리 숫자이기만을 원하므로(`dnaModulus`를 기억하나?) 코드의 두번째 줄에서는 위의 결과 값을 모듈로(`%`) `dnaModulus`로 연산한 값을 반환해야 한다. (형식: `return` `위의 결과 값` `%` `dnaModulus`).
