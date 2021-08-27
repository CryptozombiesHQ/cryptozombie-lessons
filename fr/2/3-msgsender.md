---
title: Msg.sender
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

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              // commencez ici
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
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
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

Maintenant que nous avons nos mappages pour savoir qui détient un zombie, nous allons mettre à jour la méthode `_createZombie` pour les utiliser.

Pour cela, nous allons utiliser quelque-chose appelé `msg.sender` (message.expéditeur).

## msg.sender

En Solidity, il existe des variables globales accessibles à toutes les fonctions. L'une d'elles est `msg.sender`, qui faire référence à l'`address` de la personne (ou du smart contract) qui a appelée la fonction actuelle.

> Remarque : En Solidity, l'exécution d'une fonction nécessite obligatoirement un appel extérieur. Un contrat va juste rester là dans la blockchain à ne rien faire jusqu'à ce que quelqu'un appelle un de ses fonctions. Il y aura toujours un `msg.sender`.

Voici un exemple d'utilisation de `msg.sender` pour mettre à jour un `mapping`.

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Mettre à jour notre mappage `favoriteNumber` pour stocker `_myNumber` sous `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ La syntaxe pour stocker des données dans un mappage est la même qu'avec les tableaux
}

function whatIsMyNumber() public view returns (uint) {
  // On récupère la valeur stockée à l'adresse de l'expéditeur
  // Qui sera `0` si l'expéditeur n'a pas encore appelé `setMyNumber`
  return favoriteNumber[msg.sender];
}
```

Dans cet exemple trivial, n'importe qui pourrait appeler `setMyNumber` et stocker un `uint` dans notre contrat, qui serait lié à leur adresse. Ils pourraient ensuite appeler `whatIsMyNumber`, et ils auraient en retour le `uint` qu'ils ont stocké.

Utiliser `msg.sender` apporte de la sécurité à la blockchain Ethereum - la seule manière pour quelqu'un de modifier les données d'un autre serait de lui voler sa clé privée associée à son adresse Ethereum.


# A votre tour

Mettons à jour notre fonction `_createZombie` de la leçon 1 pour désigner comme propriétaire d'un zombie celui qui appellerait cette fonction.

1. Après avoir récupéré l'`id` du nouveau zombie, mettons à jour notre mappage `zombieToOwner` pour stocker `msg.sender` sous cet `id`.

2. Ensuite, augmentons notre `ownerZombieCount` pour ce `msg.sender`.

En Solidity, vous pouvez augmenter un `uint` avec `++`, comme en Javascript :

```
uint number = 0;
number++;
// `number` est maintenant `1`
```

La réponse finale pour ce chapitre devra faire 2 lignes de code.
