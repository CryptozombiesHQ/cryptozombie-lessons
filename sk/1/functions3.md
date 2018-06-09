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

          function _generateRandomDna(string _str) private view returns (uint) {

          }

      }
---

V tejto kapitelo sa naučíme o **_návratových hodnotách_** funkcie a funkčných modifikátoroch.
In this chapter, we're going to learn about Function **_return values_**, and function modifiers.

## Návratové hodnoty
## Return Values

Aby sme vrátili hodnotu z funkcie, deklarácia musí vyzerať takto:
To return a value from a function, the declaration looks like this:

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

Deklarácia funkcie v Solidity obsahuje typ návratovej hodnoty (v tomto prípade `string`).
In Solidity, the function declaration contains the type of the return value (in this case `string`).

## Funkčné modifikátory
## Function modifiers

Funkcie vyššie vlastne ale nijak nemení stav kontraktu - nemení ani nezapisuje žiadne hodnoty.  
The above function doesn't actually change state in Solidity — e.g. it doesn't change any values or write anything.

V takom prípade deklarujeme funkcie ako funkcie kategórie **_view_**. To označuje že funkcia dáta iba číta, no nemodifikuje ich:
So in this case we could declare it as a **_view_** function, meaning it's only viewing the data but not modifying it:

```
function sayHello() public view returns (string) {
```

Solidity taktiež obsahuje funkcie kategórie **_pure_**, čo znamená že funkcia dokonca ani nepristupuje ku žiadnym dátam kontraktu. Napríklad:
Solidity also contains **_pure_** functions, which means you're not even accessing any data in the app. Consider the following:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Takáto funkcia nemodifikuje a ani žiadne dáta kontraktu nečíta - návratová hodnota tejto funkcie závisí len od jej funkčných parametrov. Takže práve v tomto prípade by sme funkciu deklarovali ako **_pure_** funkciu.
This function doesn't even read from the state of the app — its return value depends only on its function parameters. So in this case we would declare the function as **_pure_**.

> Note: Môže byť náročné si dať pozor a vždy správne označiť funkcie ako pure/view. Našťastie, Solidity kompilátor nás vždy upozorní keď treba, aby sme funkcie vhodne označili jedným z týchto modifikátorov.
> Note: It may be hard to remember when to mark functions as pure/view. Luckily the Solidity compiler is good about issuing warnings to let you know when you should use one of these modifiers.


# Vyskúšaj si to sám
# Put it to the test

Budeme potrebovať pomocnú funkciu, ktorá generuje náhodné DNA z reťazca. 
We're going to want a helper function that generates a random DNA number from a string.

1. Vytvor funkciu pomenovanú `_generateRandomDna` s viditelnosťou `private`. Bude príjmať jediný argument nazvaný `_str` (a `string`) a vracať bude hodnotu typu `uint`;
1. Create a `private` function called `_generateRandomDna`. It will take one parameter named `_str` (a `string`), and return a `uint`.

2. Táto funkcia bude používať niektoré premenne našeho kontraktu, no nebude ich nijak modifikovať, preto ju označíme ako `view`.
2. This function will view some of our contract's variables but not modify them, so mark it as `view`.

3. Telo funkcie by zatiaľ malo zostať prázdne - doplníme neskôr.
3. The function body should be empty at this point — we'll fill it in later.
