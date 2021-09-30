---
title: Mappages et adresses
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode: |
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

          // déclarez les mappages ici

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
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

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
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

Rendons notre jeu multijoueur en attribuant aux zombies de notre base de donnée un propriétaire.

Pour cela, nous allons avoir besoin de 2 nouveaux types de données : `mapping` (mappage) et `address` (adresse).

## Adresses

La blockchain Ethereum est constituée de **_comptes_**, un peu comme des comptes en banque. Un compte a un montant d'**_Ether_** (c'est la monnaie utilisée sur la blockchain Ethereum), et vous pouvez envoyer des Ethers à d'autres comptes ou en recevoir, de la même manière que vous pouvez transférer de l'argent d'un compte bancaire à un autre.

Chaque compte a une `address`, qui est l'équivalent d'un numéro de compte bancaire. c'est un identifiant unique qui désigne un compte et qui ressemble à :

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Cette adresse appartient à l'équipe de CryptoZombies. Si vous aimez CryptoZombies, vous pouvez nous envoyer quelques Ethers ! 😉 )

Nous entrerons dans les détails des adresses dans une prochaine leçon, pour l'instant, la seule chose que vous devez comprendre c'est que **une adresse appartient à un utilisateur unique** (ou a un smart contract).

Nous pouvons donc l'utiliser comme un ID unique pour définir l'appartenance de nos zombies. Quand un utilisateur crée de nouveaux zombies en interagissant avec notre application, nous pourrons définir l'appartenance de ces zombies à l'adresse Ethereum utilisée pour appeler la fonction.


## Mappages

Dans la Leçon 1 nous avec vu les **_structures_** et les **_tableaux_**. Les **_mappages_** sont une autre façon d'organiser des données en Solidity.

Voici un exemple de `mapping` :

```
// Pour une application financière , stockage d'un `uint` qui correspond à la balance d'un compte utilisateur :
mapping (address => uint) public accountBalance;
// Ou peut être utilisé pour stocker puis rechercher le nom d'utilisateur en fonction d'un userId.
mapping (uint => string) userIdToName;
```

Un mappage est fondamentalement un stockage de valeur-clé pour stocker et rechercher des données. Dans le premier exemple, la clé est une `address` et la valeur est un `uint`, et dans le second exemple, la clé est un `uint` et la valeur un `string`.


# A votre tour

Pour savoir à qui appartient un zombie, nous allons utiliser 2 mappages : un qui va stocker l'adresse associée à un zombie, et l'autre qui va stocker combien de zombies un utilisateur possède.

1. Créez un mappage appelé `zombieToOwner`. La clé est un `uint` (nous stockerons et rechercherons le zombie avec son id) et la valeur est une `address`.
Ce mappage sera `public`.

2. Créez un mappage appelé `ownerZombieCount`, où la clé est une `address` et la valeur un `uint`.
