---
title: Eventer
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // deklarer et event here

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // og kjør det her
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

Kontrakten vår er nesten ferdig! La oss legge til et **_event_**.

**_Eventer_** er en måte for kontrakten din til å kommunisere at noe skjedde i blockchain-en til front-end appen din, som kan 'lytte' etter spesielle eventer på blockchain-en.

Example:

```
// deklarer eventet
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // kjør eventet slik at appen kan se at funksjonen kjørte:
  IntegersAdded(_x, _y, result);
  return result;
}
```

Appen din, på front-end siden, kan lytte etter eventet. En JavaScript implementasjon vil se slik ut: 

```
YourContract.IntegersAdded(function(error, result) { 
  // Gjør noe med resultatet
}
```

# Test det

Vi vil at eventet skal la front-end appen vår vite hver gang en ny zombie blir laget, så appen kan vise det.

1. Deklarer et `event` kalt `NewZombie`. Den skal ha to argumenter `zombieId` (en `uint`), `name` (e  `string`), og `dna` (en `uint`).

2. Modifiser `_createZombie` funksjonen slik at den kjøre `NewZombie` eventet etter at den nye zombien er blir lagt til `zombies` array-en. 

3. Du kommer til å trenge den ny zombiens `id`. `array.push()` returnerer en `uint` av den nye lengden til arrayen - og siden det første elementet har indexen 0, kommer `array.push() - 1` til å være indexen til den nye zombien din. Lagre resultatet til `zombies.push() - 1` i en `uint` kalt `id`, så du kan bruke det i det nye `NewZombie` eventet på neste linje.
