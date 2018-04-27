---
title: Variabili di stato & Interi
actions:
  - controllaRisposta
  - suggerimenti
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
Ottimo lavoro! Ora che abbiamo un guscio per il nostro contratto, impariamo come Solidity si occupa delle variabili.

Le ***Variabili di stato*** sono archiviate permanentemente nella memoria del contratto. Ciò significa che sono scritte sulla blockchain Ethereum. Pensa a loro come scrivere su un DB.

##### Esempio:

    contract Example {
      // Questo sarà permanentemente memorizzato sulla blockchain
      uint myUnsignedInteger = 100;
    }
    

In questo contratto d'esempio, noi creiamo un `uint` chiamato `myUnsignedInteger` e lo impostiamo uguale a 100.

## Interi senza segno: `uint`

Il tipo di dato `uint` riguarda un numero intero senza segno, che significa che **il suo valore deve essere non-negativo**. Ci sarà anche un tipo di dato `int` per i numeri interi col segno.

> Note: In Solidity, `uint` is actually an alias for `uint256`, a 256-bit unsigned integer. You can declare uints with less bits — `uint8`, `uint16`, `uint32`, etc.. But in general you want to simply use `uint` except in specific cases, which we'll talk about in later lessons.

# Put it to the test

Our Zombie DNA is going to be determined by a 16-digit number.

Declare a `uint` named `dnaDigits`, and set it equal to `16`.