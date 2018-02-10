---
title: Déclarations de fonction
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // commencez ici

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

Une déclaration de fonction (function) en Solidity ressemble à ça :

```
function eatHamburgers(string _name, uint _amount) {

}
```
C'est une fonction appelée `eatHamburgers` qui prend 2 paramètres : un `string` et un `uint`. Le corps de la fonction est vide pour l'instant.

> Remarque: Par convention (mais ce n'est pas obligatoire), les noms des paramètres des fonctions commencent avec un trait de soulignement (`_`) afin de les différencier des variables globales. Nous utiliserons cette convention tout au long de notre tutoriel.

Vous pouvez appeler la fonction comme cela :

```
eatHamburgers("vitalik", 100);
```

# A votre tour

Dans notre application, nous allons avoir besoin de créer des zombies. Pour cela, créons une fonction.

1. Créez une fonction appelée `createZombie`. Elle devra prendre deux arguments : **__name_** (un `string`), et **__dna_** (un `uint`).

Laissez le corps vide pour l'instant, nous le compléterons plus tard.
