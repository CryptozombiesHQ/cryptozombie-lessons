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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Our contract is almost finished! Now let's add an **_event_**.
Náš kontrakt je takmer hotový. Poďme ešte pridať **event** . 

**Udalosti** sú spôsob akým náš kontrakt môže dať vedieť front endu tvojej aplikácie vedieť, že sa v tvojom kontrakte niečo nastalo. Tvoja aplikácia može sledovať vyvolanie určitých typov udalostí a reagovať keď nastanú. 
**_Events_** are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.

Príklad:
Example:

```
// deklaruj udalosť
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // vyvolaj udalosť aby sa naša aplikácia dozvedela že táto bola zavolaná táto funkcia
  // fire an event to let the app know the function was called:
  IntegersAdded(_x, _y, result);
  return result;
}
```

Front end tvojej aplikácie može sledovať vyvolanie tejto udalosti. Javascriptová implementácia by vyzerala zhruba takto:
Your app front-end could then listen for the event. A javascript implementation would look something like: 

```
YourContract.IntegersAdded(function(error, result) { 
  // nejaká reakcia na zachytenú eventu
}
```

# Vyskúšaj si to sám
# Put it to the test

Chceme aby náš kontrakt dal vedieť našej aplikácií zakaždým keď sa vytvorí nový zombie. Naša front end aplikácia s tak sama môže obnoviť a nového zombie zobraziť.
We want an event to let our front-end know every time a new zombie was created, so the app can display it.

1. Deklaruj `event` pomenovanú `NewZombie`. Táto udalosť by mala príjmať argumenty `zombieId` (typu `uint`), `name` (typu `string`) a `dna` (typu `uint`).
1. Declare an `event` called `NewZombie`. It should pass `zombieId` (a `uint`), `name` (a `string`), and `dna` (a `uint`).

2. Uprav funkciu `_createZombie` ktora vyvolá udalosť `NewZombie` po tom čo pridá nového Zombie do poľa `zombies`.
2. Modify the `_createZombie` function to fire the `NewZombie` event after adding the new Zombie to our `zombies` array. 

3. K vyvolaniu tejto udalosti budeš potrebovať `id` vytvoreného Zombie. Volanie `array.push()` vracia naspať `uint` reprezentujúci dĺžku novéh poľa - nakoľko prvý prvok poľa má index `0`, hodnota `array.push() - 1` sa bude rovnať indexu práve pridaného Zombie. Výsledok výrazu `array.push() - 1` si ulož do `uint` s menom `id`, aby si ho potom mohol predať ako argument pri vyvolávaní udalosti `NewZombie` na ďalšom riadku.
3. You're going to need the zombie's `id`. `array.push()` returns a `uint` of the new length of the array - and since the first item in an array has index 0, `array.push() - 1` will be the index of the zombie we just added. Store the result of `zombies.push() - 1` in a `uint` called `id`, so you can use this in the `NewZombie` event in the next line.
