---
title: 상속
actions: ['정답 확인하기', '힌트 보기']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // 여기서 시작

    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      contract ZombieFeeding is ZombieFactory {

      }

---

우리의 게임 코드가 꽤 길어지고 있군. 엄청나게 긴 컨트랙트 하나를 만들기 보다는 코드를 잘 정리해서 여러 컨트랙트에 코드 로직을 나누는 것이 합리적일 때가 있지. 

이를 보다 관리하기 쉽도록 하는 솔리디티 기능이 바로 컨트랙트 **_상속_**이지:

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

`BabyDoge` 컨트랙트는 `Doge` 컨트랙트를 상속하네. 즉, 자네가 `BabyDoge` 컨트랙트를 컴파일해서 구축할 때, `BabyDoge` 컨트랙트가 `catchphrase()` 함수와 `anotherCatchphrase()` 함수에 모두 접근할 수 있다는 뜻이지. (`Doge` 컨트랙트에 정의되는 다른 어떤 public 함수가 정의되어도 접근이 가능하네)  

상속 개념은 "`고양이`는 `동물`이다"의 경우처럼 부분집합 클래스가 있을 때 논리적 상속을 위해 활용할 수 있지. 하지만 동일한 로직을 다수의 클래스로 분할해서 단순히 코드를 정리할 때도 활용할 수 있지. 

# 직접 해보기

다음 챕터에서 우리 좀비들이 먹이를 먹고 번식하도록 하는 기능을 구현할 것일세. 그 기능의 로직을 `ZombieFactory`의 모든 메소드를 상속하는 클래스에 넣어 보도록 하세.  

1. `ZombieFactory` 아래에 `ZombieFeeding` 컨트랙트를 생성한다. 이 컨트랙트는 `ZombieFactory`를 상속해야 한다.
