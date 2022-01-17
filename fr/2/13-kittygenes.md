---
title: "Bonus : gènes de chaton"
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // modifiez la définition de la fonction ici :
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // ajoutez une déclaration `if` ici
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // et modifiez l'appel de la fonction ici :
            feedAndMultiply(_zombieId, kittyDna);
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

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(_species) == keccak256("kitty")) {
            newDna = newDna - newDna % 100 + 99;
          }
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

      }
---

La logique de notre fonction est terminée... mais nous allons ajouter une fonctionnalité bonus.

Nous allons faire que les zombies créés à partir de chatons aient une caractéristique unique, qui montrera qu'ils sont des zombie-chats.

Pour cela, nous allons ajouter un code spécial chaton à l'ADN du zombie.

Si vous vous rappelez de la leçon 1, nous n'utilisons seulement les 12 premiers chiffres de notre ADN à 16 chiffres pour déterminer l'apparence du zombie. Nous allons utiliser les 2 derniers chiffres inutilisés pour gérer les caractéristiques "spéciales".

Les deux derniers chiffres de l'ADN d'un zombie-chat sont `99` (car les chats ont 9 vies). Dans notre code, nous allons dire **si** un zombie provient d'un chat, alors ces deux derniers chiffres d'ADN seront `99`.

## déclaration `if` (si)

Les déclaration `if` en Solidity sont les mêmes qu'en JavaScript :

```
function eatBLT(string sandwich) public {
  // N'oubliez pas, avec les `string`, nous devons comparer
  // leurs hachages keccak256 pour vérifier l'égalité
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# A votre tour

Nous allons implémenter les gènes de chat dans notre code zombie.

1. Premièrement, changez la définition de la fonction `feedAndMultiply` pour qu'elle prenne un 3ème paramètre : un `string` nommé `_species`

2. Ensuite, après avoir calculé le nouvel ADN zombie, rajoutez une déclaration `if` pour comparer le hachage `keccak256` de `_species` et la chaîne de caractère `"kitty"`.

3. Dans cette déclaration `if`, nous voulons remplacer les 2 derniers chiffres de l'ADN par `99`. Une façon de le faire est d'utiliser cette logique : `newDna = newDna - newDna % 100 + 99;`.

  > Explication : Si `newDna` est `334455`. Alors `newDna % 100` est `55`, donc `newDna - newDna % 100` est `334400`. Enfin on ajoute `99` pour avoir `334499`.

4. Enfin, nous avons besoin de changer l'appel de la fonction à l'intérieur de `feedOnKitty`. Quand elle appelle `feedAndMultiply`, ajoutez l'argument `"kitty"` à la fin.
