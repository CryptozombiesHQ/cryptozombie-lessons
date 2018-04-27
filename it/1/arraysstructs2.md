---
title: Lavorando con Structs e Arrays
actions:
  - controllaRisposta
  - suggerimenti
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
      // inizia qui
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
### Creazione di nuove Structs

Ricordi la nostra struct di `Persona` nell' esempio precedente?

    struct Person {
      uint age;
      string name;
    }
    
    Person[] public people;
    

Adesso andremo a imparare come creare una nuova `Persona` e aggiungerla all' array delle nostre `persone`.

    // creare una Nuova Persona:
    Person satoshi = Person(172, "Satoshi");
    
    // Aggiungere quella persona all' Array:
    people.push(satoshi);
    

Possiamo inoltre combinare questi elementi insieme ed eseguirli in una sola riga di codice per mantenere le cose pulite:

    people.push(Person(16, "Vitalik"));
    

Nota che `array.push()` aggiunge qualcosa alla **fine** dell' array, quindi gli elementi rimangono nell'ordine in cui li abbiamo aggiunti. Come nel seguente esempio:

    uint[] numbers;
    numbers.push(5);
    numbers.push(10);
    numbers.push(15);
    // i numeri sono ora equivalenti a [5, 10, 15]
    

# Facciamo un test

Let's make our createZombie function do something!

1. Fill in the function body so it creates a new `Zombie`, and adds it to the `zombies` array. The `name` and `dna` for the new Zombie should come from the function arguments.
2. Let's do it in one line of code to keep things clean.