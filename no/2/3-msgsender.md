---
title: Msg.sender
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
              // start her
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
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
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Nå som vi har våre mappings for å holde oversikt over hvem som eier en zombie, vil vi oppdatere `_createZombie`-metoden for å bruke dem.

For å gjøre dette må vi bruke noe som heter `msg.sender`.

## msg.sender

I Solidity er det visse globale variabler som er tilgjengelige for alle funksjoner. En av disse er `msg.sender`, som refererer til `address` til personen (eller smart kontrakt) som kalte gjeldende funksjon.

> Noter: I Solidity må utførsel av funksjon alltid begynne med en ekstern utførsel. En kontrakt vil bare sitte på blockchain og gjøre ingenting før noen utfører en av dens funksjoner. Så det vil alltid være en `msg.sender`.

Her er et eksempel på bruk av `msg.sender` og oppdatering av en `mapping`:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Oppdater din `favoriteNumber`-mapping for å lagre `_myNumber` under `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ Syntaxen for lagring av data i en mapping er akkurat som med arrays
}

function whatIsMyNumber() public view returns (uint) {
  // Hent verdien som er lagret i avsenderens adresse
  // Vil være `0` hvis avsenderen ikke har kalt` setMyNumber` ennå
  return favoriteNumber[msg.sender];
}
```

I dette trivielle eksempelet kan noen kalle `setMyNumber` og lagre en `uint` i kontrakten vår, som vil være knyttet til adressen deres. Da når de kaller «whatIsMyNumber», ville de bli returnert den `uint`-en som de lagret.

Ved å bruke `msg.sender` får du sikkerheten til Ethereum blockchain - den eneste måten noen kan modifisere andres data ville være å stjele den private nøkkelen som er knyttet til deres Ethereum-adresse.

# Test det

La oss oppdatere vår `_createZombie`-metode fra leksjon 1 for å tilordne eierskap til zombie til den som kjørte funksjonen.

1. Først, etter at vi fått tilbake den nye zombiens `id`, la oss oppdatere vår `zombieToOwner`-mapping for å lagre `msg.sender` under den `id`-en.

2. Så, la oss øke `ownerZombieCount` for denne `msg.sender`-en.

I Solidity kan du øke en `uint` med `++`, akkurat som i JavaScript:

```
uint number = 0;
number++;
// `number` er nå `1`
```

Ditt endelige svar for dette kapitlet skal være 2 linjer med kode.
