---
title: Unités de temps
actions: ['vérifierLaRéponse', 'indice']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. Définissez  le `cooldownTime` ici

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
                // 2. Mettez à jour les lignes suivantes :
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
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
---

La propriété `level` est plutôt explicite. Plus tard, quand nous créerons le système de combat, les zombies avec le plus de victoires vont monter en niveau avec le temps et auront accès à plus d'aptitudes.

La propriété `readyTime` demande un peu plus d'explication. Le but est d'ajouter un "temps de recharge", une durée qu'un zombie doit attendre après avoir mangé ou attaqué avant de pouvoir manger / attaquer de nouveau. Sans ça, un zombie pourrait attaquer et se multiplier 1000 fois par jour, ce qui rendrait le jeu trop facile.

Afin de savoir combien de temps un zombie doit attendre avant d'attaquer de nouveau, nous pouvons utiliser les unités de temps de Solidity.

## Unités de temps

Solidity fourni nativement des unités pour gérer le temps.

La variable `now` (maintenant) va retourner l'horodatage actuel unix (le nombre seconde écoulées depuis le 1er janvier 1970). L'horodatage unix au moment où j'écris cette phrase est `1515527488`.

> Remarque : L'horodatage unix est traditionnellement stocké dans un nombre 32-bit. Cela mènera au problème "Année 2038", quand l'horodatage unix 32-bits aura débordé et cassera beaucoup de système existant. Si nous voulons que notre DApp continue de marcher dans 20 ans, nous pouvons utiliser un nombre 64-bit à la place - mais nos utilisateurs auront besoin de dépenser plus de gas pour utiliser notre DApp pendant ce temps. Décision de conception !

Solidity a aussi des unités de temps `seconds` (secondes), `minutes`, `hours` (heures), `days` (jours) et `years` (ans). Ils vont se convertir en un `uint` correspondant au nombre de seconde de ce temps. Donc `1 minutes` est `60`, `1 hours` est `3600` (60 secondes x 60 minutes), `1 days` est `86400` (24 heures x 60 minutes x 60 seconds), etc.

Voici un exemple montrant l'utilité de ces unités de temps :

```
uint lastUpdated;

// Défini `lastUpdated` à `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Retournera `true` si 5 minutes se sont écoulées
// depuis que `updateTimestamp` a été appelé, `false`
// si 5 minutes ne se sont pas passées
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Nous pouvons utiliser ces unités de temps pour notre fonctionnalité `cooldown` de notre Zombie.

## A votre tour

Ajoutons un temps de recharge à notre DApp, afin que les zombies aient besoin d'attendre **1 jour** avant d'attaquer ou se nourrir à nouveau.

1. Déclarez un `uint` appelé `cooldownTime` égal à `1 days`. (Pardonnez la mauvaise grammaire - si vous la mettez égale à "1 day", cela ne compilera pas !)

2. Vu que nous avons ajouté `level` et `readyTime` à notre structure `Zombie` dans le chapitre précédent, nous devons mettre à jour `_createZombie()` pour utiliser le bon nombre d'arguments quand nous créons une nouvelle structure `Zombie`.

  Mettez à jour la ligne de code `zombies.push` en ajoutant 2 arguments : `1` (pour `level`), et `uint32(now + cooldownTime)` (pour `readyTime`).

> Remarque : Le `uint32(...)` est nécessaire car `now` renvoie un `uint256` par défaut. nous devons donc le convertir en un `uint32`.

`now + cooldownTime` sera égal à l'horodatage unix actuel (en secondes) plus le nombre de secondes d'un jour - qui sera égal à l'horodatage unix dans 24h. Plus tard, nous pourrons comparer si le `readyTime` du zombie est supérieur à `now` pour voir si assez de temps s'est écoulé pour utiliser le zombie à nouveau.

Nous implémenterons cette fonctionnalité pour limiter les actions en fonction de `readyTime` dans le prochain chapitre.
