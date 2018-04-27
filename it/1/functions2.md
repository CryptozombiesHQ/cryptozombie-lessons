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

Ovviamente questo non è sempre desiderabile, e può rendere il tuo contratto vulnerabile agli attacchi. Thus it's good practice to mark your functions as `private` by default, and then only make `public` the functions you want to expose to the world.

Let's look at how to declare a private function:

    uint[] numbers;
    
    function _addToArray(uint _number) private {
      numbers.push(_number);
    }
    

This means only other functions within our contract will be able to call this function and add to the `numbers` array.

As you can see, we use the keyword `private` after the function name. And as with function parameters, it's convention to start private function names with an underscore (`_`).

# Put it to the test

Our contract's `createZombie` function is currently public by default — this means anyone could call it and create a new Zombie in our contract! Let's make it private.

1. Modify `createZombie` so it's a private function. Don't forget the naming convention!