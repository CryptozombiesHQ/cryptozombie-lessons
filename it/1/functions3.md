---
title: Altre Informazioni sulle Funzioni
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

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {

          }

      }
---

In questo capitolo impareremo i **_valori di ritorno_** della funzione e i modificatori di funzione.

## Valori di Ritorno

Per restituire un valore da una funzione la dichiarazione è simile alla seguente:

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

In Solidity, la dichiarazione di funzione contiene il tipo del valore restituito (in questo caso `string`).

## Modificatori di Funzioni

La funzione sopra non cambia effettivamente lo stato in Solidity - ad es. non cambia alcun valore né scrive nulla.

Quindi in questo caso potremmo dichiararla come una funzione **_view_**, il che significa che stai solo visualizzando i dati senza modificarli:

```
function sayHello() public view returns (string) {
```

Solidity contiene anche le funzioni **_pure_**, il che significa che non stai accedendo a nessun dato nell'app. Considera quanto segue:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Questa funzione non legge nemmeno dallo stato dell'app - il suo valore di ritorno dipende solo dai parametri della sua funzione. Quindi in questo caso dichiareremo la funzione come **_pure_**.

> Nota: potrebbe essere difficile ricordare quando contrassegnare le funzioni come pure/view. Fortunatamente il compilatore Solidity è bravo ad emettere avvisi per farti sapere quando dovresti usare uno di questi modificatori.

# Facciamo una prova

Vogliamo una funzione di aiuto che generi un numero di DNA casuale da una stringa.

1. Creare una funzione `private` chiamata` _generatePseudoRandomDna`. Prenderà un parametro chiamato `_str` (una` string`) e restituirà un `uint`.

2. Questa funzione visualizzerà alcune delle variabili del nostro contratto ma non le modificherà, contrassegnala quindi come `view`.

3. Il body della funzione dovrebbe essere vuoto a questo punto - lo riempiremo più avanti.
