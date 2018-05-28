---
title: Eventy
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      // zadeklaruj event tutaj
      
      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;
      
      struct Zombie {
      string name;
      uint dna;
      }
      
      Zombie[] public zombies;
      
      function _createZombie(string _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      // i "odpal" go tu
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
      function _createZombie(string _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
Nasz kontrakt jest prawie gotowy! Teraz dodajmy ***event***.

***Eventy*** są sposobem komunikacji o tym, że coś wydarzyło się w blockchain'ie do Twojej aplikacji. Możemy określić to jako "nasłuchiwanie" pewnych wydarzeń i podejmowanie działania gdy takie się pojawią.

Przykład:

    // deklaracja eventu
    event IntegersAdded(uint x, uint y, uint result);
    
    function add(uint _x, uint _y) public {
      uint result = _x + _y;
      // uruchomienie eventu aby dać znać aplikacji, że funkcja została wywołana:
      IntegersAdded(_x, _y, result);
      return result;
    }
    

Twoja front-endowa aplikacja może nasłuchiwać event. Implementacja w Javascripcie wygląda następująco:

    YourContract.IntegersAdded(function(error, result) { 
      // zrób coś z wynikiem
    }
    

# Wypróbujmy zatem

Chcemy aby event powiadomił naszą aplikację za każdym razem gdy stworzony zostanie nowy Zombie, więc aplikacja będzie mogła to wyświetlić.

1. Zadeklaruj `event` i nazwij go `NewZombie`. Powinien zawierać `zombieId` (`uint`), `name` (`string`), oraz `dna` (`uint`).

2. Zmodyfikuj funkcję `_createZombie` tak aby uruchamiała event `NewZombie` po dodaniu nowego Zombie do naszej tablicy o nazwie `zombies`.

3. Potrzebujesz `id` Zombiaka. `array.push()` zwraca `uint` nowej dłudości tablicy - i odkąd pierwszy jej element miał index o numerze 0, to `array.push() - 1` będzie indeksem zombie, który właśnie dodaliśmy. Zachowaj wynik `zombies.push() - 1` w `uint` i nazwij `id`, więc będziesz mógł użyć tego w evencie `NewZombie` w następnej linii.