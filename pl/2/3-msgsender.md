---
title: Msg.sender
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

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

      function _createZombie(string memory _name, uint _dna) private {
      uint id = zombies.push(Zombie(_name, _dna)) - 1;
      // start here
      emit NewZombie(id, _name, _dna);
      }

      function _generateRandomDna(string memory _str) private view returns (uint) {
      uint rand = uint(keccak256(abi.encodePacked(_str)));
      return rand % dnaModulus;
      }

      function createRandomZombie(string memory _name) public {
      uint randDna = _generateRandomDna(_name);
      _createZombie(_name, randDna);
      }

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

Teraz, kiedy mamy już mapowania zawierające informacje o tym, kto jest posiadaczem Zombi, będziemy chcieli aktualizować metodę `_createZombie` aby ich używać.

Aby to zrobić, musimy użyć czegoś o nazwie `msg.sender`.

## msg.sender

W Solidity, istnieją pewne zmienne globalne, które są dostępne dla wszystkich funkcji. Jedną z nich jest `msg.sender`, które odnosi się do `adresu` osoby (lub kontraktu), który wywołał aktualna funkcję.

> Uwaga: W Solidity, wywołanie funkcji zawsze wymaga wywołania zewnętrzenego. Kontrakt tylko umieszczony jest w blockchain'ie i nie robi nic, do czasu, gdy ktoś wywoła jedną z jego funkcji. Więc zawsze wystąpi tu `msg.sender`.

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

Używanie `msg.sender` daje Ci bezpieczeństwo w blockchain'ie Ethereum — jedyna drogą, kiedy ktoś może zmodyfikować czyjeś dane, jest kradzież prywatnego klucza związanego z adresem Ethereum.

# Wypróbujmy zatem

Zaktualizujmy funkcję `_createZombie` z lekcji 1 tak, aby dołączyć własność Zombi, gdy ktokolwiek wywoła tę funkcję.

1. Najpierw, po otrzymaniu nowych `id` Zombi, zauktualizujmy nasze mapowanie `zombieToOwner` aby przechować `msg.sender` pod tym `id`.

2. Po drugie, zwiększmy `ownerZombieCount` dla `msg.sender`.

In Solidity, you can increase a `uint` with `++`, just like in JavaScript:

    uint number = 0;
    number++;
    // `number` jest teraz równy `1`
    

Twoja końcowa odpowiedź dla tego rozdziału powinna zawierać 2 linie kodu.