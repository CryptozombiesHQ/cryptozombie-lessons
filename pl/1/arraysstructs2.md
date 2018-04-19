---
title: Structs i  Tablice
actions: ['sprawdźOdpowiedź', 'podpowiedzi']
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
              // zacznij tutaj
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

### Tworzenie Nowego Struct

Pamiętasz nasz `Person` struct w poprzednim przykładzie?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Teraz nauczymy się jak  stworzyć nową osobę `Person` i dodać ją do naszej tablicy `people`.

```
// tworzenie nowej osoby Person:
Person satoshi = Person(172, "Satoshi");

// dodanie nowo stworzonej osoby person do tablicy:
people.push(satoshi);
```

Możemy również połączyć to razem i zapisać w jednej lini. Dzięki temu kod będzie czystszy:

```
people.push(Person(16, "Vitalik"));
```

Zwróć uwagę, że `array.push()` dodaje coś na **koniec** tablicy, a elementy mają taką kolejność w jakiej je dodawaliśmy. Zobacz poniższy przykład:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers jest teraz równe [5, 10, 15]
```

# Zadanie do wykonania

Spraw aby nasza funkcja createZombie coś robiła!

1. Uzupełnij funkcje tak aby tworzyła nowego `Zombie`. Dodaj go do tablicy `zombies`.Imie `name` i Dna `dna` dla nowego Zombie powinny być argumentami funkcji.
2. Zróbmy to w jednej linijce kodu, aby wszystko wyglądało ładnie.
