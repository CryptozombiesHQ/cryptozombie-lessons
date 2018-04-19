---
title: "Contrats"
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity // 1. Entrez la version de Solidity ici

      // 2. Créez le contrat ici
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Commençons par les bases :

Un **contrat** (contract) permet d'encapsuler du code Solidity, c'est la composante fondamentale de toutes applications Ethereum - toutes les variables et fonctions appartiennent à un contrat, et ce sera le point de départ de tous vos projets.

Un contrat vide nommé `HelloWorld` ressemblerait à ceci :

```
contract HelloWorld {

}
```

## Pragma version

Tout code source en Solidity doit commencer par un "pragma version" - une déclaration de la version du compilateur Solidity que ce code devra utiliser. Cela permet d'éviter d'éventuels problèmes liés aux changements introduits par des futures versions du compilateur.

Cela ressemble à ça : `pragma solidity ^0.4.19;` (la dernière version de Solidity au moment de la rédaction de cet article étant 0.4.19).

Pour résumer, voici un contrat de base - la première chose que vous devez écrire à chaque fois que vous commencerez un nouveau projet :

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# A votre tour

Pour commencer à créer notre armée de Zombies, créons un contrat de base appelé `ZombieFactory`.

1. Dans la section à droite, définissez la version Solidity de notre contrat à `0.4.19`.

2. Créez un contrat vide appelé `ZombieFactory`.

Lorsque vous avez terminé, cliquez sur "Vérifier La Réponse" ci-dessous. Si vous êtes bloqué, vous pouvez cliquer sur "Indice".
