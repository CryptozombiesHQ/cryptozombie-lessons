---
title: Keccak256 e Typecasting
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

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
              // inizia qui
          }

      }
    answer: >
      pragma solidity ^0.4.25;


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
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

      }
---

Vogliamo che la nostra funzione `_generatePseudoRandomDna` restituisca un `uint` (semi) casuale. Come possiamo realizzarlo?

Ethereum ha la funzione hash `keccak256` integrata, che è una versione di SHA3. Una funzione hash che fondamentalmente mappa un input in un numero esadecimale casuale a 256 bit. Una leggera modifica nell'input provocherà una grande modifica nell'hash.

È utile per molti scopi in Ethereum, ma per ora lo useremo solo per la generazione di numeri pseudo-casuali.


Importante: `keccak256` prevede un singolo parametro di tipo` byte`. Ciò significa che dobbiamo "impacchettare" tutti i parametri prima di chiamare `keccak256`:

Esempio:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256(abi.encodePacked("aaaab"));
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256(abi.encodePacked("aaaac"));
```

Come puoi vedere, i valori restituiti sono totalmente diversi nonostante una modifica di un solo carattere nell'input.

> Nota: La generazione **sicura** di numeri casuali nella blockchain è un problema molto difficile. Il nostro metodo qui esposto è insicuro, ma poiché la sicurezza non è la massima priorità per il nostro DNA di zombi, andrà bene per i nostri scopi.

## Typecasting

A volte è necessario convertire i tipi di dati. Prendi il seguente esempio:

```
uint8 a = 5;
uint b = 6;
// genera un errore perché a * b restituisce un uint, non uint8:
uint8 c = a * b; 
// dobbiamo fare il typecast b come uint8 per farlo funzionare:
uint8 c = a * uint8(b); 
```

Come vedi sopra `a * b` restituisce un `uint`, ma stavamo provando a memorizzarlo come `uint8`, il che potrebbe causare potenziali problemi. Dichiarandolo come `uint8` funziona e il compilatore non genererà alcun errore.

# Facciamo una prova

Riempiamo il body della nostra funzione `_generatePseudoRandomDna`! Ecco cosa dovrebbe fare:

1. La prima riga di codice dovrebbe prendere l'hash `keccak256` di `abi.encodePacked(_str)` per generare un esadecimale pseudo-casuale, dichiararlo come` uint` ed infine archiviare il risultato in un `uint` chiamato `rand`.

2. Vogliamo che il nostro DNA sia lungo solo 16 cifre (ricordi il nostro `dnaModulus`?). Quindi la seconda riga di codice dovrebbe esssere la `return` del valore `rand` (`%`) `dnaModulus`.
