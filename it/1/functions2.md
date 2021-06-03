---
title: Funzioni Private / Pubbliche
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

      function createZombie(string memory _name, uint _dna) public {
      zombies.push(Zombie(_name, _dna));
      }

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string memory _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      }
---

In Solidity, le funzioni sono `pubbliche` di default. Ciò significa che chiunque (o qualsiasi altro contratto) può chiamare la funzione del tuo contratto ed eseguire il suo codice.

Obviously this isn't always desirable, and can make your contract vulnerable to attacks. Pertanto è consigliabile contrassegnare le tue funzioni come `private` come impostazione predefinita, e poi rendere solo `pubbliche` le funzioni che si vogliono fare conoscere al mondo.

Diamo un'occhiata a come dichiarare una funzione privata:

    uint[] numbers;
    
    function _addToArray(uint _number) private {
      numbers.push(_number);
    }
    

Questo significa che solo altre funzioni all'interno del nostro contratto saranno in grado di chiamare questa funzione e aggiungerla all'array `numeri`.

Come vedi, usiamo la parola chiave `private` dopo il nome della funzione. E come con i parametri di una funzione, per convenzione i nomi delle funzioni private iniziano con un (`_`).

# Facciamo un test

La funzione `createZombie` del nostro contratto è impostata come pubblica in modo predefinito — questo significa che chiunque può chiamarla e creare un nuovo zombie nel nostro contratto! Reandiamola privata.

1. Modifica `createZombie` in modo da renderla una funzione privata. Non dimenticarti le convenzioni sui nomi!