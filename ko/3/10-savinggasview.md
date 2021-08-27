---
title: "'View' 함수를 사용해 가스 절약하기"
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

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          // 자네의 함수를 여기에 만들게

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

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
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

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
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

        }

      }
---

엄청나군! 우리는 이제 더 높은 레벨의 좀비들에게 특별한 능력을 주었고, 이건 좀비 주인들이 그들의 좀비를 열심히 키우도록 장치가 될 것이네. 우리가 원한다면 이런 것들을 나중에 더 많이 추가할 수도 있지.

함수 하나를 더 만들어보세: 우리의 DApp은 사용자의 전체 좀비 군대를 볼 수 있는 메소드가 필요하네 - 이 메소드는 `getZombiesByOwner`라고 할 것이네.

이 함수는 블록체인에서 데이터를 읽기만 하면 되네. 그러니 우리는 이걸 `view` 함수로 만들 수 있지. 이 부분은 가스 최적화를 말할 때 가장 중요한 내용이기도 하네.

## View 함수는 가스를 소모하지 않네

`view` 함수는 사용자에 의해 외부에서 호출되었을 때 가스를 전혀 소모하지 않네.

이건 `view` 함수가 블록체인 상에서 실제로 어떤 것도 수정하지 않기 떄문이네 - 데이터를 읽기만 하지. 그러니 함수에 `view` 표시를 하는 것은 `web3.js`에 이렇게 말하는 것과 같네. "이 함수는 실행할 때 자네 로컬 이더리움 노드에 질의만 날리면 되고, 블록체인에 어떤 트랜잭션도 만들지 않아"(트랜잭션은 모든 개별 노드에서 실행되어야 하고, 가스를 소모하네).

자네의 고유 노드로 web3.js를 설정하는 것은 나중에 다룰 것이네. 지금은 자네가 사용자들을 위해 DApp의 가스 사용을 최적화하는 비결은 가능한 모든 곳에 읽기 전용의 `external view` 함수를 쓰는 것이라는 것만 명심해두게.

> 참고: 만약 `view` 함수가 동일 컨트랙트 내에 있는, `view` 함수가 **아닌** 다른 함수에서 내부적으로 호출될 경우, 여전히 가스를 소모할 것이네. 이것은 다른 함수가 이더리움에 트랜잭션을 생성하고, 이는 모든 개별 노드에서 검증되어야 하기 때문이네. 그러니 `view` 함수는 외부에서 호출됐을 때에만 무료라네.

## 직접 해보기

우리는 사용자의 전체 좀비 군대를 반환하는 함수를 구현할 것이네. 우리가 만약 사용자들의 프로필 페이지에 그들의 전체 군대를 표시하고 싶다면, 나중에 이 함수를 `web3.js`에서 호출하면 된다네.

이 함수의 내용은 조금 복잡해서, 구현하는 데에 챕터 몇 개를 써야 할 것이네.

1. `getZombiesByOwner`라는 이름의 함수를 만들게. 이 함수는 `_owner`라는 이름의 `address`를 하나의 인수로 받을 것이네.

2. 이걸 `external view` 함수로 만들게. 우리는 이 함수를 `web3.js`에서 가스를 쓸 필요 없이 호출할 수 있을 것이네.

3. 이 함수는 `uint[]`를 반환해야 하네(`uint`의 배열).

지금은 함수의 내용을 비워두게. 다음 챕터에서 채워나갈 것이네.
