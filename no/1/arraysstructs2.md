---
title: Jobbing me Structs og Arrays
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

          function createZombie(string _name, uint _dna) {
              // start her
          }

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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Lag en ny Struct

Husker du `Person` struct-en fra de tidligere eksemplene?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Nå skal vi lære hvordan lage nye `Person`er og legge dem til i vår `people` array.

```
// Lag en ny person:
Person satoshi = Person(172, "Satoshi");

// Legg til personen i Array-en:
people.push(satoshi);
```

Vi kan også kombinere disse og gjøre alt på en linje for å holde det minimalistisk:

```
people.push(Person(16, "Vitalik"));
```

Noter at `array.push()` legger noe til i **enden** av array-en, så elementet blir lagt til i rekkefølgen vi legger dem til. Se det følgende eksempelet:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers er lik [5, 10, 15]
```

# Test det

La oss få createZombie funksjonen til å gjøre noe!

1. Fyll inn funksjonen så den lager en `Zombie`, og legger den til `zombies` array-en. `name` og `dna` burde komme fra argumentene til den nye Zombie-en.
2. La oss gjøre det på en linje for å holde det simpelt.
