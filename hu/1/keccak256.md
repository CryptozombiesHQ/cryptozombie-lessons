---
title: Keccak256 és típuskonverzió
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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              // kezdj itt
          }

      }
    answer: >
      pragma solidity  >=0.5.0 <0.6.0;


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

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

      }
---

Azt szeretnénk, hogy a `_generateRandomDna` függvényünk egy (félig) véletlenszerű `uint`-ot adjon vissza. Hogyan érhetjük ezt el?

Az Ethereum beépített hash függvénye a `keccak256`, amely a SHA3 egy verziója. Egy hash függvény alapvetően egy bemenetet egy véletlenszerű 256 bites hexadecimális számmá képez le. A bemenet egy kis változása nagy változást okoz a hash-ben.

Sok célra hasznos az Ethereumban, de most csak pszeudo-véletlenszám generálásra fogjuk használni.

Fontos még, hogy a `keccak256` egy `bytes` típusú paramétert vár. Ez azt jelenti, hogy "csomagolnunk" kell a paramétereket, mielőtt meghívjuk a `keccak256`-ot:

Példa:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256(abi.encodePacked("aaaab"));
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256(abi.encodePacked("aaaac"));
```

Ahogy látod, a visszatérési értékek teljesen mások, annak ellenére, hogy csak 1 karakter változott a bemenetben.

> Megjegyzés: **Biztonságos** véletlenszám generálás a blockchainben egy nagyon nehéz probléma. A módszerünk itt nem biztonságos, de mivel a biztonság nem elsődleges prioritás a Zombie DNS-nél, elég lesz a céljainkhoz.

## Típuskonverzió

Néha konvertálnod kell az adattípusok között. Nézd meg a következő példát:

```
uint8 a = 5;
uint b = 6;
// hibát dob, mert a * b egy uint-ot ad vissza, nem uint8-at:
uint8 c = a * b;
// típuskonverzióval kell b-t uint8-ra konvertálnunk, hogy működjön:
uint8 c = a * uint8(b);
```

A fentiekben az `a * b` egy `uint`-ot ad vissza, de `uint8`-ként próbáltuk tárolni, ami potenciális problémákat okozhat. `uint8`-ra konvertálva működik, és a fordító nem dob hibát.

# Tegyük próbára

Töltsük ki a `_generateRandomDna` függvényünk törzsét! Íme, mit kell csinálnia:

1. Az első sor kódnak a `keccak256` hash-ét kell vennie az `abi.encodePacked(_str)`-nek, hogy generáljon egy pszeudo-véletlenszerű hexadecimális számot, konvertálja `uint`-ra, és végül tárolja az eredményt egy `rand` nevű `uint`-ban.

2. Azt szeretnénk, hogy a DNS-ünk csak 16 számjegy hosszú legyen (emlékszel a `dnaModulus`-ra?). Tehát a második sor kódnak `return`-ölnie kell a fenti értéket modulus (`%`) `dnaModulus`-szal.
