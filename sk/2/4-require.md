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
              // začni písať tu
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

V Lekcií 1 sme napísali kód tak, aby užívatelia mohli vytvárať nových zombie volaním funkcie `createPseudoRandomZombie` s menom zombie ako parametrom. Problém je, že ak by užívatelia mohli volať túto funkciu bez obmedzení, mohli by si vytvárať nekonečné armády zombie. Hra by potom pre ostatných nebola veľmi zábavná.

Poďme spraviť potrebné úpravy na to, aby hráč mohol z jednej adresy vytvoriť nového zombie iba raz. Tým pádom hráči zavolajú túto funkciu iba jeden krát, pre vytvorenie ich prvopočiatočného zombie.

Ako implementujeme obmedzenie, aby táto funkcia mohla byť zavolaná každým hráčom maximálne raz?

Použijeme na to `require`. `require` zabezpečí, že funkcia vráti error, ak je určitá podmienka nesplnená.

```
function sayHiToVitalik(string _name) public returns (string) {
  // Porovná či argument _name je reťazec "Vitalik". Ak nie, vráti error a skončí.
  // (Bočná poznámka: Solidity natívne nepodporuje porovnávanie reťazcov,
  // preto vypočítame keccak256 hashe oboch reťazcov a pozrieme sa či sa zhodujú )
  require(keccak256(_name) == keccak256("Vitalik"));
  // Ak bola podmienka splnená, pokračuj vo vykonávaní funkcie
  return "Hi!";
}
```

Ak zavoláš túto funkciu takto: `sayHiToVitalik("Vitalik")`, vráti naspäť hodnotu "Hi!". Ak túto funkciu zavoláš s akýmkoľvek iným argumentom, vráti error a nevykoná sa.

`require` preto predstavuje veľmi užitočný konštrukt na verifikáciu toho, či boli splnené určité podmienky pred tým, než sa vykoná hlavná logika funkcie.


# Vyskúšaj si to sám

V našej zombie hre nechceme, aby užívateľ mohol donekonečna vytvárať neobmedzený počet zombie opakovaným volaním `createPseudoRandomZombie` - hra by nebola veľmi zábavná.

Poďme použiť `require` konštrukt na to, aby sme zaručili že táto funkcia bude vykonaná pre každého hráča len raz, keď si vytvoria svojho prvého zombie.

1. Vlož konštrukt `require` na začiatok funkcie `createPseudoRandomZombie`. Funkcia by mala kontrolovať, že `ownerZombieCount[msg.sender]` sa rovná `0`, a v opačnom prípade vyhodiť error.

> Poznámka: V Solidity nezáleží ktorý výraz do require zadáš ako prvý. Výsledok bude rovnaký pre oboje zoradenia. Bohužiaľ, nakoľko je náš softvér na kontrolovanie odpovedí veľmi jednoduchý, akceptuje jedinú správnu odpoved - očakáva že `ownerZombieCount[msg.sender]` bude prvým výrazom argumentom v require.
