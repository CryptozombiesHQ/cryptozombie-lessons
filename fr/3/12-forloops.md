---
title: Boucle for
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
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // Commencez ici
            return result;
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
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

Dans le chapitre précédent, nous avons dit qu'il peut être préférable d'utiliser une boucle `for` pour remplir le contenu d'un tableau dans une fonction au lieu de simplement le stocker dans le `storage`.

Voyons voir pourquoi.

Pour notre fonction `getZombiesByOwner`, une implémentation naïve serait de stocker un `mapping` de propriétaires d'armées de zombies dans le contrat `ZombieFactory` :

```
mapping (address => uint[]) public ownerToZombies
```

Et à chaque fois que l'on créerait un nouveau zombie, nous utiliserions simplement `ownerToZombies[owner].push(zombieId)` pour l'ajouter au tableau de zombie de son propriétaire. Et `getZombiesByOwner` serait une fonction toute simple :

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### Le problème avec cette approche

Il serait tentant de faire comme cela par simplicité. Mais regardons ce qu'il arriverait si nous ajoutions plus tard une fonction pour transférer un zombie d'un propriétaire à un autre (Ce que nous allons certainement vouloir dans une prochaine leçon !).

La fonction de transfert devra :
1. Ajouter le zombie au tableau `ownerToZombies` du nouveau propriétaire
2. Enlever le zombie du tableau `ownerToZombies` de l'ancien propriétaire
3. Décaler chaque zombie du tableau de l'ancien propriétaire d'une place pour boucher le trou, et enfin
4. Réduire la taille du tableau de 1.

L'étape 3 serait extrêmement coûteuse en gas, vu que nous aurions besoin de réécrire chaque zombie décalé. Si un propriétaire a 20 zombies, et échange le premier, nous devrions faire 19 écritures pour garder l'ordre du tableau.

Puisque écrire dans le stockage est une des opérations les plus chères en Solidity, chaque appel à cette fonction de transfert serait extrêmement coûteuse en gas. Et encore pire, cela coûterait un montant de gas différent à chaque appel, en fonction de combien de zombie l'utilisateur a dans son armée et de l'index du zombie transféré. L'utilisateur ne saurait pas combien de gas envoyer.

> Remarque : Bien sûr, nous pourrions juste bouger le dernier zombie du tableau pour combler le trou et réduire la taille du tableau de 1. Mais nous changerions l'ordre de notre armée de zombies à chaque transfert.

Comme les fonctions `view` ne coûtent pas de gas quand elles sont appelées extérieurement, nous pouvons simplement utiliser une boucle `for` dans `getZombiesByOwner` pour parcourir le tableau entier de zombie et construire un tableau de zombies qui appartiennent à un utilisateur spécifique. Ainsi notre fonction `transfer` sera beaucoup moins coûteuse, puisque nous n'aurons pas besoin de réorganiser un tableau dans le stockage, et bien qu'étant contre-intuitive cette approche est moins chère globalement.

## Utiliser des boucles `for`

La syntaxe des boucles `for` en Solidity est similaire à celle qu'on utilise en JavaScript.

Voici un exemple où nous voulons faire un tableau de nombre pairs :

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // On suit l'index du nouveau tableau
  uint counter = 0;
  // On itère de 1 à 10 avec une boucle `for` :
  for (uint i = 1; i <= 10; i++) {
    // Si `i` est pair...
    if (i % 2 == 0) {
      // On l'ajoute au tableau
      evens[counter] = i;
      // On incrémente le `counter` de 1 :
      counter++;
    }
  }
  return evens;
}
```

Cette fonction retournera un tableau contenant `[2, 4, 6, 8, 10]`.

## A votre tour

Finissons notre fonction `getZombiesByOwner` en écrivant une boucle `for` qui va parcourir tous les zombies de notre DApp, comparer leur propriétaire afin de voir s'il correspond, et les rajouter à notre tableau `result` avant de le retourner.

1. Déclarer un `uint` appelé `counter` qui soit égal à `0`. Nous utiliserons cette variable pour connaître l'index de notre tableau `result`.

2. Déclarez une boucle `for` qui commence à `uint i = 0` et qui va jusqu'à `i < zombies.length`. Cela parcourra tous les zombies de notre tableau.

3. Dans cette boucle `for`, faire une déclaration `if` qui va vérifier si `zombieToOwner[i]` est égal à `_owner`. Cela comparera les 2 adresses pour voir si elles sont égales.

4. A l'intérieur de cette déclaration `if` :
  1. Ajoutez l'ID du zombie à notre tableau `result` en mettant `result[counter]` égal à `i`.
  2. Incrémentez `counter` de 1 (voir l'exemple de boucle `for` ci-dessus).

Et voilà - la fonction va maintenant renvoyer tous les zombies d'un utilisateur `_owner` sans dépenser du gas.
