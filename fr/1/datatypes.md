---
title: Variables d'état et entiers
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // commencez ici

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Bien joué ! Maintenant que nous avons une structure pour notre contrat, voyons voir comment Solidity gère les variables.

**_Les variables d'état_** sont stockées de manière permanente dans le stockage du contrat. Cela signifie qu'elles sont écrites dans la blockchain Ethereum. C'est comme écrire dans une base de données.

##### Exemple:
```
contract Example {
  // Cela sera stocké de manière permanente dans la blockchain.
  uint myUnsignedInteger = 100;
}
```

Dans cet exemple de contrat, nous avons créé un `uint` appelé `myUnsignedInteger` qui a pour valeur 100.

## Entiers non signés : `uint`

Le type de données `uint` est un entier non signé, cela veut dire que **sa valeur doit être non négative**. Il existe aussi un type de données `int` pour les entiers signés.

> Remarque: En Solidity, `uint` est en fait un alias pour `uint256`, un entier non signé de 256 bits. Vous pouvez déclarer des uints avec moins de bits - `uint8`, `uint16`, `uint32`, etc. Mais en général il est plus simple d'utiliser `uint` sauf dans des cas spécifiques que nous aborderons dans les leçons suivantes.


# A votre tour

Notre ADN Zombie va être déterminé par un nombre à 16 chiffres.

Déclarez un `uint` nommé `dnaDigits` ayant pour valeur `16`.
