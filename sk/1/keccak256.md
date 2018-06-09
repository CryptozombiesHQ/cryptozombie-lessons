---
title: Keccak256 and pretypovanie
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              // začni písať tu
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Chceme aby naša funkcia `_generateRandomDna` vracala naspať (pseudo) nahodnú hodnotu typu `uint`. Ako to môžme dosiahnuť? 
We want our `_generateRandomDna` function to return a (semi) random `uint`. How can we accomplish this?

Ethereum má do seba vstavanú hash funkciu `keccak256`, čo je istá verzia SHA3. Hash funkcie mapujú vstupný reťazec znakov na nahodný 256-bitové hexadecimálne čislo. Len malá zmena v reťazci spôsobí obrovskú zmenu vo výslednom hashi. 
Ethereum has the hash function `keccak256` built in, which is a version of SHA3. A hash function basically maps an input string into a random 256-bit hexidecimal number. A slight change in the string will cause a large change in the hash.

To je pre Ethereum užitočné z mnohých dôvodov, ale v našom prípade túto hash funkciu využijeme na generovanie pseudo náhodného čísla.
It's useful for many purposes in Ethereum, but for right now we're just going to use it for pseudo-random number generation.

Príklad:
Example:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Ako vidíš, návratové hodnoty hash funkcie sa kompletne zmenili, napriek tomu že sa upravili len jeden znak vstupného reťazca.
As you can see, the returned values are totally different despite only a 1 character change in the input.

> Poznámka: **Bezpečné** generovanie náhodných čísel na blockchain je veľmi náročná úloha. Metóda ktorú teraz používame my nie je bezpečná, ale nakoľko bezpečnosť nie je top priorita pre naše Zombie DNA, bude nám to takto stačiť.
> Note: **Secure** random-number generation in blockchain is a very difficult problem. Our method here is insecure, but since security isn't top priority for our Zombie DNA, it will be good enough for our purposes.

## Pretypovanie
## Typecasting

Občas potrebujeme skonvertovať dátové typy. Napríklad:
Sometimes you need to convert between data types. Take the following example:

```
uint8 a = 5;
uint b = 6;
// vyhodí error, pretože a * b vracia uint, nie uint8
// throws an error because a * b returns a uint, not uint8:
uint8 c = a * b; 
// aby to fungovalo, musíme pretypovať premmnú b na uint8
// we have to typecast b as a uint8 to make it work:
uint8 c = a * uint8(b); 
```


V uvedenom príklade `a * b` vracia `uint`, avšak my sa výsledok snažíme uložiť ako `uint8`, čo môže potenciálne viesť k problémom. Tým že explicitne pretypujeme `b` zaručíme že náš výsledok bude typu `uint8` a kompilátor nám nebude vracať error.
In the above, `a * b` returns a `uint`, but we were trying to store it as a `uint8`, which could cause potential problems. By casting it as a `uint8`, it works and the compiler won't throw an error.

# Vyskúšaj si to sám
# Put it to the test

Poďme teraz vyplniť telo našej funkcie `_generateRandomDna`! Toto je treba spraviť:
Let's fill in the body of our `_generateRandomDna` function! Here's what it should do:

1. Prvý riadok kódu by mal spraviť `keccak256` hash reťazca `_str` a vygenerovať tak psedo náhodné hexadecimálne čislo, pretypovať ho na `uint` a nakoniec uložiť výsledok v premennej `rand` typu `uint`.
1. The first line of code should take the `keccak256` hash of `_str` to generate a pseudo-random hexidecimal, typecast it as a `uint`, and finally store the result in a `uint` called `rand`.

2. Chceme aby naše DNA bolo 16 cifier dlhé (spomínaš si na náš `dnaModulus`?). Takže druhý riadok kódu by mal použiť `return` a vrátiť z funkcie modulus (`%`) `dnaModulus` našeho pseudo náhodného čísla.
2. We want our DNA to only be 16 digits long (remember our `dnaModulus`?). So the second line of code should `return` the above value modulus (`%`) `dnaModulus`.
