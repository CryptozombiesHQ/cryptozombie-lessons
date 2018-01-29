---
title: Manipuler des Structures et des Tableaux
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
              // Commencer ici
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

### Creer de nouvelles Structures

Vous vous rappelez de notre structure `Person` dans l'exemple précédent ?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Nous allons maintenant apprendre comment créer des nouvelles `Person` et les ajouter à notre tableau `people`.

```
// créer une nouvelle Person :
Person satoshi = Person(172, "Satoshi");

// L'ajouter au tableau :
people.push(satoshi);
```
Pour garder un code plus concis, on peut aussi écrire cela en une ligne en combinant les déclarations :

```
people.push(Person(16, "Vitalik"));
```

Vous remarquerez que `array.push()` ajoute quelque chose à la **fin** du tableau, les éléments sont donc rangés selon l'ordre d'ajout. Exemple :

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers est maintenant égal à [5, 10, 15]
```

# A votre tour

Faisons faire quelque chose à notre fonction createZombie !

1. Remplissez le corps de la fonction afin qu'elle crée un nouveau `Zombie` et qu'elle l'ajoute au tableau` zombies`. Les noms `name` et` dna` pour le nouveau Zombie devraient provenir des arguments de la fonction.
2. Faisons-le en une ligne de code pour garder les choses concises.
