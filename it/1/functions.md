---
title: Dichiarazioni di Funzione
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

          function createZombie(string _name, uint _dna) {

          }

      }
---

Una dichiarazione di funzione di Solidity è simile alla seguente:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Questa è una funzione chiamata `eatHamburgers` che richiede 2 parametri: una `string` ed un `uint`. Per ora il body della funzione è vuoto.

> Nota: è una convenzione (ma non obbligatoria) avviare i nomi delle variabili dei parametri di funzione con un trattino basso (`_`) per differenziarli dalle variabili globali. Useremo questa convenzione in tutto il nostro tutorial.

Puoi chiamare la funzione in questo modo:

```
eatHamburgers("vitalik", 100);
```

# Facciamo una prova

Nella nostra app dovremo essere in grado di creare alcuni zombi. Creiamo una funzione per fare ciò.

1. Creare una funzione denominata `createZombie`. Ci vogliono due parametri: **\_name** (una `string`), e **\_dna** (un `uint`).

Lascia il body vuoto per ora — lo riempiremo più tardi.
