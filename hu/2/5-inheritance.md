---
title: Öröklés
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

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

          function _createZombie(string memory _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string memory _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // Kezdj itt

    answer: >
      pragma solidity >=0.5.0 <0.6.0;


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

          function _createZombie(string memory _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string memory _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      contract ZombieFeeding is ZombieFactory {

      }

---

A játékunk kódja elég hosszú lesz. Ahelyett, hogy egy rendkívül hosszú szerződést készítenénk, néha érdemes a kód logikáját több szerződésre szétosztani a kód szervezése érdekében.

A Solidity egyik funkciója, amely ezt kezelhetőbbé teszi, a szerződés **_öröklés_**:

```
contract Doge {
  function catchphrase() public returns (string memory) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string memory) {
    return "Such Moon BabyDoge";
  }
}
```

A `BabyDoge` **_öröklődik_** a `Doge`-tól. Ez azt jelenti, hogy ha fordítod és telepíted a `BabyDoge`-ot, hozzáfér mind a `catchphrase()`-hez, mind az `anotherCatchphrase()`-hez (és bármely más nyilvános függvényhez, amelyet a `Doge`-on definiálhatunk).

Ez használható logikai örökléshez (például egy alosztály esetén, egy `Cat` egy `Animal`). De használható egyszerűen a kód szervezésére is, hasonló logikák csoportosításával különböző szerződésekbe.

# Tegyük próbára

A következő fejezetekben implementálni fogjuk a funkcionalitást, hogy a zombijaink táplálkozzanak és szaporodjanak. Tegyük ezt a logikát egy saját szerződésbe, amely örökli az összes metódust a `ZombieFactory`-ból.

1. Készíts egy szerződést `ZombieFeeding` néven a `ZombieFactory` alatt. Ennek a szerződésnek örökölnie kell a `ZombieFactory` szerződésünkből.
