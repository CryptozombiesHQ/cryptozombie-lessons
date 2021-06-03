---
title: Variabili di stato & Interi
actions:
  - 'controllaRisposta'
  - 'suggerimenti'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      //start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

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

> Nota: in Solidity, `uint` è in realtà un alias per `uint256`, un numero intero senza segno a 256-bit. Puoi dichiarare uints con meno bits — `uint8`, `uint16`, `uint32`, etc.. Ma in generale si può semplicemente usare `uint` tranne in casi specifici, di cui parleremo nelle lezioni successive.

# Facciamo un test

Il nostro DNA Zombie sarà determinato da un numero di 16 cifre.

Dichiara un `uint` nominato `dnaDigits`, e impostalo uguale a `16`.