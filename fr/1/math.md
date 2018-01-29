---
title: Opérations Mathématiques
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          // commencez ici

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Les mathématiques en Solidity sont assez simples. Les opérations sont les mêmes dans la plupart des langages de programmation :

* Addition : `x + y`
* Soustraction : `x - y`,
* Multiplication : `x * y`
* Division : `x / y`
* Modulo / reste : `x % y` _(par exemple, `13 % 5` est `3`, car si vous divisez 13 par 5)_

Solidity prend aussi en charge l'**_opérateur exponentiel_** (c.-à-d. "x à la puissance y", x^y) :

```
uint x = 5 ** 2; // égal à 5^2 = 25
```

# A votre tour

Pour être sûr que notre ADN Zombie est de seulement 16 chiffres, définissons un autre `uint` égal à 10^16. Comme ça, nous pourrons plus tard utiliser l'opérateur modulo `%` pour raccourcir un entier à 16 chiffres.

1. Créez un `uint` appelé `dnaModulus`, et définissez-le égal à **10 à la puissance `dnaDigits`**.
