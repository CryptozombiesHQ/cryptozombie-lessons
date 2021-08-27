---
title: Mapovania a adresy
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

          // tu deklaruj mapovania

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

Poďme spravit z našej hru multi-player tým, že každému zombie v našej databáze priradíme vlastníka. 

Aby sme to dosiahli, budeme potrebovať 2 nové dátové štruktúry `mapping` a `address`.

## Adresy
## Addresses

Ethereum blockchain je tvorený **_účtami_**. Môžeš o nich premýšľať podobným spôsobom ako o bankových účtoch. Účet má určitý balans **_Etheru_** (kryptomena na Ethereum blockchaine). Môžeš odosielať a príjmať platby do a z ostatných učtov. Rovnako ako keď sú prevádzané peniaze medzi bankovými účtami. 

Každý účet má svoju `adresu`. Tu je možné prirovnať k číslu bankového účtu. Je to unikátny identifikátor referujúci na jeden konkrétny účet. Môže vyzerať napríklad takto:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Táto adresa patrí CryptoZombies týmu. Ak sa ti CryptoZombies páči, môžeš nám poslať nejaký Ether! 😉 )

K bližším detailom o adresách sa dostaneme v nasledujúcej lekci. Zatiaľ stačí keď porozumieš že **adresa je vlastnená špecifickým užívateľom** (alebo aj smart kontraktom).

To znamená že môžeme adresu použiť ako unikátny identifikátor vlastníctva zombies. Keď užívateľ vytvorí nového zombie prostriedníctvom našej aplikácie, nastavíme vlastníka vytvoreného zombie na adresu z ktorej bola zavolaná funkcia na vytvorenie nového zombie.

## Mapovania

V Lekcii 1 sme sa pozreli na **_štruktúry_** (structs) a **_polia_** (arrays). **_Mapovania_** (**_mapping_**) sú ďalším spôsobom ako v Solidity môžeme pracovať so štrukturovanými dátami.

Deklarácia mapovania vyzerá takto: 

```
// Pre finančnú aplikáciu by sme mohli mať mapovanie, v ktorom by ku každej adrese patril `uint` reprezentujúcu balanc ktorý je na danom účte k dispozicií:
mapping (address => uint) public accountBalance;
// Alebo by sme mohli ukladať a prehľadávat úžívateľské mená podľa userId
mapping (uint => string) userIdToName;
```

Mapovanie je v podstate dátové úložisko vo forme kľuč-hodnota. V prvom príklade je kľúčom je hodnota typu `address` ktorej korešponduje hodnota typu `uint`. V druhom príklade je kľúčom hodnota typu `uint`. Každému kľúču potom odpovedá určitá hodnota typu `string`.

# Vyskúšaj si to sám

Aby sme nejakým spôsobom spravovali vlastníctvo vytvorených zombie, použijeme dve mapovania. Jedno si bude pamätať adresu vlastníka zombie s určítým id. Druhé mapovanie použijeme na udržovanie si počtu zombies vlastneného nejakou adresou.  

1. Vytvor mapovanie pomenované `zombieToOwner`. Kľúčom bude `uint` (použijeme id zombie na to aby sme zistili kto je jeho vlastníkom) a hodnotou mapovania bude adresa (adresa vlastníka zombie). Mapovanie deklarujme ako `public`.

2. Vytvor mapovanie s názvom `ownerZombieCount`. Kľúč mapovania bude typu `address` a hodnotou bude `uint`.
