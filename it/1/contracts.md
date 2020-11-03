---
title: "Contratti"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Enter solidity version here

      //2. Crea qui il contratto
    answer: > 
      pragma solidity ^0.4.25;


      contract ZombieFactory {

      }
---

A partire dalle basi assolute:

Il codice di Solidity è incapsulato in **contratti**. Un `contract` è l'elemento fondamentale delle applicazioni Ethereum: tutte le variabili e le funzioni appartengono a un contratto e questo sarà il punto di partenza di tutti i vostri progetti.

Un contratto vuoto chiamato `HelloWorld` sarebbe simile al seguente:

```
contract HelloWorld {

}
```

## Versione Pragma

Tutto il codice sorgente di Solidity dovrebbe iniziare con a "version pragma" — una dichiarazione della versione del compilatore Solidity che questo codice dovrebbe usare. Questo per evitare problemi con le future versioni del compilatore che potrebbero generare eventuali rotture del codice.

Sarebbe così: `pragma solidity ^0.4.25;` (per l'ultima versione di Solidity al momento della stesura di questo documento, 0.4.25).

Mettendolo insieme, ecco un contratto di partenza semplice: la prima cosa che scriverai ogni volta che avvierai un nuovo progetto:

```
pragma solidity ^0.4.25;

contract HelloWorld {

}
```

# Facciamo una prova

Per iniziare a creare il nostro esercito di zombi, creiamo un contratto di base chiamato `ZombieFactory`.

1. Nella casella a destra, crea il nostro contratto utilizzando Solidity versione `0.4.25`.

2. Crea un contratto vuoto chiamato `ZombieFactory`.

Al termine, fai clic su "Verifica la risposta" di seguito. Se rimani bloccato, puoi fare clic su "Mostra suggerimento".
