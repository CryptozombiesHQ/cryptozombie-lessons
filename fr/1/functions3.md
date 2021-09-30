---
title: Plus sur les fonctions
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

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {

          }

      }
---

Dans ce chapitre, nous allons apprendre les **_valeurs retournées_** des fonctions, ainsi que les modificateurs de fonction.

## Valeurs retournées

Pour retourner une valeur à partir d'une fonction, cela ressemble à ça :

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

En Solidity, une déclaration de fonction indique le type de la valeur retournée (dans ce cas `string`).

## Modificateurs de fonction

La fonction ci-dessus ne change pas un état en Solidity - c.-à-d. elle ne change pas une valeur et n'écrit rien.

Dans ce cas là, nous pouvons la déclarer comme une fonction **_view_** (vue), cela veut dire qu'elle va seulement voir des données sans les modifier :

```
function sayHello() public view returns (string) {
```
Solidity a aussi des fonctions **_pure_**, cela veut dire que vous n'avez même pas accès à des données de l'application. Par exemple :

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```
Cette fonction ne lit aucune donnée du contrat - elle retourne une valeur qui dépend seulement de ses arguments. Dans ce cas là, nous déclarerons la fonction comme **_pure_**.

> Remarque: Il peut être difficile de se rappeler quand marquer les fonctions comme étant pure/view. Heureusement, le compilateur Solidity est bon pour vous avertir quand vous devriez utiliser l'un ou l'autre de ces modificateurs.

# A votre tour

Nous allons vouloir une fonction d'aide pour générer un nombre ADN aléatoire à partir d'une chaîne de caractères.

1. Créez une fonction `private` appelée `_generatePseudoRandomDna`. Elle prendra un paramètre nommé `_str` (un `string`), et retournera un `uint`.

2. Cette fonction affichera des variables de notre contrat sans les modifier, marquez-la comme `view`.

3. Laissez le corps de la fonction vide pour l'instant - nous le remplirons plus tard.
