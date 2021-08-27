---
title: Niečo viac o funkcných modifikátoroch
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

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

      }
---

Super! Náš zombie má teraz funkčný odpočinkový časovač.

Teraz ideme pridať pár ďalších pomocných funkcií. Vytvorili sme ti nový subor s názvom `zombiehelper.sol`. Ten importuje `zombiefeeding.sol` aby sme udržali kód prehľadne zorganizovaný.

Poďme spraviť potrebné úpravy na to, aby naši zombie  po dosiahnutí určitého levelu získali špeciálne vlasnosti. Najprv sa však musíme naučiť niečo viac o funkčných modifikátoroch.

## Funkčné modifikátory s argumentami

Doposiaľ sme videli len jednoduchý príklad modifikátoru - `onlyOwner`. Funkčné modifikátory však môžu príjmať aj argumenty. Napríklad:

```
// Mapovanie ktoré udržuje vek užívateľa:
mapping (uint => uint) public age;

// Modifikátor ktorý vyžaduje aby užívateľ bol určitého veku:
modifier olderThan(uint _age, uint _userId) {
  require(age[_userId] >= _age);
  _;
}
// Musí byť starší ako 16 rokov, aby mohol šoférovať
// Môžeme zavolať `olderThan` modifikátor s argumentom takto:
function driveCar(uint _userId) public olderThan(16, _userId) {
  // Nejaká business logika funkcie
}
```

Ako vidíš, modifikátor `olderThan` príjma arugmenty rovnako ako obyčajná funkcia. A je to práve funkcia `driveCar` ktorá modifikátoru argument posiela. 

Poďme skúsiť spraviť náš vlastný `modifier` ktorý bude používať `level` atribút zombie, aby obmedzil prístup ku špeciálnym zombie schopnostiam.

## Vyskúšaj si to sám
1. V kontrakte `ZombieHelper` vytvor `modifier` s názvom `aboveLevel`. Bude príjmať dva argumenty, `_level` (typu `uint`) a `_zombieId` (taktiež `uint`).

2. Telo modifikátora by malo skontrolovať, že `zombies[_zombieId].level` je viac alebo sa rovná `_level`.

3. Pamataj na to, že posledný riadok modifikátoru musí byť `_;`, aby v prípade splnenej podmienky tok kódu pokračoval do pôvodnej, užívateľom volanej funkcie.
