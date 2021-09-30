---
title: Storage vs Memory
actions: ['정답 확인하기', '힌트 보기']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // 여기서 시작

        }
      "zombiefactory.sol": |
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
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

솔리디티에는 변수를 저장할 수 있는 공간으로 `storage`와 `memory` 두 가지가 있지.

**_Storage_**는 블록체인 상에 영구적으로 저장되는 변수를 의미하지. **_Memory_**는 임시적으로 저장되는 변수로, 컨트랙트 함수에 대한 외부 호출들이 일어나는 사이에 지워지지. 두 변수는 각각 컴퓨터 하드 디스크와 RAM과 같지. 

대부분의 경우에 자네는 이런 키워드들을 이용할 필요가 없네. 왜냐면 솔리디티가 알아서 처리해 주기 때문이지. 상태 변수(함수 외부에 선언된 변수)는 초기 설정상 `storage`로 선언되어 블록체인에 영구적으로 저장되는 반면, 함수 내에 선언된 변수는 `memory`로 자동 선언되어서 함수 호출이 종료되면 사라지지.

하지만 이 키워드들을 사용해야 하는 때가 있지. 바로 함수 내의 **_구조체_**와 **_배열_**을 처리할 때지:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ 꽤 간단해 보이나, 솔리디티는 여기서 
    // `storage`나 `memory`를 명시적으로 선언해야 한다는 경고 메시지를 발생한다. 
    // 그러므로 `storage` 키워드를 활용하여 다음과 같이 선언해야 한다:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...이 경우, `mySandwich`는 저장된 `sandwiches[_index]`를 가리키는 포인터이다.
    // 그리고 
    mySandwich.status = "Eaten!";
    // ...이 코드는 블록체인 상에서 `sandwiches[_index]`을 영구적으로 변경한다. 

    // 단순히 복사를 하고자 한다면 `memory`를 이용하면 된다: 
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...이 경우, `anotherSandwich`는 단순히 메모리에 데이터를 복사하는 것이 된다. 
    // 그리고 
    anotherSandwich.status = "Eaten!";
    // ...이 코드는 임시 변수인 `anotherSandwich`를 변경하는 것으로 
    // `sandwiches[_index + 1]`에는 아무런 영향을 끼치지 않는다. 그러나 다음과 같이 코드를 작성할 수 있다: 
    sandwiches[_index + 1] = anotherSandwich;
    // ...이는 임시 변경한 내용을 블록체인 저장소에 저장하고자 하는 경우이다.
  }
}
```

어떤 키워드를 이용해야 하는지 정확하게 이해하지 못한다고 해도 걱정 말게. 이 튜토리얼을 진행하는 동안 언제 `storage` 혹은 `memory`를 사용해야 하는지 알려 주겠네. 솔리디티 컴파일러도 경고 메시지를 통해 어떤 키워드를 사용해야 하는지 알려 줄 것이네. 

지금으로선 명시적으로 `storage`나 `memory`를 선언할 필요가 있는 경우가 있다는 걸 이해하는 것만으로 충분하네!

# 직접 해보기

먹이를 먹고 번식하는 능력을 우리 좀비들에게 부여할 시간이네!

좀비가 어떤 다른 생명체를 잡아 먹을 때, 좀비 DNA가 생명체의 DNA와 혼합되어 새로운 좀비가 생성될 것이네. 

1. `feedAndMultiply`라는 함수를 생성한다. 이 함수는 `uint`형인 `_zombieId` 및 `_targetDna`을 전달받는다. 이 함수는 `public`으로 선언되어야 한다.

2. 다른 누군가가 우리 좀비에게 먹이를 주는 것을 원치 않는다. 그러므로 주인만이 좀비에게 먹이를 줄 수 있도록 한다. `require` 구문을 추가하여 `msg.sender`가 좀비 주인과 동일하도록 한다. (이는 `createPseudoRandomZombie` 함수에서 쓰인 방법과 동일하다)

 > 참고: 다시 말하지만, 우리가 작성한 확인 기능은 기초적이기 때문에 컴파일러는 `msg.sender`가 먼저 나올 것을 기대하고, 항의 순서를 바꾸면 잘못된 값이 입력되었다고 할 걸세. 하지만 보통 코드를 작성할 때 항의 순서는 자네가 원하는 대로 정하면 되네. 어떤 경우든 참이 되거든. 

3. 먹이를 먹는 좀비 DNA를 얻을 필요가 있으므로, 그 다음으로 `myZombie`라는 `Zombie`형 변수를 선언한다 (이는 `storage` 포인터가 될 것이다). 이 변수에 `zombies` 배열의 `_zombieId` 인덱스가 가진 값에 부여한다. 

자네 코드는 마지막 `}`를 포함해서 4줄이어야 하네. 

다음 챕터에서 이 함수의 내용을 계속해서 작성할 걸세! 
