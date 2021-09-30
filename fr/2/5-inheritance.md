---
title: Héritage
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // commencez ici

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

      contract ZombieFeeding is ZombieFactory {

      }

---

Le code de notre jeu commence à être un peu long. A la place de faire un contrat vraiment long, il vaut mieux parfois séparer la logique de votre code en plusieurs contrats pour mieux l'organiser.

Une des fonctionnalités de Solidity qui rend les contrats plus facile à gérer est l'**_héritage_** :

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```


`BabyDoge` **_hérite_**  de `Doge`. Cela veut dire que si vous compilez et déployez `BabyDoge`, il aura accès à `catchphrase()` et à `anotherCatchphrase()` (et n'importe quelle fonction publique que nous définirions dans `Doge`).

Cela peut être utiliser pour les héritages logiques (comme avec les sous-classes, un `Chat` est un `Animal`). Mais cela peut aussi simplement être utilisé pour organiser votre code en groupant les logiques similaires en différentes classes.

# A votre tour

Dans les prochains chapitres, nous allons implémenter les fonctionnalités pour nourrir et multiplier nos zombies. Mettons cette logique dans sa propre classe qui hérite de toutes les méthodes de `ZombieFactory`.

1. Créez un contrat nommé `ZombieFeeding` en dessous de `ZombieFactory`. Ce contrat devra hériter de notre contrat `ZombieFactory`.
