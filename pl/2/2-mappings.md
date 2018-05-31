---
title: Mapowanie i Adresy
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
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
      
      // zadeklaruj mapowanie tutaj
      
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
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
Zróbmy z naszej gry multiplayer poprzez nadanie Zombiakom z naszej bazy właściciela.

Aby to zrobic, potrzebujemy 2 nowe typy danych: `mapping` i `address`.

## Adresy

Blockchain sieci Ethereum jest złożony z ***kont***, o których można myśleć jak o kontach bankowych. Konto posiada saldo ***Etheru*** (waluta używana w blockchain'ie Ethereum) i jesteśmy w stanie wysyłać oraz odbierać płatności do innych kont, tak samo jak z Twojego konta bankowego możesz przelać pieniądze na inne konto bankowe.

Każde konto posiada `adres`, który jest jak numer konta bankowego. Jest to unikatowy identyfikator, który należy do tego konta i wygląda tak:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(This address belongs to the CryptoZombies team. If you're enjoying CryptoZombies, you can send us some Ether! 

W szczegóły adresów zagłębimy sie później, natomiast na tą chwilę musisz wiedzieć, że **adres jest własnością określonego użytkownika** (lub kontraktu).

Więc możemy go użyć jako unikatowe ID dla posiadania naszych Zombi. When a user creates new zombies by interacting with our app, we'll set ownership of those zombies to the Ethereum address that called the function.

## Mappings

In Lesson 1 we looked at ***structs*** and ***arrays***. ***Mappings*** are another way of storing organized data in Solidity.

Defining a `mapping` looks like this:

    // For a financial app, storing a uint that holds the user's account balance:
    mapping (address => uint) public accountBalance;
    // Or could be used to store / lookup usernames based on userId
    mapping (uint => string) userIdToName;
    

A mapping is essentially a key-value store for storing and looking up data. In the first example, the key is an `address` and the value is a `uint`, and in the second example the key is a `uint` and the value a `string`.

# Put it to the test

To store zombie ownership, we're going to use two mappings: one that keeps track of the address that owns a zombie, and another that keeps track of how many zombies an owner has.

1. Create a mapping called `zombieToOwner`. The key will be a `uint` (we'll store and look up the zombie based on its id) and the value an `address`. Let's make this mapping `public`.

2. Create a mapping called `ownerZombieCount`, where the key is an `address` and the value a `uint`.