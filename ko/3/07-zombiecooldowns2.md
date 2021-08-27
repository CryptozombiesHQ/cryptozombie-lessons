---
title: Public 함수 & 보안
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
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

          // 1. 이 함수를 internal로 만들게
          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // 2. 여기에 `_isReady`를 확인하는 부분을 추가하게
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            // 3. `_triggerCooldown`을 호출하게
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
---

이제 `feedAndMultiply`를 우리의 재사용 대기 시간 타이머를 고려하도록 수정해보게.

이 함수를 다시 살펴보면, 우리가 이전 레슨에서 이 함수를 `public`으로 만들었던 것을 볼 수 있을 것이네. 보안을 점검하는 좋은 방법은 자네의 모든 `public`과 `external` 함수를 검사하고, 사용자들이 그 함수들을 남용할 수 있는 방법을 생각해보는 것이네. 이걸 기억하시게 - 이 함수들이 `onlyOwner` 같은 제어자를 갖지 않는 이상, 어떤 사용자든 이 함수들을 호출하고 자신들이 원하는 모든 데이터를 함수에 전달할 수 있네.

위의 함수를 다시 살펴보면, 사용자들은 이 함수를 직접적으로 호출할 수 있고 그들이 원하는 아무 `_targetDna`나 `_species`를 전달할 수 있네. 이건 정말 게임 같지는 않군 - 우리는 그들이 우리의 규칙을 따르길 바라네!

좀 더 자세히 들여보면, 이 함수는 오직 `feedOnKitty()`에 의해서만 호출이 될 필요가 있네. 그러니 이런 남용을 막을 가장 쉬운 방법은 이 함수를 `internal`로 만드는 것이지.

## 직접 해보기

1. 현재 `feedAndMultiply`는 `public` 함수이네. 이걸 `internal`로 만들어서 컨트랙트가 더 안전해지도록 하세. 우리는 사용자들이 그들이 원하는 아무 DNA나 넣어서 이 함수를 실행하는 것을 원하지 않네.

2. `feedAndMultiply` 함수가 `cooldownTime`을 고려하도록 만들어보세. 먼저, `myZombie`를 찾은 후에, `_isReady()`를 확인하는 `require` 문장을 추가하고 거기에 `myZombie`를 전달하게. 이렇게 하면 사용자들은 좀비의 재사용 대기 시간이 끝난 다음에만 이 함수를 실행할 수 있네.

3. 함수의 끝에서 `_triggerCooldown(myZombie)` 함수를 호출하여 먹이를 먹는 것이 좀비의 재사용 대기 시간을 만들도록 하게.
