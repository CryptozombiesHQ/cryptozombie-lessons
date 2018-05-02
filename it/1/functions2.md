---
title: Funzioni Private / Pubbliche
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
      zombies.push(Zombie(_name, _dna));
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      }
---
In Solidity, le funzioni sono `pubbliche` di default. Ciò significa che chiunque (o qualsiasi altro contratto) può chiamare la funzione del tuo contratto ed eseguire il suo codice.

Ovviamente questo non è sempre desiderabile, e può rendere il tuo contratto vulnerabile agli attacchi. Pertanto è consigliabile contrassegnare le tue funzioni come `private` come impostazione predefinita, e poi rendere solo `pubbliche` le funzioni che si vogliono fare conoscere al mondo.

Diamo un'occhiata a come dichiarare una funzione privata:

    uint[] numbers;
    
    function _addToArray(uint _number) private {
      numbers.push(_number);
    }
    

Questo significa che solo altre funzioni all'interno del nostro contratto saranno in grado di chiamare questa funzione e aggiungerla all'array `numeri`.

Come vedi, usiamo la parola chiave `private` dopo il nome della funzione. E come con i parametri di una funzione, per convenzione i nomi delle funzioni private iniziano con un (`_`).

# Facciamo un test

Our contract's `createZombie` function is currently public by default — this means anyone could call it and create a new Zombie in our contract! Let's make it private.

1. Modify `createZombie` so it's a private function. Don't forget the naming convention!