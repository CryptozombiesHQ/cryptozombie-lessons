---
title: Práca so štruktúrami a poľami
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
              // začni písať tu
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

### Vytváranie nových štruktúr

Spomínaš si na našu štruktúru `Person` z predchádzajúceho príkladu?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Teraz sa naučíme, ako vytvoriť nové štruktúry `Person`, a ako ich pridať do poľa `people`.

```
// vytvorme novú Person štruktúru
// create a New Person:
Person satoshi = Person(172, "Satoshi");

// Pridáme ju do poľa
// Add that person to the Array:
people.push(satoshi);
```

Tieto kroky môžme taktiež skombinovať do jedného, aby sme udržali kód čistejší:

```
people.push(Person(16, "Vitalik"));
```

Všimnime si, že `array.push()` pridáva prvok na **koniec** poľa. Prvky poľa su teda zoradené v rovnakom poradí, v akom sme ich pridávali. Pozrime sa na nasledujúci príklad:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// pole numbers vyzerá teraz takto [5, 10, 15]
```

# Vyskúšaj si to sám

Poďme upraviť našu funkciu cryptoZombie tak, aby vlastne niečo robila!

1. Vyplňíme telo funkcie, aby vytvárila novú inštanciu `Zombie` a pridala ju do poľa `zombies`. Atribúty `name` a `dna` pre nového Zombie prepoužijeme z argumentov funkcie. 
2. Toto všetko spravme na jednom riadku.
