---
title: Praca ze Strukturami i Tablicami
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      Zombie[] public zombies;

      function createZombie (string memory _name, uint _dna) public {
      // start here
      }

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function createZombie (string memory _name, uint _dna) public { zombies.push(Zombie(_name, _dna)); }
      }
---

### Tworzenie Nowych Struktur

Pamiętasz naszą strukturę `Person` z poprzedniego przykładu?

    struct Person {
      uint age;
      string name;
    }
    
    Person[] public people;
    

Teraz nauczymy się jak utworzyć nowe elementy `Person` i dodać je do naszej tablicy `people`.

    // utwórz nowy element Person:
    Person satoshi = Person(172, "Satoshi");
    
    // dodaj ten element do tablicy:
    people.push(satoshi);
    

Możesz również połączyć to razem i napisać to w jednej linii kodu, aby zachować większy porządek:

    people.push(Person(16, "Vitalik"));
    

Zauważ, że `array.push()` dodaje elementy do **końca** tablicy, więc będą one w takiej kolejności, jakiej je napiszemy. Spójrz na poniższy przykład:

    uint[] numbers;
    numbers.push(5);
    numbers.push(10);
    numbers.push(15);
    // tablica "numbers" jest teraz równa: [5, 10, 15]
    

# Wypróbujmy zatem

Sprawmy, aby nasza funkcja createZombie coś dla nas wykonała!

1. W ciele funkcji stwórz nowego `Zombie` i dodaj go do tablicy `zombies`. Parametry `name` i `dna` dla nowego Zombiaka powinny pochodzić z argumentów funkcji.
2. Zrób to w jednej linii, aby zachować porządek i zmniejszyć ilośc linijek kodu.