---
title: Gérer plusieurs valeurs de retour
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

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

          // définissez la fonction ici

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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna);
        }

      }
---

Cette fonction `getKitty` est le premier exemple que nous avons vu qui retourne plusieurs valeurs. Nous allons voir comment gérer cela :

```
function multipleReturns() internal returns(uint a, uint b, uint c) {
  return (1, 2, 3);
}

function processMultipleReturns() external {
  uint a;
  uint b;
  uint c;
  // C'est comme ça que vous faites une affectation multiple :
  (a, b, c) = multipleReturns();
}

// Ou si nous voulons seulement une des valeurs ci dessus :
function getLastReturnValue() external {
  uint c;
  // Nous pouvons laisser les autres champs vides :
  (,,c) = multipleReturns();
}
```

# A votre tour

Il est temps d'interagir avec le contrat CryptoKitties !

Nous allons créer une fonction qui récupère les gènes d'un chaton à partir du contrat :

1. Créez une fonction appelée `feedOnKitty`. Elle prendra 2 paramètres `uint`, `_zombieId` et `_kittyId` et elle devra être `public`.

2. La fonction devra d'abord déclarer un `uint` nommé `kittyDna`.

  > Remarque : Dans notre `KittyInterface`, `genes` est un `uint256` - mais si vous vous rappelez de la leçon 1, `uint` est un alias pour `uint256` - c'est la même chose.

3. La fonction devra ensuite appeler la fonction `kittyContract.getKitty` avec `_kittyId` et stocker les `genes` dans `kittyDna`. N'oubliez pas - `getKitty` retourne une tonne de variables. (10 pour être précis - je suis gentil, je les ai comptées pour vous !). Mais nous voulons récupérer seulement la dernière, `genes`. Comptez vos virgules soigneusement !

4. Enfin, la fonction devra appeler `feedAndMultiply` avec `_zombieId` et `kittyDna`.
