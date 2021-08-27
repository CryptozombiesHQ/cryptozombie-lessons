---
title: Plus sur la visibilité des fonctions
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
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

            // éditer la définition de fonction ci-dessous
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
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

          function _createZombie(string _name, uint _dna) internal {
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

**Le code dans notre leçon précédente avait une erreur !**

Si vous essayer de le compiler, le compilateur renverra une erreur.

Le problème est que nous essayons d'appeler la fonction `_createZombie` à l'intérieur de `ZombieFeeding`, mais `_createZombie` est une fonction `private` de `ZombieFactory`. Cela veut dire que aucun contrat qui hérite de `ZombieFactory` ne peut y accéder.

## Interne et externe

En plus de `public` et `private`, Solidity a deux autres visibilité pour les fonctions : `internal` (interne) et `external` (externe).

`internal` est similaire à `private`, à l'exception qu'elle est aussi accessible aux contrats qui héritent de ce contrat. **(On dirait que c'est ce que l'on veut!)**.

`external` est similaire à `public`, à l'exception que ces fonctions peuvent SEULEMENT être appelées à l'extérieur du contrat - elles ne peuvent pas être appelées par d'autres fonctions à l'intérieur du contrat. Nous expliquerons plus tard pourquoi utiliser `external` plutôt que `public`.

Pour déclarer des fonctions `internal` ou `external`, la syntaxe est la même que pour `private` et `public` :

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // Nous pouvons appeler cette fonction car elle est `internal`
    eat();
  }
}
```

# A votre tour

1. Changez `_createZombie()` de `private` à `internal` pour que les autres contrats puissent y accéder.

  Nous avons déjà sélectionné le bon onglet, `zombiefactory.sol`.
