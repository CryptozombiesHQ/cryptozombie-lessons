---
title: Mapping og Adresser
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

          // deklarer mapping her

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
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

La oss lage vår multiplayer av spill ved å gi zombiene i vår database en eier.

For å gjøre dette trenger vi 2 nye datatyper:`mapping` og `address`.

## Adresser

Ethereum blockchain består av **_accounts_**, som du kan tenke på som bankkontoer. En konto har en balanse mellom **_Ether_** (den valutaen som brukes i Ethereum-blokkkjeden), og du kan sende og motta Ether-betalinger til andre kontoer, akkurat som at bankkontoen din kan overføre penger til andre bankkontoer.

Hver konto har en `address`, som du kan tenke på som et bankkontonummer. Det er en unik identifikator som peker på den kontoen, og det ser slik ut:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Denne adressen tilhører CryptoZombies-teamet. Hvis du setter pris på CryptoZombies, kan du sende oss noen Ether! 😉)

Vi vil komme inn i det nitty gritty av adresser i en senere leksjon, men for nå trenger du bare å forstå at **en adresse eies av en bestemt bruker** (eller en smart-kontrakt).

Så vi kan bruke den som en unik ID for eierskap av våre zombier. Når en bruker oppretter nye zombier ved å samhandle med vår app, setter vi eierskap av de zombiene til Ethereum-adressen som kalte funksjonen.

## Mapping

I Leksjon 1 så vi på  **_structs_** og **_arrays_**. **_Mappings_**er en annen måte å lagre organisert data på i Solidity.

Definere en `mapping` ser slik ut:

```
// For en finansiell app, lagrer du en uint som holder brukerens kontosaldo:
mapping (address => uint) public accountBalance;
// Eller kan brukes til å lagre / oppsøk brukernavn basert på userId
mapping (uint => string) userIdToName;
```

En mapping er i hovedsak et nøkkelverdi lager for lagring og oppsøking av data. I det første eksemplet er nøkkelen en `address` og verdien er en`uint`, og i det andre eksempelet er nøkkelen en `uint` og verdien en`string`.


# Test det

For å lagre zombie eierskap, skal vi bruke to mappings: en som holder styr på adressen som eier en zombie, og en annen som holder styr på hvor mange zombier en eier har.

1. Lag en mapping kalt `zombieToOwner`. Nøkkelen vil være en `uint` (vi lagrer og ser opp zombie basert på id) og verdien en`address`.La oss gjøre denne mappingen `public`.

2. Lag en mapping kalt `ownerZombieCount`, hvor nøkkelen er en `address` og verdien er en `uint`.
