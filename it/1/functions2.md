---
title: Funzioni Private / Pubbliche
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

In Solidity, le funzioni sono `public` di default. Ciò significa che chiunque (o un qualsiasi altro contratto) può richiamare la funzione del contratto ed eseguirne il codice.

Ovviamente ciò non è sempre auspicabile e può rendere il contratto vulnerabile agli attacchi. Quindi è buona norma contrassegnare le tue funzioni come `private` di default, e rendere `public` solo le funzioni che vuoi esporre al mondo.

Diamo un'occhiata a come dichiarare una funzione privata:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

Ciò significa che solo altre funzioni all'interno del nostro contratto saranno in grado di richiamare questa funzione ed aggiungere l'array `numbers`.

Come puoi vedere, usiamo la parola chiave `private` dopo il nome della funzione. E come per i parametri delle funzioni, è normale avviare nomi di funzioni private con un trattino basso (`_`).

# Facciamo una prova

La funzione `createZombie` del nostro contratto è attualmente pubblica per impostazione predefinita - questo significa che chiunque potrebbe richiamarla e creare un nuovo Zombie nel nostro contratto! Rendiamola privata.

1. Modifica `createZombie` in modo che sia una funzione privata. Non dimenticare la convenzione di denominazione!
