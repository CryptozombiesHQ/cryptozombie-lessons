---
title: Require
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
              // inizia qui
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
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
---

Nella lezione 1 abbiamo fatto in modo che gli utenti possano creare nuovi zombi richiamando `createRandomZombie` e inserendo un nome. Tuttavia, se gli utenti potessero continuare a chiamare questa funzione per creare zombi illimitati nel loro esercito, il gioco non sarebbe molto divertente.

Facciamo in modo che ogni giocatore possa chiamare questa funzione una sola volta. In questo modo, i nuovi giocatori, la richiameranno quando iniziano la partita per creare lo zombi iniziale nel loro esercito.

Come possiamo fare in modo che questa funzione possa essere chiamata una sola volta per giocatore?

Per questo usiamo `require`. `require` farà in modo che la funzione genererà un errore ed interrompa l'esecuzione se una condizione non è vera:

```
function sayHiToVitalik(string _name) public returns (string) {
  // Confronta se _name è uguale a "Vitalik". Genera un errore ed esce se non è vero.
  // (Nota a margine: Solidity non ha un confronto nativo di stringhe, quindi
  // confrontiamo i loro hash keccak256 per vedere se le stringhe sono uguali)
  require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
  // Se è vero procedi con la funzione:
  return "Ciao!";
}
```

Se chiamate questa funzione con `sayHiToVitalik("Vitalik")` restituirà "Ciao!". Se lo chiami con qualsiasi altro input, genererà un errore e non verrà eseguito.

Pertanto `require` è abbastanza utile per verificare determinate condizioni che devono essere vere prima di eseguire una funzione.

# Facciamo una prova

Nel nostro gioco di zombi non vogliamo che l'utente sia in grado di creare un numero illimitato di zombi nel suo esercito chiamando ripetutamente `createRandomZombie` — ciò renderebbe il gioco non molto divertente.

Usiamo `require` per assicurarsi che questa funzione venga eseguita una sola volta per utente, quando creano il loro primo zombi.

1. Metti una dichiarazione `request` all'inizio di `createRandomZombie`. La funzione dovrebbe verificare che `ownerZombieCount[msg.sender]` sia uguale a `0`, altrimenti genera un errore.

> Nota: in Solidity non importa quale termine metti per primo, entrambi gli ordini sono equivalenti. Tuttavia, poiché il nostro controllore di risposte è veramente semplice, accetterà solo una risposta come corretta — si aspetta che `ownerZombieCount[msg.sender]` dovrà essere il primo.
