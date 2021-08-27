---
title: Udalosti
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // udalosť deklaruj tu

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // udalosť nového Zombie vyvolaj tu
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Náš kontrakt je takmer hotový. Poďme ešte pridať **udalosti**.

**Udalosti** (**_Events_**) sú spôsob, ako kontrakt môže dať vedieť front endu tvojej aplikácie vedieť, že sa v tvojom kontrakte niečo nastalo. Tvoja aplikácia može sledovať vyvolanie určitých typov udalostí a reagovať keď nastanú. 

Príklad:

```
// deklaruj udalosť
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // vyvolaj udalosť aby sa naša aplikácia dozvedela že táto bola zavolaná táto funkcia
  IntegersAdded(_x, _y, result);
  return result;
}
```

Front end tvojej aplikácie môže sledovať vyvolanie tejto udalosti. Javascriptová implementácia by vyzerala zhruba takto:

```
YourContract.IntegersAdded(function(error, result) { 
  // nejaká reakcia na zachytenú eventu
}
```

# Vyskúšaj si to sám

Chceme, aby náš kontrakt dal vedieť našej aplikácií zakaždým, keď sa vytvorí nový zombie. Front end našej aplikácie sa tak sám môže obnoviť a zobraziť nového zombie.

1. Deklaruj udalosť (`event`) pomenovaný `NewZombie`. Táto udalosť by mala príjmať argumenty `zombieId` (typu `uint`), `name` (typu `string`) a `dna` (typu `uint`).

2. Uprav funkciu `_createZombie`, aby po pridaní nového Zombie do poľa `zombies` vyvolala udalosť `NewZombie`.

3. K vyvolaniu tejto udalosti budeš potrebovať `id` vytvoreného Zombie. Volanie `array.push()` vracia naspať `uint` reprezentujúci dĺžku novéh poľa - nakoľko prvý prvok poľa má index `0`, hodnota `array.push() - 1` sa bude rovnať indexu práve pridaného Zombie. Výsledok výrazu `array.push() - 1` si ulož do `uint` s menom `id`, aby si ho potom mohol predať ako argument pri vyvolávaní udalosti `NewZombie` na ďalšom riadku.
