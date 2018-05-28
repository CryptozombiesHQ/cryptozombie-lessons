---
title: Funkcje Private / Public
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
      zombies.push(Zombie(_name, _dna));
      }
      
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
W Solidity, funkcje są domyślnie publiczne (`public`). Oznacza to, że każdy (lub każdy inny kontrakt) może wywołać funkcję z Twojego kontraktu i jej kod się wykona.

Oczywiście to nie zawsze jest pożądane i może spowodować, że Twój kontrakt będzie podatny na ataki. Zatem dobrą praktyką jest oznaczanie funkcji domyślnie jako prywatną (`private`), a wprowadzić zmianę na `public` wtedy, gdy chcesz ją pokazać światu.

Spójrzmy jak zadeklarować funkcje prywatną:

    uint[] numbers;
    
    function _addToArray(uint _number) private {
      numbers.push(_number);
    }
    

To spowoduje, że tylko funkcje znajdujące się wewnątrz kontraktu będą mogły wywołać naszą funkcję i dodać `numbers` do tablicy.

As you can see, we use the keyword `private` after the function name. And as with function parameters, it's convention to start private function names with an underscore (`_`).

# Put it to the test

Our contract's `createZombie` function is currently public by default — this means anyone could call it and create a new Zombie in our contract! Let's make it private.

1. Modify `createZombie` so it's a private function. Don't forget the naming convention!