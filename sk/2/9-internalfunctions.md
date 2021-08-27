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
---

**Kód ktorý z našej predošlej lekcie obsahuje chybu!**

Ak sa ho pokúsiš skompilovať, kompilátor vyhodí error.

Problém je ten, že sme sa pokúsili zavolať funkciu `_createZombie` z `ZombieFeeding`, no  `_createZombie` je deklarovaná ako `private` vo vnútri `ZombieFactory`. To znamená, že žiadny z kontraktov dediacich z `ZombieFactory` k tejto funkcii nebude mať prístup. 

## Internal a External

Okrem spomínaných kategorií viditeľnosti funkcií, `public` a `private`, existujú dve ďalšie možnosti. Sú to `internal` a `external`.

`internal` je to isté ako `private`, no s rozdielom, že takáto funkcia bude prístupná len dediacim kontraktom. **(Hej!! To znie ako to, čo tu teraz potrebujeme!)**

`external` je podobné ako `public`, no s rozdielom, že takáto funkcia môže byť zavolaná IBA mimo kontraktu. Nemôže byť zavolaná z ostatných funkcií rovnakého kontraktu. O tom, kedy sa hodí použiť `external` versus `public` si povieme neskôr.

Na deklaráciu `internal` alebo `external` funkcií sa používa taká istá syntax, ako pre `private` a `public` funkcie:

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

1. Zmeň `_createZombie()` z `private` na `internal` aby k tejto funkcii získali prístup dediace kontrakty.

  Rovno sme ťa prepli do tabu súboru v ktorom musíš spraviť zmenu - `zombiefactory.sol`.
