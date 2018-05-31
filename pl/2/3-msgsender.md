---
title: Msg.sender
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
      // zacznij tutaj
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
      function _createZombie(string _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
Teraz, kiedy mamy już mapowania zawierające informacje o tym, kto jest posiadaczem Zombi, będziemy chcieli aktualizować metodę `_createZombie` aby ich używać.

Aby to zrobić, musimy użyć czegoś o nazwie `msg.sender`.

## msg.sender

W Solidity, istnieją pewne zmienne globalne, które są dostępne dla wszystkich funkcji. Jedną z nich jest `msg.sender`, które odnosi się do `adresu` osoby (lub kontraktu), który wywołał aktualna funkcję.

> Uwaga: W Solidity, wywołanie funkcji zawsze wymaga wywołania zewnętrzenego. Kontrakt tylko umieszczony jest w blockchain'ie i nic nie robi do czasu, gdy ktoś wywoła jedną z jego funkcji. Więc zawsze wystąpi tu `msg.sender`.

Tutaj mamy przykład użycia `msg.sender` i zaktualizowania `mapowania`:

    mapping (address => uint) favoriteNumber;
    
    function setMyNumber(uint _myNumber) public {
      // Zaktualizuj mapowanie `favoriteNumber` aby przechować `_myNumber` pod `msg.sender`
      favoriteNumber[msg.sender] = _myNumber;
      // ^ Składnia dla przechowywania danych w mapowaniu jest taka jak w tablicach
    }
    
    function whatIsMyNumber() public view returns (uint) {
      // Odzyskaj wartość zapisaną w adresie nadawcy
      // Będzie `0` jeśli nadawca nie wywołał jeszcze `setMyNumber`
      return favoriteNumber[msg.sender];
    }
    

W tym trywialnym przykładzie, każdy może wywołać `setMyNumber` i przechować `uint` w naszym kontrakcie, który byłby związany z jego adresem. I wtedy, kiedy wywoła `whatIsMyNumber`, zwróci mu `uint`, który przechował.

Using `msg.sender` gives you the security of the Ethereum blockchain — the only way someone can modify someone else's data would be to steal the private key associated with their Ethereum address.

# Put it to the test

Let's update our `_createZombie` method from lesson 1 to assign ownership of the zombie to whoever called the function.

1. First, after we get back the new zombie's `id`, let's update our `zombieToOwner` mapping to store `msg.sender` under that `id`.

2. Second, let's increase `ownerZombieCount` for this `msg.sender`.

In Solidity, you can increase a `uint` with `++`, just like in javascript:

    uint number = 0;
    number++;
    // `number` is now `1`
    

Your final answer for this chapter should be 2 lines of code.