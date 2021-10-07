---
title: Require (Exige)
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
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              // commencez ici
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Dans la leçon 1, nous avons fait en sorte que les utilisateurs puissent créer de nouveaux zombies en appelant `createPseudoRandomZombie` et en rentrant leur nom. Cependant, si les utilisateurs continuaient d'appeler cette fonction pour créer à l'infini des zombies dans leur armée, le jeu ne serait pas vraiment amusant.

Nous allons faire en sorte que chaque joueur puisse appeler cette fonction une seule fois seulement. Ainsi, les nouveaux joueurs vont l'appeler quand ils commenceront le jeu pour créer le premier zombie de leur armée.

Comment pouvons-nous faire pour que cette fonction soit appelée seulement une fois par joueur ?

Pour cela, nous allons utiliser `require`. `require` va faire en sorte que la fonction s’arrête et renvoie une erreur si certaines conditions ne sont pas respectées :
```
function sayHiToVitalik(string _name) public returns (string) {
  // Regarde si _name est égal à "Vitalik". Renvoie une erreur et quitte si ce n'est pas le cas.
  // (Remarque : Solidity n'a pas de comparateur de `string` nativement,
  // nous comparons donc leurs hachages keccak256 pour voir si les `string` sont égaux)
  require(keccak256(_name) == keccak256("Vitalik"));
  // Si c'est vrai, on continue avec la fonction :
  return "Hi!";
}
```

Si vous appelez la fonction avec `sayHiToVitalik("Vitalik")`, elle va renvoyer "Hi!". Si vous l'appelez avec un autre argument, elle va renvoyer une erreur et ne elle ne va pas s’exécuter.

Ainsi `require` est pratique pour vérifier que certaines conditions soient vraies avant d'exécuter une fonction.

# A votre tour

Dans notre jeu de zombie, nous ne voulons pas qu'un utilisateur puisse créer une infinité de zombie pour son armée en appelant continuellement `createPseudoRandomZombie` - le jeu ne serait pas très amusant.

Nous allons utiliser `require` pour être sur que la fonction s'exécute seulement une fois par utilisateur, quand il crée son premier zombie.

1. Ajouter une déclaration `require` au début de `createPseudoRandomZombie`. La fonction devra vérifier que `ownerZombieCount[msg.sender]` soit égal à `0`, et renvoyer une erreur au cas contraire.

> Remarque : En Solidity, le terme que vous mettez en premier n'a pas d'importance - cela revient au même. Cependant, notre vérificateur de réponse étant vraiment basique, il acceptera seulement une bonne réponse - il faudra que le `ownerZombieCount[msg.sender]` soit en premier.
