---
title: `view` 함수로 가스 절약하기 
actions: ['정답 확인하기', '힌트 보기']
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

          // 여기에 함수 생성

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

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev Ownable 컨트랙트는 소유자 주소를 가지며, 기본적인 권한 통제 기능을 제공한다. 
         *      이로써 "유저 접근 제어"의 구현을 단순화한다. 
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev Ownable 컨트랙트는 컨트랙트의 원'소유자'를 sender 계정으로 설정한다.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev 소유자가 아닌 계정에 의해 호출되는 경우, 실행을 중단한다. 
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev 현 소유자가 컨트랙트 통제권을 새 소유자에게 넘겨 주도록 한다. 
           * @param newOwner 소유권을 넘겨 받는 주소.
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

멋지군! 이제 레벨이 높은 좀비를 위한 특수 능력을 갖추었으니 유저들이 좀비를 레벨 업하도록 유인할 수 있게 되었네. 나중에 이런 류의 기능을 좀더 추가할 수도 있을 것이네. 

함수 한 개를 더 추가해 보도록 하세: 우리 댑은 유저의 좀비 군대 전체를 볼 수 있는 메소드가 필요하네. 이 함수를 `getZombiesByOwner`라고 하지. 

이 함수는 블록체인에서 데이터를 읽기만 하면 되므로, `view` 함수로 만들 수 있지. 이 함수를 통해 가스 최적화라는 중요한 토픽에 대해 다뤄 보겠네:  This function will only need to read data from the blockchain, so we can make it a `view` function. Which brings us to an important topic when talking about gas optimization:

## View 함수를 호출하면 가스가 들지 않는다

`view` 함수는 유저가 외부에서 호출할 경우 가스를 소비하지 않지. 

왜냐면 `view` 함수가 블록체인 상에 있는 어떤 것도 변경하지 않고, 데이터를 읽기만 하기 때문이지. 그러니 함수를 `view`라고 표시하면 `web3.j`에게 함수 실행 시 로컬 이더리움 노드에만 쿼리할 필요가 있고 블록체인 상에 트랙잭션을 생성할 필요가 없다고 말하는 것이 되네 (트랙잭션을  생성하면 모든 노드에서 실행되어야 하니 가스가 들지). 

이후에 자네 노드를 가지고 web3.js를 셋업하는 내용을 다룰 것이네. 하지만 지금으로선 가능하면 읽기 전용 `external view` 함수를 이용해서 댑의 가스 사용량을 최적화할 수 있다는 게 제일 중요하네. 

> 참고: 동일 컨트랙트 내의 `view` 함수가 **아닌** 다른 함수가 `view` 함수를 내부적으로 호출하면 가스가 들 것이네. 왜냐면 `view` 함수를 호출하는 함수가 이더리움 상에 트랜잭션을 생성하여 각 노드가 이를 검증해야 하기 때문이지. 그러니 `view` 함수는 외부에서 호출될 때만 무료라네. 

## 직접 해보기

유저의 좀비 군대 전체를 반환하는 함수를 구현할 걸세. 유저 프로필 페이지에 좀비 군대 전체를 제시하기를 원하면 나중에 이 함수를 `web3.js`에서 호출할 수 있을 걸세. 

이 함수의 로직은 약간 복잡하니 몇 챕터에 걸쳐서 함수를 구현하도록 하겠네. 

1. `getZombiesByOwner`라는 함수를 생성하고, `address`형 `_owner`를 인자로 전달한다.

2. 이 함수를 `external view` 함수로 설정하여 무료로 `web3.js`에서 호출할 수 있도록 한다.

3. 이 함수가 `uint`의 배열인 `uint[]`을 반환하도록 한다.

지금으로선 함수를 비워 두도록 하게. 다음 챕터에서 채울 것이네.