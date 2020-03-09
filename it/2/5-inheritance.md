---
title: Eredità
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

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
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // inizia qui

    answer: >
      pragma solidity ^0.4.25;


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
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
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

Il nostro codice di gioco sta diventando piuttosto lungo. Invece di creare un contratto estremamente lungo, a volte, ha senso dividere la logica del codice su più contratti per organizzare il codice.

Una caratteristica di Solidity che lo rende più gestibile è il contratto **_eredità_** (**_inheritance_**):

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

`BabyDoge` **_eredita_** da `Doge`. Ciò significa che se si compila e si distribuisce `BabyDoge`, esso avrà accesso sia a `catchphrase()` che a `anotherCatchphrase()` (ed a qualsiasi altra funzione pubblica che possiamo definire su` Doge`).

Questo può essere usato per l'eredità logica (come fosse una sottoclasse, un `Gatto` è un `Animale`). Ma può anche essere usato semplicemente per organizzare il tuo codice raggruppando logica simile in contratti diversi.

# Facciamo una prova

Nei prossimi capitoli implementeremo la funzionalità per i nostri zombi di nutrirsi e moltiplicarsi. Mettiamo questa logica nel suo contratto che eredita tutti i metodi da `ZombieFactory`.

1. Crea un contratto chiamato `ZombieFeeding` sotto `ZombieFactory`. Questo contratto dovrà ereditare dal nostro contratto `ZombieFactory`.