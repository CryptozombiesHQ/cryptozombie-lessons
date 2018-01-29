---
title: Fonctions Privées / Publiques
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

En Solidity, les fonctions sont publiques par défaut. Cela signifie que n'importe qui (ou n'importe quel contrat) peut appeler la fonction de votre contrat et exécuter son code.

Évidemment, ce n'est pas toujours ce que l'on veut, cela pourrait rendre votre contrat vulnérable aux attaques. Il est donc recommandé de marquer vos fonctions comme `private` (privées) par défaut, puis de ne rendre `public` (publiques) seulement les fonctions que vous voulez exposer à tout le monde.

Voici comment déclarer une fonction privée :

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number) {
}
```
Cela veut dire que seulement les autres fonctions de notre contrat pourront appeler cette fonction et ajouter quelque chose au tableau `array`.

Comme vous pouvez le voir, nous avons utilisé le mot-clé `private` après le nom de la fonction. Et comme les arguments d'une fonction, par convention les fonctions privées commencent par un trait de soulignement (`_`).

# A votre tour.

La fonction `createZombie` de notre contrat est par défaut publique - cela veut dire que n'importe qui peut l'appeler et créer un nouveau Zombie dans notre contrat ! Changeons la en privée.

1. Modifiez `createZombie` pour que ce soit une fonction privée. N'oubliez pas la convention de nom !
