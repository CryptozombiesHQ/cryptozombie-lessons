---
title: Inheritance
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
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

      // Začni písať tu

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

      contract ZombieFeeding is ZombieFactory {

      }

---

Kód našej hry sa začína celkom predlžovať. Namiesto toho aby sme robili náš kontrakt extrémne dlhý, občas dáva zmysel rozdeliť logiku kódu do niekoľkých kontraktov a tak lepšie zorganizovať kód aplikácie.
Our game code is getting quite long. Rather than making one extremely long contract, sometimes it makes sense to split your code logic across multiple contracts to organize the code.

Jedna z vlastností Solidity ktorá zľahčuje prácu s kódom je **_dedičnosť_** kontraktov:
One feature of Solidity that makes this more manageable is contract **_inheritance_**:

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

`BabyDoge` **_dedí_** z kontraktu `Doge`. To znamená, že ak skompiluješ a nasadíš na blockchain `BabyDoge`, bude mať k dispozícií oboje `catchphrase()` and `anotherCatchphrase()` (a taktiež akékoľvek iné funkcie ktoré by sme definovali na `Doge`).
`BabyDoge` **_inherits_** from `Doge`. That means if you compile and deploy `BabyDoge`, it will have access to both `catchphrase()` and `anotherCatchphrase()` (and any other public functions we may define on `Doge`).

Toto môže byť pouižité pre logickú dedičnost (napríklad v prípade podkategórie, `Mačka` je `Zviera`). Ale inokedy taktiež jednoducho na to, aby sme zorganizovali náš kód zoskupením určitej logiky do viacerých kontraktov.
This can be used for logical inheritance (such as with a subclass, a `Cat` is an `Animal`). But it can also be used simply for organizing your code by grouping similar logic together into different contracts.


# Vyskúšaj si to sám
# Put it to the test

V nasledujúcich kapitlách budeme implementovať zombie funkcionalitu pre ich kŕmenie a rozmnožovanie. Poďme dať túto logiku do separátnych kontraktov ktoré budú dediť všetky metódy a premenné zo `ZombieFactory`. 
In the next chapters, we're going to be implementing the functionality for our zombies to feed and multiply. Let's put this logic into its own contract that inherits all the methods from `ZombieFactory`.

1. Vytvor kontrakt pomenovaný `ZombieFeeding` pod `ZombieFactory`. Tento kontrakt bude dediť od našeho `ZombieFactory` kontraktu.
1. Make a contract called `ZombieFeeding` below `ZombieFactory`. This contract should inherit from our `ZombieFactory` contract.
