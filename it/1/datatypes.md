---
title: Variabili di Stato e Numeri Interi
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          //inizia qui

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Ottimo lavoro! Ora che abbiamo una shell per il nostro contratto, impariamo come Solidity gestisce le variabili.

**_Le Variabili di Stato_** vengono memorizzate in modo permanente nella memoria dei contratti. Ciò significa che sono scritti sulla blockchain di Ethereum. Pensa a loro come a scrivere su un DB.

##### Example:
```
contract Example {
  // Questo verrà archiviato permanentemente nella blockchain
  uint myUnsignedInteger = 100;
}
```

In questo contratto di esempio abbiamo creato un `uint` chiamato` myUnsignedInteger` e lo abbiamo impostato su 100.

## Numeri Interi senza Segno: `uint`

Il tipo di dati `uint` è un numero intero senza segno, nel senso che **il suo valore NON deve essere negativo**. C'è anche un tipo di dati `int` per numeri interi con segno.

> Nota: In Solidity, `uint` è in realtà un alias per `uint256`, un numero intero a 256-bit senza segno. Puoi dichiarare uints con meno bits — `uint8`, `uint16`, `uint32`, etc.. Ma in generale vorrai semplicemente usare `uint` tranne in casi specifici, di cui parleremo nelle lezioni successive.

# Facciamo una prova

Il nostro DNA di zombi sarà determinato da un numero di 16 cifre.

Dichiarare un `uint` chiamato` dnaDigits` ed impostarlo uguale a `16`.
