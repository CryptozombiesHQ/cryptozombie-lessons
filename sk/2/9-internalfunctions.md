---
title: Niečo viac o viditelnosti funkcií
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
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

            // uprav túto definíciu funkcie
            function _createZombie(string _name, uint _dna) private {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
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
                _createZombie(_name, randDna);
            }

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

        }
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

          function _createZombie(string _name, uint _dna) internal {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
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
              _createZombie(_name, randDna);
          }

      }
---

**Kód ktorý z našej predošlej lekcie obstahuje chybu!**

Ak sa ho pokúsiš skompilovať, kompilátor vyhodí error.

Problém je ten, že sme sa pokúsili zavolať funkciu `_createZombie` z `ZombieFeeding`, no  `_createZombie` je deklarovaná ako `private` vo vnútri `ZombieFactory`. To znamená, že žiadny z kontraktov dediacich z `ZombieFactory` k tejto funkcii nebude mať prístup. 

## Internal a External

Okrem možných kategorií viditeľnosti funkcií  `public` a `private` existujú dve ďalšie možnosti: `internal` a `external`.

`internal` je to isté ako `private`, no s tým rozdielom, že je takáto funkcai bude prístupná ja kontraktom ktoré od kontraktu dedia. **(Hej, to znie ako to čo potrebujeme!)**

`external` je podobné ako `public`, no s rozdielom že takáto funkcia bude môcť byť zavolaná IBA mimo kontraktu - nebude môcť byť zavolana z ostatných funkcií rovnakého kontraktu. O tom, kedy sa hodí použiť `external` versus `public` si povieme neskôr.

Na deklaráciu `internal` alebo `external` funkcií sa používa syntax rovnaká ako pre `private` a `public` funkcie:

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // Funkciu eat() môžme zavolať lebo je internal
    eat();
  }
}
```

# Vyskúšaj si to sám

1. Zmeň  `_createZombie()` z `private` na `internal` aby k nej ostatné kontrakty získali prístup.

  Rovno sme ťa prepli na tab súboru, v ktorom musíš spraviť zmenu - `zombiefactory.sol`.
