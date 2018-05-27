---
title: Praca ze Strukturami i Tablicami
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;
      
      struct Zombie {
      string name;
      uint dna;
      }
      
      Zombie[] public zombies;
      
      function createZombie(string _name, uint _dna) {
      // zacznij tutaj
      }
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function createZombie(string _name, uint _dna) { zombies.push(Zombie(_name, _dna)); }
      }
---
### Tworzenie Nowych Struktur

Pamiętasz naszą strukturę `Person` z poprzedniego przykładu?

    struct Person {
      uint age;
      string name;
    }
    
    Person[] public people;
    

Teraz nauczymy się jak utworzyć nowe elementy `Person`s i dodać je do naszej tablicy `people`.

    // create a New Person:
    Person satoshi = Person(172, "Satoshi");
    
    // Add that person to the Array:
    people.push(satoshi);
    

We can also combine these together and do them in one line of code to keep things clean:

    people.push(Person(16, "Vitalik"));
    

Note that `array.push()` adds something to the **end** of the array, so the elements are in the order we added them. See the following example:

    uint[] numbers;
    numbers.push(5);
    numbers.push(10);
    numbers.push(15);
    // numbers is now equal to [5, 10, 15]
    

# Put it to the test

Let's make our createZombie function do something!

1. Fill in the function body so it creates a new `Zombie`, and adds it to the `zombies` array. The `name` and `dna` for the new Zombie should come from the function arguments.
2. Let's do it in one line of code to keep things clean.