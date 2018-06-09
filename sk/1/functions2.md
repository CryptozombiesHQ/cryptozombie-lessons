---
title: Private / Public Funkcie
actions: ['checkAnswer', 'hints']
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

Pokiaľ nešpecifikujeme inak, viditelnosť funkcií je `public`. To znamená že ktokoľvek (a akýkoľvek iný kontrakt) môže takúto funkciu volať a spustiť jej kód.
In Solidity, functions are `public` by default. This means anyone (or any other contract) can call your contract's function and execute its code.

To však samozrejme nie je vždy to čo chceme, a môže to spraviť náš kontrakt zranitelný voči útokom. Preto je dobrou praktikou vždy nastaviť viditelnosť našich funkcii na `private` a zmeniť na `public` až vo chvíli keď sa rozhodneme že je dobré aby s danou funkciou mohli pracovať ostatní.
Obviously this isn't always desireable, and can make your contract vulnerable to attacks. Thus it's good practice to mark your functions as `private` by default, and then only make `public` the functions you want to expose to the world.

Poďme sa pozrieť na to ako môžeme deklarovať privátnu funkciu.
Let's look at how to declare a private function:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

To znamená, že jedine ostatné funkcie inštancie našeho kontraktu budú schopné volať túto funkciu a pridávať čísla do poľa `numbers`.
This means only other functions within our contract will be able to call this function and add to the `numbers` array.

Ako vidíš, používame kľučové slovo `private` za názvom funkcie. Podobne ako pre názvy funkčných parametrov, je konvenciou začínať názvy private funkcií s podtržítkom (`_`).
As you can see, we use the keyword `private` after the function name. And as with function parameters, it's convention to start private function names with an underscore (`_`).

# Vyskúšaj si to sám
# Put it to the test

Funkcia našeho kontraktu `createZombie` má implicitne viditelnosť nastavenú na public - to znamená že ktokoľvek ju môže zavolat a vytvoriť nového Zombie v našom kontrakte. Poďme ju spraviť privátnu.
Our contract's `createZombie` function is currently public by default — this means anyone could call it and create a new Zombie in our contract! Let's make it private.

1. Uprave `createZombie` tak aby bola privátnou funkciou. Nezabudni na konvenciu pri jej pomenovávání.
1. Modify `createZombie` so it's a private function. Don't forget the naming convention!
