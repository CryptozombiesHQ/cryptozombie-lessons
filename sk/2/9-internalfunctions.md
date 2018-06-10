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
**The code in our previous lesson has a mistake!**

Ak sa ho pokúsiš skompilovať, kompilátor vyhodí error.
If you try compiling it, the compiler will throw an error.

Problém je ten, že sme sa pokúsili zavolať funkciu `_createZombie` z `ZombieFeeding`, no  `_createZombie` je deklarovaná ako `private` vo vnútri `ZombieFactory`. To znamená, že žiadny z kontraktov dediacich z `ZombieFactory` k tejto funkcii nebude mať prístup. 
The issue is we tried calling the `_createZombie` function from within `ZombieFeeding`, but `_createZombie` is a `private` function inside `ZombieFactory`. This means none of the contracts that inherit from `ZombieFactory` can access it.

## Internal a External

Okrem možných kategorií viditeľnosti funkcií  `public` a `private` existujú dve ďalšie možnosti: `internal` a `external`.
In addition to `public` and `private`, Solidity has two more types of visibility for functions: `internal` and `external`.

`internal` je to isté ako `private`, no s tým rozdielom, že je takáto funkcai bude prístupná ja kontraktom ktoré od kontraktu dedia. **(Hej, to znie ako to čo potrebujeme!)**
`internal` is the same as `private`, except that it's also accessible to contracts that inherit from this contract. **(Hey, that sounds like what we want here!)**.

`external` je podobné ako `public`, no s rozdielom že takáto funkcia bude môcť byť zavolaná IBA mimo kontraktu - nebude môcť byť zavolana z ostatných funkcií rovnakého kontraktu. O tom, kedy sa hodí použiť `external` versus `public` si povieme neskôr.
`external` is similar to `public`, except that these functions can ONLY be called outside the contract — they can't be called by other functions inside that contract. We'll talk about why you might want to use `external` vs `public` later.

Na deklaráciu `internal` alebo `external` funkcií sa používa syntax rovnaká ako pre `private` a `public` funkcie.
For declaring `internal` or `external` functions, the syntax is the same as `private` and `public`:

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
# Put it to the test

1. Zmeň  `_createZombie()` z `private` na `internal` aby k nej ostatné kontrakty získali prístup.
1. Change `_createZombie()` from `private` to `internal` so our other contract can access it.

  Rovno sme ti prepli fokus naspäť na správny tab, `zombiefactory.sol`.
  We've already focused you back to the proper tab, `zombiefactory.sol`.
