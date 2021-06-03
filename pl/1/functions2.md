---
title: Funkcje Private / Public
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
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

W Solidity, funkcje są domyślnie publiczne (`public`). Oznacza to, że każdy (lub każdy inny kontrakt) może wywołać funkcję z Twojego kontraktu i jej kod się wykona.

Obviously this isn't always desirable, and can make your contract vulnerable to attacks. Zatem dobrą praktyką jest oznaczanie funkcji domyślnie jako prywatną (`private`), a wprowadzić zmianę na `public` wtedy, gdy chcesz ją pokazać światu.

Spójrzmy jak zadeklarować funkcje prywatną:

    uint[] numbers;
    
    function _addToArray(uint _number) private {
      numbers.push(_number);
    }
    

To spowoduje, że tylko funkcje znajdujące się wewnątrz kontraktu będą mogły wywołać naszą funkcję i dodać `numbers` do tablicy.

Jak widzisz, używamy słowa kluczowego `private` po nazwie funkcji i podobnie jak przy parametrach, nazwę funkcji poprzedzamy podkreślnikiem (`_`).

# Wypróbujmy zatem

Nasza funkcja `createZombie` jest obecnie publiczna domyślnie — oznacza to, że każdy może ją wywołać i utworzyć nowego Zombiaka w naszym kontrakcie! Uczyńmy ją prywatną.

1. Zmodyfikuj `createZombie` jako funkcję prywatną. Nie zapomnij o konwencji nazewnictwa!