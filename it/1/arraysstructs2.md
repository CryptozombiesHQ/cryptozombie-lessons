---
title: Lavorare con strutture e matrici
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie (string _name, uint _dna) {
              // inizia qui
          }

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie (string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Creare nuove strutture

Ricordi la nostra struttura `Person` nell'esempio precedente?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Adesso impareremo come creare nuovi `Person`s e ad aggiungerli nel nostro array `people`.

```
// crea una nuova Person:
Person satoshi = Person(172, "Satoshi");

// Aggiungere Person all'array
people.push(satoshi);
```

Possiamo anche combinarli insieme e farli in una sola riga di codice per mantenere le cose pulite:

```
people.push(Person(16, "Vitalik"));
```

Nota come `array.push()` aggiunge qualcosa alla **fine** dell'array, quindi gli elementi sono nell'ordine in cui li abbiamo aggiunti. Vedi il seguente esempio:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers adesso è uguale a: [5, 10, 15]
```

# Facciamo una prova

Facciamo in modo che la nostra funzione createZombie faccia qualcosa!

1. Riempi il body della funzione in modo che crei un nuovo `Zombie` e lo aggiunga all'array `zombies`. Il `name` ed il `dna` per il nuovo Zombie dovrebbero provenire dagli argomenti della funzione.
2. Facciamolo in una riga di codice per mantenere le cose pulite.
