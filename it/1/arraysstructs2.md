---
title: Lavorando con Structs e Arrays
actions:
  - 'controllaRisposta'
  - 'suggerimenti'
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

Creiamo la nostra funzione createZombie in modo che faccia qualcosa!

1. Compila il corpo della funzione in modo da creare un nuovo `Zombie`, e aggiugilo all' array `zombies`. Il `nome` e il `dna` per il nuovo zombie dovrebbero arrivare dagli argomenti della funzione.
2. Facciamolo in una riga di codice per mantenere le cose pulite.