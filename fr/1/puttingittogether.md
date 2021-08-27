---
title: Tout mettre ensemble
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
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
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Nous avons bientôt terminé notre générateur de Zombie aléatoire ! Créons une fonction publique qui va regrouper tout ça.

Nous allons créer une fonction publique qui prend un paramètre, le nom du zombie, et utilise ce nom pour créer un zombie avec un ADN aléatoire.

# A votre tour

1. Créez une fonction `public` nommée `createPseudoRandomZombie`. Elle devra prendre seulement un paramètre `_name` (un `string`). _(Remarque : déclarez cette fonction `public`. de la même manière que vous avez déclaré la fonction précédente `private`)_

2. La première ligne de la fonction devra exécuter la fonction `_generatePseudoRandomDna` avec comme argument `_name` and stocker le résultat dans un `uint` nommé `randDna`.

3. La deuxième ligne devra exécuter la fonction `_createZombie` avec comme arguments `_name` et `randDna`.

4. La solution devra faire 4 lignes de code (en comptant le `}` de fin de fonction).
