---
title: Structures
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // commencez ici

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

      }
---

Il est possible que vous ayez besoin d'un type de données plus complexe. Pour cela, Solidity fournit les **_structures_** (struct) :

```
struct Person {
  uint age;
  string name;
}

```

Les structures vous permettent de créer des types de données plus complexes avec plusieurs propriétés.

> Remarque : Nous venons d'introduire un nouveau type, `string` (Chaîne de caractères). Les chaînes de caractères sont utilisées pour les données UTF-8 de longueur arbitraire. Ex. `string greeting = "Hello world!"`

# A votre tour

Dans notre application, nous allons vouloir créer des zombies ! Et les zombies ont plusieurs propriétés, une structure est parfaitement adapté pour ça.

1. Créez une `struct` nommée `Zombie`.

2. Notre structure `Zombie` aura 2 propriétés : `name` (un `string`) et `dna` (un `uint`).
