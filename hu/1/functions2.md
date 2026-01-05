---
title: Privát / Nyilvános függvények
actions: ['checkAnswer', 'hints']
requireLogin: true
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

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

A Solidity-ben a függvények alapértelmezetten `public`-ok. Ez azt jelenti, hogy bárki (vagy bármely más szerződés) meghívhatja a szerződésed függvényét és végrehajthatja a kódját.

Nyilvánvalóan ez nem mindig kívánatos, és sebezhetővé teheti a szerződésedet támadásokkal szemben. Ezért jó gyakorlat, ha a függvényeidet alapértelmezetten `private`-ként jelölöd meg, majd csak azokat teszéd `public`-ká, amelyeket ki szeretnél tenni a világnak.

Nézzük meg, hogyan deklarálunk egy privát függvényt:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

Ez azt jelenti, hogy csak a szerződésünkön belüli más függvények hívhatják meg ezt a függvényt és adhatnak hozzá a `numbers` tömbhöz.

Ahogy látod, a `private` kulcsszót a függvény neve után használjuk. És ahogy a függvény paramétereknél, konvenció, hogy a privát függvény neveket aláhúzással (`_`) kezdjük.

# Tegyük próbára

A szerződésünk `createZombie` függvénye jelenleg alapértelmezetten nyilvános — ez azt jelenti, hogy bárki meghívhatná és létrehozhatna egy új Zombie-t a szerződésünkben! Tegyük priváttá.

1. Módosítsd a `createZombie`-t, hogy privát függvény legyen. Ne felejtsd el a névkonvenciót!
