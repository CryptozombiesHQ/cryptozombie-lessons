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

      contract ZombieFeeding is ZombieFactory {

      }

---

Kód našej hry sa začína celkom predlžovať. Namiesto toho aby sme robili náš kontrakt extrémne dlhým, občas dáva zmysel rozdeliť logiku kódu do niekoľkých kontraktov, a tak lepšie zorganizovať kód aplikácie.

Jedna z vlastností Solidity ktorá zľahčuje prácu s kódom je **_dedičnosť_** kontraktov:

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

`BabyDoge` **_dedí_** z kontraktu `Doge`. To znamená, že ak skompiluješ a nasadíš na blockchain `BabyDoge`, bude mať k dispozícií oboje `catchphrase()` aj `anotherCatchphrase()` (a taktiež akékoľvek iné funkcie ktoré by sme definovali na `Doge`).

Toto môže byť použité pre logickú dedičnost (napríklad v prípade podkategórie, `Mačka` je `Zviera`). Ale inokedy tiež jednoducho na to, aby sme zorganizovali náš kód zoskupením určitej logiky do viacerých kontraktov.

# Vyskúšaj si to sám

V nasledujúcich kapitolách budeme implementovať zombie funkcionalitu pre ich kŕmenie a rozmnožovanie. Poďme dať túto logiku do separátnych kontraktov, ktoré budú dediť všetky metódy a premenné zo `ZombieFactory`. 

1. Vytvor kontrakt pomenovaný `ZombieFeeding` pod `ZombieFactory`. Tento kontrakt bude dediť od našeho `ZombieFactory` kontraktu.
