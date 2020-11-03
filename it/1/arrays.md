---
title: Arrays
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

          // inizia qui

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

      }
---

Quando vuoi raccogliere qualcosa, puoi usare un **_array_**. Esistono due tipi di array in Solidity: array **_fissi_** ed array **_dinamici_**:

```
// Array con una lunghezza fissa di 2 elementi:
uint[2] fixedArray;
// un altro array fisso che può contenere 5 stringhe:
string[5] stringArray;
// Un array dinamico: non ha dimensioni fisse e può continuare a crescere:
uint[] dynamicArray;
```

Puoi anche creare una matrice di **_strutture_**. Utilizzando la struttura `Person` del capitolo precedente:
```
Person[] people; // array dinamico, possiamo continuare ad aggiungere strutture
```

Ricordi che le variabili di stato sono memorizzate in modo permanente nella blockchain? Quindi creare una array dinamico di strutture come questa può essere utile per la memorizzazione di dati strutturati nel contratto, un po' come un database.

## Array Pubblici

Puoi dichiarare un array come `pubblico`, Solidity creerà automaticamente un metodo **_getter_** per esso. La sintassi è:

```
Person[] public people;
```

Altri contratti sarebbero quindi in grado di leggere, ma non di scrivere, su questo array. Questo è un modello utile per l'archiviazione dei dati pubblici nel contratto.

# Facciamo una prova

Vogliamo archiviare un esercito di zombi nella nostra app. Vorremmo poi mostrare tutti i nostri zombi ad altre app, quindi dovrà essere pubblico.

1. Crea un array pubblico di **_strutture_** `Zombie`  e chiamalo `zombies`.