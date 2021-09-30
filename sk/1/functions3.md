s---
title: Niečo viac o funkciách
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

          // začni písať tu

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

          }

      }
---

V tejto kapitole sa naučíme o **_návratových hodnotách_** funkcie a funkčných modifikátoroch.

## Návratové hodnoty

Aby sme vrátili hodnotu z funkcie, deklarácia musí vyzerať takto:

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

Deklarácia funkcie v Solidity obsahuje typ návratovej hodnoty (v tomto prípade `string`).

## Funkčné modifikátory

Funkcie vyššie vlastne ale nijak nemení stav kontraktu. Nemení ani nezapisuje žiadne hodnoty.  

V takom prípade deklarujeme funkcie ako funkcie kategórie **_view_**. To značí, že funkcia dáta iba číta, no nemodifikuje ich.

```
function sayHello() public view returns (string) {
```

Solidity taktiež obsahuje funkcie kategórie **_pure_**, čo signalizuje, že funkcia dokonca ani nepristupuje ku žiadnym dátam kontraktu. Napríklad:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Takáto funkcia nemodifikuje a ani žiadne dáta kontraktu nečíta - návratová hodnota tejto funkcie závisí len od jej funkčných parametrov. Takže práve v tomto prípade by sme funkciu deklarovali ako **_pure_** funkciu.

> Note: Môže byť náročné si dať pozor a vždy správne označiť funkcie ako pure/view. Našťastie nás Solidity kompilátor upozorní vždy keď je to nutné, aby sme nejakú funkciu označiť jedným z týchto modifikátorov.


# Vyskúšaj si to sám

Budeme potrebovať pomocnú funkciu, ktorá generuje náhodné DNA z reťazca. 

1. Vytvor funkciu pomenovanú `_generatePseudoRandomDna` s viditelnosťou `private`. Bude príjmať jediný argument nazvaný `_str` (a `string`) a vracať bude hodnotu typu `uint`;

2. Táto funkcia bude používať niektoré premenné našeho kontraktu, no nebude ich nijak modifikovať, preto ju označíme ako `view`.

3. Telo funkcie by zatiaľ malo zostať prázdne. Doplníme ho neskôr.
