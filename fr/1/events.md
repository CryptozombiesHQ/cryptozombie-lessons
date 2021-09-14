---
title: Évènements
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // déclarez notre évènement ici

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // et déclenchez le ici
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Notre contrat est presque fini ! nous allons maintenant ajouter un **_ évènement _** (event).

Un **_ évènement _** est un moyen pour votre contrat d'indiquer à votre application frontale (front-end) que quelque chose vient d'arriver sur la blockchain, l'application frontale pouvant être «à l'écoute» de certains événements pour prendre des mesures quand ils se produisent.

Exemple :

```
// déclaration de l'évènement
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // déclenchement de l'évènement pour indiquer à l'application que la fonction a été appelée :
  IntegersAdded(_x, _y, result);
  return result;
}
```

Votre application frontale pourrait alors être en attente de l'évènement. Voici un exemple d'implémentation JavaScript :

```
YourContract.IntegersAdded(function(error, result) {
  // faire quelque chose avec le résultat
}
```

# A votre tour

A chaque fois qu'un nouveau zombie est créé, nous voulons qu'un évènement informe l'application frontale, ainsi, elle pourra l'afficher.

1. Déclarez un `event` appelé `NewZombie`. Les arguments devront être `zombieId` (un `uint`), `name` (un `string`), et `dna` (un `uint`).

2. Modifiez la fonction `_createZombie` pour déclencher l'évènement `NewZombie` après avoir ajouté le nouveau Zombie à notre tableau `zombies`.

3. Vous allez avoir besoin de l'`id` du zombie. `array.push ()` retourne un `uint` de la nouvelle longueur du tableau - et puisque le premier élément d'un tableau a pour index 0, `array.push() - 1` sera l'index du nouveau zombie ajouté. Stockez le résultat de `zombies.push() - 1` dans un `uint` nommé `id`, vous pourrez donc l'utiliser dans l'évènement `NewZombie` de la ligne suivante.
