---
title: Payable
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          // 1. 여기에 levelUpFee를 정의하게

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. 여기에 levelUp 함수를 삽입하게

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
          }

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }
        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

지금까지 우린 꽤 많은 **_함수 제어자(function modifier)_**를 다뤘네. 모든 것을 다 기억하는 것은 힘들 것이니, 한번 빠르게 복습해보세.

1. 우린 함수가 언제, 어디서 호출될 수 있는지 제어하는 접근 제어자(visibility modifier)를 알게 되었네: `private`은 컨트랙트 내부의 다른 함수들에서만 호출될 수 있음을 의미하지. `internal`은 `private`과 비슷하지만, 해당 컨트랙트를 상속하는 컨트랙트에서도 호출될 수 있지. `external`은 오직 컨트랙트 외부에서만 호출될 수 있네. 마지막으로 `public`은 내외부 모두에서, 어디서든 호출될 수 있네.

2. 또한 상태 제어자(state modifier)에 대해서도 배웠네. 이 제어자는 블록체인과 상호작용 하는 방법에 대해 알려주지: `view`는 해당 함수를 실행해도 어떤 데이터도 저장/변경되지 않음을 알려주지. `pure`는 해당 함수가 어떤 데이터도 블록체인에 저장하지 않을 뿐만 아니라, 블록체인으로부터 어떤 데이터도 읽지 않음을 알려주지. 이들 모두는 컨트랙트 외부에서 불렸을 때 가스를 전혀 소모하지 않네(하지만 다른 함수에 의해 내부적으로 호출됐을 경우에는 가스를 소모하지).

3. 그리고 사용자 정의 `제어자`에 대해서도 배웠네. 레슨 3에서 배웠던 것이지. 예를 들자면 `onlyOwner`와 `aboveLevel` 같은 것이지. 이런 제어자를 사용해서 우린 함수에 이 제어자들이 어떻게 영향을 줄지를 결정하는 우리만의 논리를 구성할 수 있네.

이런 제어자들은 함수 하나에 다음처럼 함께 사용할 수 있네:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

이번 챕터에서, 우린 함수 제어자를 하나 더 소개할 것이네: 바로 `payable`이지.

## `payable` 제어자

`payable` 함수는 솔리디티와 이더리움을 아주 멋지게 만드는 것 중 하나라네 - 이는 이더를 받을 수 있는 특별한 함수 유형이지.

충분히 이해할 수 있도록 잠시 시간을 갖지. 자네가 일반적인 웹 서버에서 API 함수를 실행할 때에는, 자네는 함수 호출을 통해서 US 달러를 보낼 수 없네 - 비트코인도 보낼 수 없지.

하지만 이더리움에서는, 돈(_이더_), 데이터(*transaction payload*), 그리고 컨트랙트 코드 자체 모두 이더리움 위에 존재하기 때문에, 자네가 함수를 실행하는 **동시에** 컨트랙트에 돈을 지불하는 것이 가능하네.

이를 통해 굉장히 흥미로운 구성을 만들어낼 수 있네. 함수를 실행하기 위해 컨트랙트에 일정 금액을 지불하게 하는 것과 같이 말이야.

## 예시를 한번 보세
```
contract OnlineStore {
  function buySomething() external payable {
    // 함수 실행에 0.001이더가 보내졌는지 확실히 하기 위해 확인:
    require(msg.value == 0.001 ether);
    // 보내졌다면, 함수를 호출한 자에게 디지털 아이템을 전달하기 위한 내용 구성:
    transferThing(msg.sender);
  }
}
```

여기서, `msg.value`는 컨트랙트로 이더가 얼마나 보내졌는지 확인하는 방법이고, `ether`는 기본적으로 포함된 단위이네.

여기서 일어나는 일은 누군가 web3.js(DApp의 자바스크립트 프론트엔드)에서 다음과 같이 함수를 실행할 때 발생하네:

```
// `OnlineStore`는 자네의 이더리움 상의 컨트랙트를 가리킨다고 가정하네:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

`value` 필드를 주목하게. 자바스크립트 함수 호출에서 이 필드를 통해 `ether`를 얼마나 보낼지 결정하네(여기서는 0.001이지). 트랜잭션을 봉투로 생각하고, 함수 호출에 전달하는 매개 변수를 자네가 써넣은 편지의 내용이라 생각한다면, `value`는 봉투 안에 현금을 넣는 것과 같네 - 편지와 돈이 모두 수령인에게 전달되지.

>참고: 만약 함수가 `payable`로 표시되지 않았는데 자네가 위에서 본 것처럼 이더를 보내려 한다면, 함수에서 자네의 트랜잭션을 거부할 것이네.

## 직접 해보기

이제 `payable` 함수를 우리의 좀비 게임에 만들어보세.

우리 게임에 좀비의 레벨업을 위해 사용자들이 ETH를 지불할 수 있는 기능이 있다고 가정해보지. ETH는 자네가 소유한 컨트랙트에 저장될 것이네 - 이는 자네의 게임을 통해 자네가 돈을 벌 수 있는 간단한 예시이네!

1. `uint` 타입의 `levelUpFee` 변수를 정의하고, 여기에 `0.001 ether`를 대입하게.

2. `levelUp`이라는 함수를 생성하게. 이 함수는 `_zombieId`라는 `uint` 타입의 매개변수 하나를 받을 것이네. 함수는 `external`이면서 `payable`이어야 하네.

3. 이 함수는 먼저 `msg.value`가 `levelUpFee`와 같은지 `require`로 확인해야 하네.

4. 그리고서 좀비의 `level`을 증가시켜야 하네: `zombies[_zombieId].level++`.
