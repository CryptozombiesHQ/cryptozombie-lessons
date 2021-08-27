---
title: 종합하기
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
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
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

랜덤 좀비 생성기를 거의 다 완성해 가는군! 이제 모든 내용을 종합하는 public 함수를 생성해 보세. 

좀비의 이름을 입력값으로 받아 랜덤 DNA를 가진 좀비를 만드는 public 함수를 생성할 걸세. 

# 직접 해보기

1. `createPseudoRandomZombie`라는 `public`함수를 생성한다. 이 함수는 `_name`이라는 `string`형 인자를 하나 전달받는다. _(참고: 함수를 `private`로 선언한 것과 마찬가지로 함수를 `public`로 생성할 것)_

2. 이 함수의 첫 줄에서는 `_name`을 전달받은 `_generatePseudoRandomDna` 함수를 호출하고, 이 함수의 반환값을 `randDna`라는 `uint`형 변수에 저장해야 한다.

3. 두번째 줄에서는 `_createZombie` 함수를 호출하고 이 함수에 `_name`와 `randDna`를 전달해야 한다.

4. 함수의 내용을 닫는 `}`를 포함해서 코드가 4줄이어야 한다.
