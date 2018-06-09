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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Poďme spravit z našej hru multi-player tým, že každému zombie v našej databáze priradíme vlastníka. 
Let's make our game multi-player by giving the zombies in our database an owner.

Aby sme to dosiahli, budeme potrebovať 2 nové dátové štruktúry `mapping` a `address`.
To do this, we'll need 2 new data types: `mapping` and `address`.

## Adresy
## Addresses

Ethereum blockchain je tvorený **_účtami_**, ok ktorých môžeš premýšľať podobným spôsobom ako o bankových účtoch. Účet má určitý balanc **_Etheru_** (kryptomena na Ethereum blockchaine). Môžeš odosielať a príjmať platby do a z ostatných učtov, rovnako ako keď su prevádzané peniaze medzi bankovými účtami. 

The Ethereum blockchain is made up of **_accounts_**, which you can think of like bank accounts. An account has a balance of **_Ether_** (the currency used on the Ethereum blockchain), and you can send and receive Ether payments to other accounts, just like your bank account can wire transfer money to other bank accounts.

Každý účet má svoju `adresu` ktorú si možno predstaviť ako číslo bankového účtu. Je to unikátny identifikátor ktorý referuje jeden účet. Môže vyzerať napríklad takto:

Each account has an `address`, which you can think of like a bank account number. It's a unique identifier that points to that account, and it looks like this:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Táto adresa patrí CryptoZombies týmu. Ak sa ti kryptozombies páči, môžeš nám poslať nejaký Ether! 😉 )
(This address belongs to the CryptoZombies team. If you're enjoying CryptoZombies, you can send us some Ether! 😉 )

K bližším detailom o adresách sa dostaneme v nasledujúcej lekci. Zatiaľ stačí keď porozumieš že **adresa je vlastnená špecifickým užívateľom** (alebo aj smart kontraktom).
We'll get into the nitty gritty of addresses in a later lesson, but for now you only need to understand that **an address is owned by a specific user** (or a smart contract).

To znamená že môžeme adresu použiť ako unikátny identifikátor vlastníctva zombies. Keď užívateľ vytvorí nového zombie prostriedníctvom našej aplikácie, nastavíme vlastníka vytvoreného zombie na adresu z ktorej bola zavolaná funkcia na vytvorenie nového zombie.
So we can use it as a unique ID for ownership of our zombies. When a user creates new zombies by interacting with our app, we'll set ownership of those zombies to the Ethereum address that called the function.

## Mapovania
## Mappings

V Lekcii 1 sme sa pozreli na **_štruktúry_** (structs) a **_polia_** (arrays). **_Mapvania_** (mappings) sú ďalším spôsobom ako v Solidity môžeme pracovať so štrukturovanými dátami.
In Lesson 1 we looked at **_structs_** and **_arrays_**. **_Mappings_** are another way of storing organized data in Solidity.

Definovanie mapovania vyzerá takto: 
Defining a `mapping` looks like this:

```
// Pre finančnú aplikáciu by sme mohli mať mapovanie, v ktorom by ku každej adrese patril uint reprezentujúcu balanc k dispozicií na danom účte
// For a financial app, storing a uint that holds the user's account balance:
mapping (address => uint) public accountBalance;
// Alebo by sme mohli ukladať a prehľadávat úžívateľské mená podľa userId
// Or could be used to store / lookup usernames based on userId
mapping (uint => string) userIdToName;
```

Mapovanie je v podstate dátové úložisko vo forme kľuč-hodnota. V prvom príklade, kľúčom je hodnota typu `address` ktorej korešponduje hodnota typu `uint`. V druhom príklade je kľučom hodnota typu `uint`. Každému kľúču potom odpovedá určitá hodnota typu `string`.
A mapping is essentially a key-value store for storing and looking up data. In the first example, the key is an `address` and the value is a `uint`, and in the second example the key is a `uint` and the value a `string`.

# Vyskúšaj si to sám
# Put it to the test

Aby sme nejakým spôsobom spravovali vlastníctvo vytvorených zombie, použijeme dve mapovania. Jedno si bude pamätať adresu vlastníka zombie s určítým id. Druhé mapovanie použijeme na to udržovanie počtu zombies vlastneného nejakou adresou.  
To store zombie ownership, we're going to use two mappings: one that keeps track of the address that owns a zombie, and another that keeps track of how many zombies an owner has.

1. Vytvor mapvanie pomenované `zombieToOwner`. Kľúčom bude `uint` (použijeme id zombie na to aby sme zistili kto je jeho vlastníkom) a hodnotou mapovania bude adresa (adresa vlastníka zombie). Mapovanie deklarujme ako `public`.
1. Create a mapping called `zombieToOwner`. The key will be a `uint` (we'll store and look up the zombie based on its id) and the value an `address`. Let's make this mapping `public`.

2. Vytvor mapovanie s názvom `ownerZombieCount`, ktorého kľúč bude typu `address` a hodnotou bude `uint`.
2. Create a mapping called `ownerZombieCount`, where the key is an `address` and the value a `uint`.
