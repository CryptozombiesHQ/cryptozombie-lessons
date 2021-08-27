---
title: Require
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
              // start her
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

I leksjon 1 gjorde vi det slik at brukere kan lage nye zombier ved å kjøre `createPseudoRandomZombie` og skrive inn et navn. Men hvis brukerne kunne fortsette å kjøre denne funksjonen for å lage ubegrensede zombier i sin hær, ville spillet ikke være veldig morsomt.

La oss gjøre det slik at hver spiller kun kan kjøre denne funksjonen en gang. På den måten vil nye spillere kalle det når de først starter spillet for å lage den første zombieen i sin hær.

Hvordan kan vi gjøre det slik at denne funksjonen kun kan kalles en gang per spiller?

For det bruker vi `require`. `require` gjør det slik at funksjonen vil kaste en feil og slutte å utføre hvis noen tilstand ikke er sant:

```
function sayHiToVitalik(string _name) public returns (string) {
  // Sammenligner if _name er lik "Vitalik". Kaster en feil og avslutter hvis ikke sant.
   // (Side notat: Solidity har ingen native string sammenligning, så vi
   // sammenligner stringene med keccak256 hashes for å se om strengene er like)
   require(keccak256 (_name) == keccak256 ("Vitalik"));
   // Hvis det er sant, fortsett med funksjonen:
   return "Hi!";
}
```

Hvis du kjører denne funksjonen med `sayHiToVitalik (" Vitalik ")`, vil den returnere "Hi!". Hvis du kjører det med noe annet input, vil det kaste en feil og ikke utføre.

Dermed er `require` ganske nyttig for å verifisere visse forhold som må være sanne før du kjører en funksjon.

# Test det

I vårt zombispill ønsker vi ikke at brukeren skal kunne lage ubegrensede zombier i sin hær ved å gjenta "createPseudoRandomZombie" - det ville gjøre spillet ikke så morsomt.

La oss bruke `require` for å sikre at denne funksjonen bare blir utført en gang per bruker, når de lager sin første zombie.

1. Sett en `require`-setning i begynnelsen av `createPseudoRandomZombie`. Funksjonen bør sjekke for at `ownerZombieCount[msg.sender]` er lik `0`, og kaster en feil ellers.

> Noter: I Solidity, spiller det ingen rolle hvilket begrep du legger først - begge ordrene er likeverdige. Men siden vår svarkontroll er veldig grunnleggende, vil den bare akseptere ett svar som riktig - det forventer at `ownerZombieCount[msg.sender]` kommer først.
