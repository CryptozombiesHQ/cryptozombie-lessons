---
title: Require
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
      zombieToOwner[id] = msg.sender;
      ownerZombieCount[msg.sender]++;
      emit NewZombie(id, _name, _dna);
      }

      function _generateRandomDna(string memory _str) private view returns (uint) {
      uint rand = uint(keccak256(abi.encodePacked(_str)));
      return rand % dnaModulus;
      }

      function createRandomZombie(string memory _name) public {
      // start here
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
      function createRandomZombie(string memory _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

W lekcji 1, zrobiliśmy tak, aby użytkownicy mieli możliwość tworzenia nowych Zombi poprzez wywołanie `createRandomZombie` i wpisanie jego nazwy. Jednakże, jeśli użytkownicy mogliby nadal wywoływać tę funkcję, aby stworzyć nieograniczoną liczbę Zombi w swojej armii, gra nie byłaby bardzo zabawna.

Zróbmy tak, aby każdy gracz mógł wywołać tę funkcję tylko raz. W ten sposób nowi gracze będą wywoływać ją po rozpoczęciu gry, aby stworzyć początkowego Zombi w armii.

Jak możemy to zrobić, aby funkcja ta była wywołana tylko raz dla każdego gracza?

Używamy do tego `require`. `require` powoduje, że funkcja będzie sygnalizowała błąd i zatrzyma wykonywanie, jeśli jakiś warunek nie jest spełniony:

    function sayHiToVitalik(string memory _name) public returns (string memory) {
      // Compares if _name equals "Vitalik". Wyrzuca błąd i wychodzi jeśli to nie jest prawdą.
      // (Side note: Solidity doesn't have native string comparison, so we
      // compare their keccak256 hashes to see if the strings are equal)
      require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
      // If it's true, proceed with the function:
      return "Hi!";
    }
    

Jeśli wywołasz tę funkcję tak: `sayHiToVitalik("Vitalik")`, zwróci "Hi!". Jeśli wywołasz ją z innymi danymi wejściowymi, będzie sygnalizować błąd i się nie wykona.

Zatem `require` jest pożyteczne do weryfikacji pewnych warunków, które muszą być prawdą przed uruchomieniem funkcji.

# Wypróbujmy zatem

W naszej grze Zombi, nie chcemy aby użytkownik mógł tworzyć armię Zombiaków bez limitu poprzez powtarzanie wywołań `createRandomZombie` — to spowoduje, że gra nie będzie bardzo zabawna.

Użyjmy `require` aby upewnić się, że tak funkcja zostanie wykonana tylko raz dla danego użytkownia, kiedy stworzy on swojego pierwszego Zombi.

1. Umieść wyrażenie `require` na początku `createRandomZombie`. Funkcja powinna sprawdzać czy `ownerZombieCount[msg.sender]` jest równe `0` i wyrzucić błąd w przeciwnym wypadku.

> Uwaga: W Solidity, Nie ma znaczenia, które wyrażenie napiszesz jako pierwsze — obie kolejności są równoważne. Jednakże, nasze narzędzie do sprawdzania odpowiedzi jest naprawdę proste, będzie ono akceptowało tylko jedną odpowiedź jako poprawną — oczekuje aby `ownerZombieCount[msg.sender]` było piewsze.