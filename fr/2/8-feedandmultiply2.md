---
title: ADN zombie
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // commencez ici
          }

        }
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
    answer: >
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
---

Nous allons finir d'écrire la fonction `feedAndMultiply`.

La formule pour calculer l'ADN d'un nouveau zombie est simple : c'est simplement la moyenne entre l'ADN du zombie qui se nourrit et l'ADN de sa proie.

Par exemple :

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ sera égal à 3333333333333333
}
```
Plus tard, nous pourrons faire une formule plus compliquée, comme ajouter un peu de hasard à l'ADN du nouveau zombie. Mais pour l'instant, on va garder ça simple - nous pourrons toujours y revenir plus tard.

# A votre tour

1. Pour commencer, nous devons nous assurer que `_targetDna` n'est pas plus long que 16 chiffres. Pour cela, nous pouvons définir `_targetDna` égal à `_targetDna % dnaModulus` pour ne garder que les 16 derniers chiffres.

2. Ensuite, notre fonction devra déclarer un `uint` appelé `newDna`, et faire en sorte qu'il soit égal à la moyenne de l'ADN de `myZombie` et de `_targetDna` (comme dans l'exemple ci-dessus).

> Remarque : Vous pouvez accéder aux propriétés de `myZombie` en utilisant `myZombie.name` et `myZombie.dna`

3. Une fois que nous avons le nouvel ADN, appelons `_createZombie`. Vous pouvez regarder l'onglet `zombiefactory.sol` si vous avez oublié quels arguments cette fonction a besoin pour être appelée. Cette fonction a besoin d'un nom, appelons notre nouveau zombie `NoName` pour l'instant - nous pourrons écrire une fonction pour changer les noms des zombies plus tard.

> Note: Pour les experts de Solidity, vous avez peut-être remarqué un problème avec notre code ! Ne vous inquiétez-pas, nous corrigerons cela dans le prochain chapitre ;)
