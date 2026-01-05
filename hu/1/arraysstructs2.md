---
title: Struktúrák és tömbök használata
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie (string memory _name, uint _dna) public {
              // kezdj itt
          }

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie (string memory _name, uint _dna) public {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Új struktúrák létrehozása

Emlékszel a `Person` struktúrára az előző példában?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Most megtanuljuk, hogyan hozzunk létre új `Person`-öket és adjuk hozzá őket a `people` tömbhöz.

```
// Hozz létre egy új Person-t:
Person satoshi = Person(172, "Satoshi");

// Add hozzá azt a személyt a tömbhöz:
people.push(satoshi);
```

Ezeket kombinálhatjuk is és egy sorban megcsinálhatjuk, hogy tiszta legyen:

```
people.push(Person(16, "Vitalik"));
```

Figyeld meg, hogy az `array.push()` hozzáad valamit a tömb **végéhez**, tehát az elemek abban a sorrendben vannak, ahogy hozzáadtuk őket. Nézd meg a következő példát:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// A `numbers` tömb most egyenlő [5, 10, 15]
```

# Tegyük próbára

Tegyük, hogy a createZombie függvényünk csináljon valamit!

1. Töltsd ki a függvény törzsét úgy, hogy létrehozzon egy új `Zombie`-t, és hozzáadja a `zombies` tömbhöz. Az új Zombie `name` és `dna` értékei a függvény argumentumaiból jöjjenek.
2. Csináljuk egy sorban, hogy tiszta legyen.
