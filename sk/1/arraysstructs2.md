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
Remember our `Person` struct in the previous example?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Teraz sa naučíme ako vytvoriť nové štruktúry `Person` a ako ich pridať do poľa `people`.
Now we're going to learn how to create new `Person`s and add them to our `people` array.

```
// vytvorme novú Person štruktúru
// create a New Person:
Person satoshi = Person(172, "Satoshi");

// Pridáme ju do poľa
// Add that person to the Array:
people.push(satoshi);
```

Tieto kroky možme taktiež skombinovať do jedného, aby sme udržali náš kód čistý:
We can also combine these together and do them in one line of code to keep things clean:

```
people.push(Person(16, "Vitalik"));
```

Všimnime si že `array.push()` pridáva nejaký prvok na **koniec** poľa, takže prvky poľa su zoradené v rovnakom poradí ako sme ich pridávali. Pozrime sa na nasledujúci príklad:
Note that `array.push()` adds something to the **end** of the array, so the elements are in the order we added them. See the following example:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// pole numbers vyzerá teraz takto [5, 10, 15]
// numbers is now equal to [5, 10, 15]
```

# Vyskúšaj si to sám
# Put it to the test

Poďme upraviť našu funkciu cryptoZombie tak, aby vlastne niečo robila!
Let's make our createZombie function do something!

1. Vyplňíme telo funkcie tak, aby vytvárila novú inštanciu `Zombie` a pridala ju do poľa `zombies`. Atribúty `name` a `dna` pre nového Zombie by mali byť použité z argumentov funkcie. 
2. Spravme to všetko na jednom riadku, nech je náš kód čistý.

1. Fill in the function body so it creates a new `Zombie`, and adds it to the `zombies` array. The `name` and `dna` for the new Zombie should come from the function arguments.
2. Let's do it in one line of code to keep things clean.
