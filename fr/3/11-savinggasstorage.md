---
title: le stockage coûte cher
actions: ['vérifierLaRéponse', 'indice']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            // Commencez ici
          }

        }

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

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

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
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);

          return result;
        }

      }
---

Une des opérations les plus coûteuse en Solidity est d'utiliser `storage` - particulièrement quand on écrit.

C'est parce qu'à chaque fois que vous écrivez ou changez un bout d'information, c'est écrit de manière permanente sur la blockchain. Pour toujours ! Des milliers de nœuds à travers le monde vont stocker cette information sur leurs disques durs, et cette quantité d'information continue de grandir au fur et à mesure que la blockchain grandit. Et il y a un prix à cela.

Afin de réduire les coûts, vous voulez éviter d'écrire des données en stockage à part quand c'est absolument nécessaire. Par moment cela peut impliquer une logique de programmation qui a l'air inefficace - comme reconstruire un tableau dans la `memory` à chaque fois que la fonction est appelée au lieu de sauvegarder ce tableau comme une variable afin de le retrouver rapidement.

Dans la plupart des langages de programmation, faire une boucle sur un grand ensemble de données est coûteux. Mais en Solidity, c'est beaucoup moins cher que d'utiliser `storage` s'il y a une fonction `external view`, puisque `view` ne coûte aucun gas. (Et le gas coûte réellement de l'argent pour vos utilisateurs !).

Nous allons voir les boucles `for` dans le prochain chapitre, mais pour l'instant, nous allons voir comment déclarer nos tableaux dans la mémoire.

## Déclarer des tableaux dans la mémoire

Vous pouvez utiliser le mot clé `memory` avec des tableaux afin de créer un nouveau tableau dans une fonction sans avoir besoin de l'écrire dans le stockage. Le tableau existera seulement jusqu'à la fin de l'appel de la fonction, et cela sera beaucoup plus économique, d'un point de vue du gas, que de mettre à jour un tableau dans `storage` - c'est gratuit si c'est une fonction `view` appelée extérieurement.

Voici comment déclarer un tableau dans la mémoire :

```
function getArray() external pure returns(uint[]) {
  // Instancier un nouveau tableau d'une longueur 3 dans la mémoire
  uint[] memory values = new uint[](3);
  // Lui ajouter des valeurs
  values.push(1);
  values.push(2);
  values.push(3);
  // Renvoyer le tableau
  return values;
}
```
C'est un exemple simple pour vous montrer la syntaxe, mais dans le prochain chapitre, nous verrons comment le combiner avec une boucle `for` avec un cas d'usage réel.

> Remarque : Les tableaux mémoires **doivent** être créés avec un argument de longueur (dans cet exemple, `3`). Ils ne peuvent pas encore être redimensionnés avec
`array.push()`, mais cela pourrait changer dans les prochaines versions de Solidity.

## A votre tour

Dans notre fonction `getZombiesByOwner`, nous voulons renvoyer un tableau `uint[]` avec tous les zombies qu'un utilisateur désigné possède.

1. Déclarez une variable `uint[] memory` appelée `result`

2. Définissez la égale à un nouveau tableau de `uint`. La longueur du tableau devra être le nombre de zombies que cet `_owner` possède, qui peut être obtenu à partir de notre `mapping` en faisant : `ownerZombieCount[_owner]`.

3. A la fin de la fonction, renvoyez `result`. Pour l'instant c'est simplement un tableau vide, mais nous le remplirons dans le prochain chapitre.
