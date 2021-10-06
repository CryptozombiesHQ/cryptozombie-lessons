---
title: Msg.sender
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
              // inizia qui
              emit NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Ora che abbiamo i nostri mapping per tenere traccia di chi possiede uno zombi, vorremmo aggiornare il metodo `_createZombie` per usarli.

Per fare ciò dobbiamo usare qualcosa chiamato `msg.sender`.

## msg.sender

In Solidity esistono alcune variabili globali che sono disponibili per tutte le funzioni. Una di queste è "msg.sender", che si riferisce all'`address` della persona (o contratto intelligente) che ha chiamato la funzione corrente.

> Nota: in Solidity l'esecuzione della funzione deve sempre iniziare con un chiamante esterno. Un contratto siederà sulla blockchain senza fare nulla fino a quando qualcuno non chiama una delle sue funzioni. Quindi ci sarà sempre un `msg.sender`.

Ecco un esempio dell'uso di `msg.sender` e dell'aggiornamento di un `mapping`:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Aggiorna la mappatura `favoriteNumber` per memorizzare `_myNumber` in `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ La sintassi per la memorizzazione dei dati in una mappatura è proprio come con gli array
}

function whatIsMyNumber() public view returns (uint) {
  // Recupera il valore memorizzato nell'indirizzo del mittente
  // Sarà `0` se il mittente non ha ancora chiamato `setMyNumber`
  return favoriteNumber[msg.sender];
}
```

In questo banale esempio chiunque potrebbe chiamare `setMyNumber` e memorizzare un` uint` nel nostro contratto, che sarebbe legato al loro indirizzo. Quindi quando hanno chiamato `whatIsMyNumber` sono stati restituiti gli `uint` che avevano archiviato.

L'uso di `msg.sender` ti offre la sicurezza della blockchain di Ethereum - l'unico modo in cui qualcuno può modificare i dati di qualcun altro sarebbe quello di rubare la chiave privata associata al suo indirizzo Ethereum.

# Facciamo una prova

Aggiorniamo il nostro metodo `_createZombie` della lezione 1 per assegnare la proprietà dello zombi a chiunque abbia chiamato la funzione.

1. Per prima cosa, dopo aver ricevuto l'`id` del nuovo zombi, aggiorniamo la nostra mappatura `zombieToOwner` per memorizzare `msg.sender` sotto quell'`id`.

2. Successivamente aumentiamo `ownerZombieCount` per questo `msg.sender`.

In Solidity puoi aumentare un `uint` con `++`, proprio come in JavaScript:

```
uint number = 0;
number++;
// `number` è adesso `1`
```

La tua risposta finale per questo capitolo dovrebbe essere di 2 righe di codice.
