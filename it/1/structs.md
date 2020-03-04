---
title: Strutture
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // inizia qui

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

      }
---

A volte è necessario un tipo di dati più complesso. Per questo Solidity fornisce **_structs_**:

```
struct Person {
  uint age;
  string name;
}

```
Le strutture (**_structs_**) consentono di creare tipi di dati più complicati con proprietà multiple.

> Nota che abbiamo appena introdotto un nuovo tipo `string`. Le stringhe vengono utilizzate per dati UTF-8 di lunghezza arbitraria. Es. `string greeting = "Ciao mondo!"`

# Facciamo una prova

Nella nostra app, vorremmo creare alcuni zombi! E gli zombi avranno più proprietà, quindi questo è un caso d'uso perfetto per una struttura.

1. Crea una `struct` chiamata `Zombie`.

2. La nostra struttura `Zombie` avrà 2 proprietà: `name` (una `string`) e `dna` (un `uint`).
