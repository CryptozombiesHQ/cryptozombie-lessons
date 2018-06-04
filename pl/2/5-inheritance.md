---
title: Dziedziczenie
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
      require(ownerZombieCount[msg.sender] == 0);
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
      function _createZombie(string _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
      contract ZombieFeeding is ZombieFactory {
      }
---
Kod gry staje się trochę długi. Zamiast tworzyć jeden ekstremalnie długi kontrakt, czasami sens ma podzielenie Twojego kodu na wiele kontraktów, dla zachowania lepszej organizacji.

Cechą języka Solidity, która pozwoli Ci na lepsze zarządzanie Twoim kontrakem jest ***dziedziczenie***:

    contract Doge {
      function catchphrase() public returns (string) {
        return "So Wow CryptoDoge";
      }
    }
    
    contract BabyDoge is Doge {
      function anotherCatchphrase() public returns (string) {
        return "Such Moon BabyDoge";
      }
    }
    

`BabyDoge` ***dziedziczy*** z `Doge`. Oznacza to, że jeśli skompilujesz i wdrożysz `BabyDoge`, będzie miał on dostęp zarówno do `catchphrase()` jak i `anotherCatchphrase()` (oraz każdej innej funkcji publicznej zdefiniowanej w `Doge`).

Może to zostać użyte do logicznego dziedziczenia (tak jak w przypadku podklasy, `Kot` może dziedziczyć z klasy `Zwierzę`). Ale również do organizowania kodu, poprzez grupowanie podobnej logiki w różnych kontraktach.

# Wyprobujmy zatem

W kolejnych rozdziałach, będziemy implementować funkcjonalność umożliwiającą karmienie i pomnażanie Zombiaków. Let's put this logic into its own contract that inherits all the methods from `ZombieFactory`.

1. Make a contract called `ZombieFeeding` below `ZombieFactory`. This contract should inherit from our `ZombieFactory` contract.