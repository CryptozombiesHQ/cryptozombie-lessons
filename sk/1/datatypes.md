---
title: State Variables & Integers
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Dobrá praca! Teraz keď už máme kostru našeho kontraktu, poďme sa naučiť ako sa Solidity správa k premenným.
Great job! Now that we've got a shell for our contract, let's learn about how Solidity deals with variables.


**Stavové premenné** su permanentne uložené v dátovom uložisku kontraktu. To znamená že su zapísané v Ethereum blockchaine. Zapisovanie do nich môžeš vnímať ako zapisovanie do databáze.
**_State variables_** are permanently stored in contract storage. This means they're written to the Ethereum blockchain. Think of them like writing to a DB.

##### Príklad:
##### Example:
```
contract Example {
  // Hodnota tejto premennej bude permentne uložená v blockchain 
  uint myUnsignedInteger = 100;
}
```

V tomto ukážkovom kontrakte sme deklarovali premennú `myUnsignedInteger` typu `uint` a nastavili sme jej hodnotu na 100.
In this example contract, we created a `uint` called `myUnsignedInteger` and set it equal to 100.

## Unsigned Integers: `uint`
## Unsigned Integers: `uint`

Dátový typ `uint` reprezentuje celé číslo bez znamienka, čo znamená že hodnoty ktoré môže nadobudnúť sú nezáporné. Existuje taktiež dátový typ `int` ktorý reprezentuje čisla so znamienkom.  
The `uint` data type is an unsigned integer, meaning **its value must be non-negative**. There's also an `int` data type for signed integers.

> Poznámka: V Solidity je `uint` v skutočnosti len skratka pre `uint256`, 256 bitové bezznamienkové čislo. Je možné taktiež deklarovať uint-y s menším počtom bitov -  — `uint8`, `uint16`, `uint32`, atď.. Obecne je ale doporučené používať proste `uint`, až na určité špecifické prípady. O tých si povieme v neskorších lekciách.
> Note: In Solidity, `uint` is actually an alias for `uint256`, a 256-bit unsigned integer. You can declare uints with less bits — `uint8`, `uint16`, `uint32`, etc.. But in general you want to simply use `uint` except in specific cases, which we'll talk about in later lessons.

# Vyskúšaj si to sám
# Put it to the test

Naše Zombie DNA bude určené 16 ciferným číslom.
Our Zombie DNA is going to be determined by a 16-digit number.

Deklaruj `uint` pomenovaný `dnaDigits` a nastav jeho hodnotu na `16`. 
Declare a `uint` named `dnaDigits`, and set it equal to `16`.
