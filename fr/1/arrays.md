---
title: Tableaux
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
              string name;
              uint dna;
          }

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

          Zombie[] public zombies;

      }
---

Quand vous voulez regrouper des éléments, vous pouvez utiliser un **_tableau_** (array). il y a deux sortes de tableaux dans Solidity : les tableaux  **_fixes_** et les tableaux **_dynamiques_** :

```
// Tableau avec une longueur fixe de 2 éléments :
uint[2] fixedArray;
// Un autre Tableau fixe, qui peut contenir 5 `string` :
string[5] stringArray;
// un Tableau dynamique, il n'a pas de taille fixe, il peut continuer de grandir :
uint[] dynamicArray;
```

Vous pouvez aussi créer un tableau de **_structure_**. En utilisant la structure Person du chapitre précédent :

```
Person[] people; // Tableau dynamique, on peut en rajouter sans limite.
```

Vous vous rappelez que les variables d'état sont stockées définitivement dans la blockchain ? Il peut donc être utile de créer des tableaux dynamique de structure pour stocker des données structurées dans votre contrat, un peu comme une base de données.

## Tableaux publics

Vous pouvez déclarer un tableau comme `public`, et Solidity créera automatiquement une méthode **_d'accès_**. La syntaxe ressemble à :

```
Person[] public people;
```
Les autres contrats vont pouvoir lire (mais pas écrire) ce tableau. C'est donc une façon utile pour stocker des données publiques dans votre contrat.

# A votre tour

Nous allons vouloir stocker une armée de zombies dans notre application. Et nous allons vouloir montrer tous nos zombies à d'autres applications, cette armée devra donc être publique.

1. Créez un tableau public de **_structures_** `Zombie`, et appelez le `zombies`.
