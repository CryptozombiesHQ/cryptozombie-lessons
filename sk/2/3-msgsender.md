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
              // Začni písať tu
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
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
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

Teraz keď už máme pripravené naše mapovania na udržovanie prehľadu o tom kto vlastní ktorého zombie, musíme ich použiť v metóde `_createZombie`.

Na to aby sa nám to podarilo, musíme si pomôcť s ďalšou novou vlasnosťou Solidity - `msg.sender`.

## msg.sender

V Solidity existujú určité globálne premenné ktoré su dostupné vo všetkých funkciách. Jedna z nich je aj `msg.sender`, ktorá nesie informáciu o `adrese` určitej osoby (alebo smart kontraktu) ktorá zavolala prave vykonávanú metódu.

> Poznámka: V Solidity musí vykonanie funkcie kontraktu vždy započať externým volaním mimo kontrakt. Kontrakt proste sedí na blockchaine a nerobí nič, dokým niekto nezavolá nejakú z jeho funkcií. Takže pri behu funkcie kontraktu bude mať `msg.sender` vždy definovanú nejakú hodnotu. 

Tu je príklad pouižitia `msg.sender` a modifikácie mapovania:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // uprav hodnotu `favoriteNumber` tak aby číslo `_myNumber` bolo uložené pod kľúčom `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ Syntax pre ukladanie dát do mapovania je rovnaká ako v prípade polí
}

function whatIsMyNumber() public view returns (uint) {
  // Zisti hodnotu uloženú v mapovaním pod kľučom rovným hodnote adresy z ktorej bola zavolaná táto funkcia.
  // Ak volateľ funkcie doposial nezavolal `setMyNumber`, táto funkcia vráti hodnotu `0` 
  return favoriteNumber[msg.sender];
}
```

V tomto triviálnom príklade, ktokoľvek by mohol zavolať `setMyNumber` a uložiť `uint` do kontraktu. Tento `uint` by potom bol viazaný na adresu ich účtu. Potom pri zavolaní `whatIsMyNumber`, dostali by naspať číslo ktoré si do kontraktu uložili.

Používanie `msg.sender` nám je jedna z mechanizmov bezpečnosti na Ethereum blockchain - jediný spôsob ako modifikovať cudzie dáta by bolo ukradnúť ich privátny kľúč asociovaný s ich Ethereum adresou. 

# Vyskúšaj si to sám

Poďme upraviť našu funkciu `_createZombie` z Lekcie 1 a priradiť vlastníctvo zombie tomu, kto zavolal túto funkciu. 

1. Za prvé, po tom čo dostaneš naspäť `id` vytvoreného zombie, ulož do mapovania `zombieToOwner` hodnotu `msg.sender` pod klúčom s hodnotou `id`.

2. Za druhé, poďme zvýšiť `ownerZombieCount` pre odosielateľa tejto transkacie - `msg.sender`.

V Solidity je možné inkrementovať hodnotu `uint` pomocou operátora `++` rovnako ako v Javascripte:

```
uint number = 0;
number++;
// `number` je teraz `1`
```

Tvojím riešením pre túto kapitolu by mali byť 2 riadky kódu.
