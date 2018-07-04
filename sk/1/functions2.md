---
title: Verejné a súkromné funkcie
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

Pokiaľ nešpecifikujeme inak, viditelnosť funkcií je `public`. To znamená, že ktokoľvek (a akýkoľvek iný kontrakt) môže takúto funkciu volať a spustiť jej kód.

To však samozrejme nie je vždy to čo chceme a môže to spraviť náš kontrakt zranitelný voči útokom. Preto je dobrou praktikou vždy nastaviť viditelnosť našich funkcii na `private` a zmeniť na `public` až vo chvíli, keď sa rozhodneme že chceme aby funkciu mohli volať aj ostatní.

Poďme sa pozrieť na to, ako môžeme deklarovať súkromnú (`private`) funkciu.

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

To znamená, že jedine ostatné funkcie inštancie našeho kontraktu budú schopné volať túto funkciu a pridávať čísla do poľa `numbers`.

Ako vidíš, používame kľučové slovo `private` za názvom funkcie. Podobne ako pre názvy funkčných parametrov, je konvenciou začínať názvy `private` funkcii s podtržítkom (`_`).

# Vyskúšaj si to sám

Funkcia našeho kontraktu `createZombie` má implicitne viditelnosť nastavenú na `public`. Ktokoľvek ju môže zavolať a vytvoriť nového Zombie v našom kontrakte. Poďme ju spraviť súkromnú.

1. Uprav `createZombie` tak, aby bola súkromnou (`private`) funkciou. Nezabudni na konvenciu pri pomenovávání súkromných funkcií.
