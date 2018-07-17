---
title: Zombie Modifikátory
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

          // Začni písať tu

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

      }
---

Teraz pri vytváraní pár funkcií použijeme náš nový modifikátor `aboveLevel`  

Naša hra bude mať obsahovať stimuly dávajúce hráčom motiváciu levelovať svojich zombie:

- Pre zombie od levelu 2 a vyššie budú užívatelia mať možnosť im nastaviť meno.
- Pre zombie od levelu 20 a vyššie im budú môcť nastaviť vlastné DNA.

Túto funkcionalitu implementujeme v tejto kapitole. Pre referenciu, tu je ukážka kódu z predošlej lekcie:

```
// Mapovanie ktoré obstahuje vek užívateľov
mapping (uint => uint) public age;

// Vyžaduj aby užívateľ dosiahol určitú vekovú hranicu
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

// Musí byť starší ako 16 rokov (aspoň take je to v Amerike)
function driveCar(uint _userId) public olderThan(16, _userId) {
  // Some function logic
}
```

## Vyskúšaj si to sám

1. Vytvor funkciu s názvom `changeName`. Bude príjmať 2 argumenty: `_zombieId` (typu `uint`), and `_newName` (typu `string`). Nezabudni spraviť túto funkciu `external`. Taktiež by mala používať `aboveLevel` modifikátor, ktorému by mala podsunúť parameter `_level` s hodnotou `2`. (taktiež však nezabudni podsunúť parameter `_zombieId`).

2. V tejto funkcii najprv skontroluj, že `msg.sender` je rovný `zombieToOwner[_zombieId]`. Použi na to `require`.

3. V tejto funkcii potom priraď `zombies[_zombieId].name` hodnotu `_newName`.

4. Pod funkciou `changeName` vytvor ďalšiu funkciu s názvom `changeDna`. Jej definícia a obsah bude skoro identický ako `changeName`, s rozdielom že druhý argument bude `_newDna` (typu `uint`). Ďalší rozdiel bude v hodnote argumentu `_level` poslaného jej modifikátoru `aboveLevel` - hodnotu tohoto argumentu nastavíme na `20`. No a samozrejme, namiesto zmeny mena zombie v tejto funkcií nastavíme hodnotu `dna` daného zombie na hodnotu rovnú `_newDna`.
