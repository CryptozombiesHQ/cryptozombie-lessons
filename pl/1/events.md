---
title: Eventy
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      // declare our event here

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      Zombie[] public zombies;

      function _createZombie(string memory _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      // and fire it here
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
      function _createZombie(string memory _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

Nasz kontrakt jest prawie gotowy! Teraz dodajmy ***event***.

***Eventy*** są sposobem komunikowania Twojej aplikacji o tym, że coś wydarzyło się w blockchain'ie. Możemy określić to jako "nasłuchiwanie" pewnych wydarzeń i podejmowanie działania gdy takie się pojawią.

Przykład:

    // declare the event
    event IntegersAdded(uint x, uint y, uint result);
    
    function add(uint _x, uint _y) public returns (uint) {
      uint result = _x + _y;
      // fire an event to let the app know the function was called:
      emit IntegersAdded(_x, _y, result);
      return result;
    }
    

Your app front-end could then listen for the event. A JavaScript implementation would look something like:

    YourContract.IntegersAdded(function(error, result) {
      // do something with result
    })
    

# Wypróbujmy zatem

Chcemy aby event powiadomił naszą aplikację za każdym razem gdy stworzony zostanie nowy Zombie, więc aplikacja będzie mogła to wyświetlić.

1. Zadeklaruj `event` i nazwij go `NewZombie`. Powinien zawierać `zombieId` (`uint`), `name` (`string`), oraz `dna` (`uint`).

2. Zmodyfikuj funkcję `_createZombie` tak aby uruchamiała event `NewZombie` po dodaniu nowego Zombie do naszej tablicy o nazwie `zombies`.

3. Potrzebujesz `id` Zombiaka. `array.push()` zwraca `uint` nowej dłudości tablicy - i odkąd pierwszy jej element miał index o numerze 0, to `array.push() - 1` będzie indeksem zombie, który właśnie dodaliśmy. Zachowaj wynik `zombies.push() - 1` w `uint` i nazwij `id`, więc będziesz mógł użyć tego w evencie `NewZombie` w następnej linii.