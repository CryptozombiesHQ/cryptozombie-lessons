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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Naša funkcia `_generatePseudoRandomDna` by mala vracala naspať (pseudo) nahodnú hodnotu typu `uint`. Ako to môžme dosiahnuť? 

Ethereum má do seba vstavanú hash funkciu `keccak256`. Je to typ známej hashovacej funkcie SHA3. Hash funkcie mapujú vstupný reťazec znakov na nahodné 256-bitové hexadecimálne čislo. Len malá zmena vo vstupe spôsobí obrovskú zmenu vo výslednom hashi. 

To je pre Ethereum užitočné z mnohých dôvodov, ale v našom prípade túto hash funkciu využijeme na generovanie pseudo náhodného čísla.

Príklad:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Ako vidíš, návratové hodnoty hash funkcie sa kompletne zmenili, a to napriek tomu, že sme upravili len jediný znak vstupného reťazca.

> Poznámka: **Bezpečné** generovanie náhodných čísel na blockchaine je veľmi náročná úloha. Metóda ktorú teraz používame my nie je celkom bezpečná, ale nakoľko bezpečnosť nie top priorita pre naše Zombie DNA, uspokojíme sa s ňou.

## Pretypovanie

Občas potrebujeme skonvertovať dátové typy. Napríklad:

```
uint8 a = 5;
uint b = 6;
// vyhodí error, pretože a * b vracia uint, nie uint8
uint8 c = a * b; 
// aby to fungovalo, musíme pretypovať premmnú b na uint8
uint8 c = a * uint8(b); 
```


V uvedenom príklade `a * b` vracia `uint`, my sa však výsledok snažíme uložiť ako `uint8`. To môže potenciálne viesť k problémom. Tým že explicitne pretypujeme `b` zaručíme, že náš výsledok bude typu `uint8` a kompilátor nám nevráti error.

# Vyskúšaj si to sám

Poďme teraz vyplniť telo našej funkcie `_generatePseudoRandomDna`! Toto je treba spraviť:

1. Prvý riadok kódu by mal spraviť `keccak256` hash reťazca `_str` a vygenerovať tak psedo náhodné hexadecimálne čislo, pretypovať ho na `uint` a nakoniec uložiť výsledok v premennej `rand` typu `uint`.

2. Chceme, aby naše DNA bolo 16 cifier dlhé (spomínaš si na náš `dnaModulus`?). Takže druhý riadok kódu by mal použiť `return` a vrátiť z funkcie modulus (`%`) `dnaModulus` našeho pseudo náhodného čísla.
