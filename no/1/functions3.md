---
title: Flere funksjoner
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

          // start her

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

I dette kapittelets skal vi lære om funksjoners **_return verdier_**, og funksjon modifiseringer.

## Return Verdier

For å returnere en verdi fra en funksjon, deklarer slik:

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

I Solidity, når en deklarerer en funksjons retur verdier må en legge til hvilken type (i dette tilfelle `string`).

## Funksjon modifisering

Funksjonen over endrer egentlig ingenting i solidity — f.eks. endrer den ingen verdier eller skriver ingenting.

Så i dette tilfellet kan vi sette den som en **_view_** funksjon, som betyr at dens verdier bare kan leses og ikke kan endre noe:

```
function sayHello() public view returns (string) {
```

Solidity har også **_pure_** funksjoner, som betyr at du ikke en gang tar i bruk data i applikasjonen. Ta en titt på det følgende:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Denne funksjonen leser ikke fra statusen til appen engang — den returnerer informasjon som bare blir gitt fra parameterene. Så i dette tilfellet kan vi definere funksjonen som **_pure_**.

> Noter: Det kan være vanskelig å huske å definere funksjoner som pure/view. Heldigvis er Solidity sin kompilator flink til å gi deg varsler om hvor det kan være lurt å legge til en av disse modifisatorene.

# Test det

Vi kommer til å trenge en hjelpe-funksjon som genererer et tilfeldig DNA-nummer basert på en string

1. Lag en `private` funksjon kalt `_generatePseudoRandomDna`. Den vil ta ett parameter kalt `_str` (en `string`), og returnerer et `uint`.

2. Denne funksjonen kommer til å lese noen av kontraktens variabler, men ikke modifisere dem, så merk den som `view`. 

3. Funksjonen kan stå tom for nå — vi kommer til å fylle den inn senere.
