---
title: Import
actions: ['정답 확인하기', '힌트 보기']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // 여기에 import 구문을 넣기

        contract ZombieFeeding is ZombieFactory {

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

      }

---

와우! 우리가 방금 코드를 오른편으로 정리했다는 걸 알 수 있을 걸세. 이제 에디터의 상단부에 탭들이 있네. 탭들을 클릭해서 살펴보도록 하게.

우리 코드가 꽤 길어지고 있으니, 여러 파일로 나누어 정리하면 관리하기 더 편하겠지. 보통 이런 방식으로 솔리디티 프로젝트의 긴 코드를 처리할 것이네.

다수의 파일이 있고 어떤 파일을 다른 파일로 불러오고 싶을 때, 솔리디티는 `import`라는 키워드를 이용하지: 

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

이 컨트랙트와 동일한 폴더에 (이게 `./`가 의미하는 바임) `someothercontract.sol`이라는 파일이 있을 때, 이 파일을 컴파일러가 불러오게 되지. 

# 직접 해보기

다수의 파일이 있는 구조를 갖추었으니 `import`를 활용하여 다른 파일의 내용을 읽어올 필요가 있네. 

1. 새로운 파일 `zombiefeeding.sol`에 `zombiefactory.sol`를 불러 온다(`import`). 
