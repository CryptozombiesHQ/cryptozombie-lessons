---
title: Array-er
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

      }
---

Når du vil ta i bruk en kolleksjon av elementer kan du bruke en **_array_**. Det er to forskjellinge typer Array i Solidity: **_fixed_** arrays og **_dynamic_** arrays:

```
// Array med en fastslått lengde på 2 strings:
uint[2] fixedArray;
// en annen fastslått Array, denne kan holde 5 strings:
string[5] stringArray;
// En dynamisk Array - har ingen fastslått lengde, kan forsette å bli større:
uint[] dynamicArray;
```

Du kan også lage en array av **_structs_**. Ved å ta i bruk forrige kapittels `Person` struct:

```
Person[] people; // dynamisk Array, vi kan fortsette å legge til elementer
```

Husk at status variabler er lagret direkte på Blockchain-en. Så å lage en dynamisk array av structs som dette kan bli brukt til å lagre strukturert data i contract-en din, litt som en database.

## Offentlige Array-er

Du kan deklarere en array som `public`, og Solidity vil automatisk lage en **_getter_** metode for den. Syntaksen ser slik ut:

```
Person[] public people;
```

Andre contracts vil da ha mulighet til å lese (men ikke skrive til) denne array-en. So this is a useful pattern for storing public data in your contract. Så dette er en hjelpsom metode for å lagre offentlig data i kontrakten din.

# Test det

Vi kommer til å ville lagre en hel gjeng med Zombier i appen vår. Og vi kommer til å ville vise frem alle zombiene våre til andre apper, så vi vil at det skal være offentlig (public).

1. Lag en offentlig(public) array av `Zombie` **_structs_**, og gi den navnet `zombies`.
