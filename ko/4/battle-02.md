---
title: 난수(Random Numbers)
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // 여기서 시작하게
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
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
      import "./zombiehelper.sol";

      contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
      }

---

훌륭하군! 이제 우리의 전투 구조를 이해해보세.

모든 좋은 게임들은 일정 수준의 무작위성을 필요로 하네. 그럼 솔리디티에서는 어떻게 난수를 발생시키겠는가?

이에 대한 진정한 답은, 자네는 할 수 없다는 것이네. 글쎄, 적어도 안전하게 할 수는 없네.

왜 그런지 알아보세.

## `keccak256`을 통한 난수 생성

솔리디티에서 난수를 만들기에 가장 좋은 방법은 `keccak256` 해시 함수를 쓰는 것이네.

다음과 같은 방식으로 난수를 만들어낼 수 있네:

```
// Generate a random number between 1 and 100:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

이 예시에서는 `now`의 타임스탬프 값, `msg.sender`, 증가하는 `nonce`(딱 한 번만 사용되는 숫자, 즉 똑같은 입력으로 두 번 이상 동일한 해시 함수를 실행할 수 없게 함)를 받고 있네.

그리고서 `keccak`을 사용하여 이 입력들을 임의의 해시 값으로 변환하고, 변환한 해시 값을 `uint`로 바꾼 후, `% 100`을 써서 마지막 2자리 숫자만 받도록 했네. 이를 통해 0과 99 사이의 완전한 난수를 얻을 수 있네.


### 이 메소드는 정직하지 않은 노드의 공격에 취약하네.

이더리움에서는 자네가 컨트랙트의 함수를 실행하면 **_트랜잭션(transaction)_**으로서 네트워크의 노드 하나 혹은 여러 노드에 실행을 알리게 되네. 그 후 네트워크의 노드들은 여러 개의 트랜잭션을 모으고, "작업 증명"으로 알려진 계산이 매우 복잡한 수학적 문제를 먼저 풀기 위한 시도를 하게 되네. 그리고서 해당 트랜잭션 그룹을 그들의 작업 증명(PoW)과 함께 **_블록_**으로 네트워크에 배포하게 되지.

한 노드가 어떤 PoW를 풀면, 다른 노드들은 그 PoW를 풀려는 시도를 멈추고 해당 노드가 보낸 트랜잭션 목록이 유효한 것인지 검증하네. 유효하다면 해당 블록을 받아들이고 다음 블록을 풀기 시작하지.

**이것이 우리의 난수 함수를 취약하게 만드네.**

우리가 동전 던지기 컨트랙트를 사용한다고 해보지 - 앞면이 나오면 돈이 두 배가 되고, 뒷면이 나오면 모두 다 잃는 것이네. 앞뒷면을 결정할 때 위에서 본 난수 함수를 사용한다고 가정해보세. (`random >= 50`은 앞면, `random < 50`은 뒷면이네).

내가 만약 노드를 실행하고 있다면, 나는 **오직 나의 노드에만** 트랜잭션을 알리고 이것을 공유하지 않을 수 있네. 그 후 내가 이기는지 확인하기 위해 동전 던지기 함수를 실행할 수 있지 - 그리고 만약 내가 진다면, 내가 풀고 있는 다음 블록에 해당 트랜잭션을 포함하지 않는 것을 선택하지. 난 이것을 내가 결국 동전 던지기에서 이기고 다음 블록을 풀 때까지 무한대로 반복할 수 있고, 이득을 볼 수 있네.

## 그럼 이더리움에서는 어떻게 난수를 안전하게 만들어낼 수 있을까?

블록체인의 전체 내용은 모든 참여자에게 공개되므로, 이건 풀기 어려운 문제이고 그 해답은 이 튜토리얼에를 벗어나네. 해결 방법들에 대해 궁금하다면 <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>이 StackOverflow 글</a>을 읽어보게. 하나의 방법은 이더리움 블록체인 외부의 난수 함수에 접근할 수 있도록 **_오라클_**을 사용하는 것이네. 

물론, 네트워크 상의 수만 개의 이더리움 노드들이 다음 블록을 풀기 위해 경쟁하고 있으니, 내가 다음 블록을 풀 확률은 매우 낮을 것이네. 위에서 말한 부당한 방법을 쓰는 것은 많은 시간과 연산 자원을 필요로 할 것이야 - 하지만 보상이 충분히 크다면(내가 천억 원을 걸 수 있다든지?), 공격할 만한 가치가 있을 것이네.

그러니 이런 난수 생성은 이더리움 상에서 안전하지는 않지만, 실제로는 난수 함수가 즉시 큰 돈이 되지 않는 한, 자네 게임의 사용자들은 게임을 공격할 만한 충분한 자원을 들이지 않을 것이네.

이 튜토리얼에서는 시연 목적으로 간단한 게임을 만들고 있고 바로 돈이 되는 게 없기 때문에, 우린 구현하기 간단한 난수 생성기를 사용하는 것으로 타협할 것이네. 이게 완전히 안전하지는 않다는 걸 알긴 하지만 말이야.

향후 레슨에서는, 우린 **_oracle_**(이더리움 외부에서 데이터를 받아오는 안전한 방법 중 하나)을 사용해서 블록체인 밖에서 안전한 난수를 만드는 방법을 다룰 수도 있네.

## 직접 해보기

공격에서 완전히 안전하지는 않더라도, 전투의 결과를 결정하는 데에 사용할 수 있는 난수 함수를 구현해보세.

1. 컨트랙트에 `randNonce`라는 이름의 `uint` 타입 변수를 추가하고, `0`을 대입하게.

2. `randMod`(random-modulus)라는 이름의 함수를 생성하게. 이 함수는 `_modulus`라는 이름의 `uint` 타입 변수를 받는 `internal` 함수일 것이고, `uint` 타입을 반환(`returns`)할 것이네. 

3. 해당 함수는 먼저 `randNonce`를 하나 증가시킬 것이네(`randNonce++` 문법을 사용하게).

4. 마지막으로, (한 줄의 코드로)`now`, `msg.sender`, `randNonce`의 `keccak256` 해시 값을 계산하고 `uint`로 변환해야 하네 - 그리고 그 값 `% _modulus`를 한 후 `return`해야 하네(후, 내용이 아주 장황헀군. 잘 이해가 안 된다면, 위에서 우리가 난수를 만들었던 예시를 보게 - 구조가 매우 유사하네).
