---
title: Gas (gaz)
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

            struct Zombie {
                string name;
                uint dna;
                // Ajoutez les nouvelles données ici
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
---

Super ! Maintenant nous savons comment mettre à jour des portions clés de notre DApp tout en empêchant que d'autres personnes modifient notre contrat.

Nous allons voir une autre chose qui différencie Solidity des autres langages de programmation :

## Gas (gaz) - le carburant des DApps Ethereum

En Solidity, vos utilisateurs devront payer à chaque fois qu'ils exécutent une fonction de votre DApp avec une monnaie appelée **_gas_**. Les utilisateurs achètent du gas avec de l'Ether (la monnaie d'Ethereum), vos utilisateurs doivent donc dépenser de l'ETH pour exécuter des fonctions de votre DApp.

La quantité de gas requit pour exécuter une fonction dépend de la complexité de cette fonction. Chaque opération individuelle a un **_coût en gas_** basé approximativement sur la quantité de ressources informatiques nécessaires pour effectuer l'opération (ex: écrire dans le storage est beaucoup plus cher que d'ajouter deux entiers). Le **_coût en gas_** total de votre fonction est la somme du coût de chaque opération individuelle.

Parce qu'exécuter des fonctions coûte de l'argent réel pour les utilisateurs, l'optimisation de code est encore plus importante en Solidity que pour les autres langages de programmation. Si votre code est négligé, vos utilisateurs devront payer plus cher pour exécuter vos fonctions - et cela pourrait résulter en des millions de dollars de frais inutiles répartis sur des milliers d'utilisateurs.

## Pourquoi le gas est nécessaire ?

Ethereum est comme un ordinateur gros et lent, mais extrêmement sécurisé. Quand vous exécutez une fonction, chaque nœud du réseau doit exécuter la même fonction pour vérifier le résultat - c'est ces milliers de nœuds vérifiant chaque exécution de fonction qui rendent Ethereum décentralisé et les données immuables et résistantes à la censure.

Les créateurs d'Ethereum ont voulu être sûrs que personne ne pourrait bloquer le réseau avec une boucle infinie, ou s'accaparer toutes les ressources du réseau avec des calculs vraiment complexes. C'est pour cela que les transactions ne sont pas gratuites, et que les utilisateurs doivent payer pour faire des calculs et pour le stockage.

> Remarque : Ce n'est pas forcément vrai pour des sidechains, comme celles que les auteurs de CryptoZombies construisent à Loom Network. Cela ne ferait pas de sens de faire tourner un jeu comme World of Warcraft directement sur le réseau principal Ethereum - le coût en gas serait excessivement cher. Mais il pourrait tourner sur une sidechain avec un algorithme de consensus différent. Nous parlerons dans une prochaine leçon des types de DApps que vous voudriez déployer sur des sidechains ou sur le réseau principal Ethereum.

## Emboîtement de structure pour économiser du gas

Dans la Leçon 1, nous avons dit qu'il existait d'autres types de `uint` : `uint8`, `uint16`, `uint32`, etc.

Normalement, il n'y a pas d’intérêt à utiliser ces sous-types car Solidity réserve 256 bits de stockage indépendamment de la taille du `uint`. Par exemple, utiliser un `uint8` à la place d'un `uint` (`uint256`) ne vous fera pas gagner de gas.

Mais il y a une exception : dans les `struct`.

Si vous avez plusieurs `uint` dans une structure, utiliser des plus petits `uint` quand c'est possible permettra à Solidity d'emboîter ces variables ensemble pour qu'elles prennent moins de place. Par exemple :

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` utilisera moins de gas que `normal` grâce à l’emboîtement de structure
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30);
```

Pour cette raison, à l'intérieur d'une structure, il sera préférable d'utiliser le plus petit sous-type possible.

Il sera aussi important de grouper les types de données (c.-à.-d. les mettre à coté dans la structure)
afin que Solidity puisse minimiser le stockage nécessaire. Par exemple, une structure avec des champs
`uint c; uint32 a; uint32 b;` coûtera moins cher qu'une structure avec les champs `uint32 a; uint c; uint32 b;`
car les champs `uint32` seront regroupés ensemble.


## A votre tour

Dans cette leçon, nous allons ajouter 2 nouvelles fonctionnalités à nos zombies : `level` (niveau) et `readyTime` (temps de disponibilité) - le dernier sera utilisé pour implémenter un compte à rebours pour limiter la fréquence à laquelle un zombie peut être nourri.

Revenons à `zombiefactory.sol`.

1. Ajoutez deux propriétés à notre structure `Zombie` : `level` (un `uint32`), et `readyTime` (aussi un `uint32`). Nous voulons emboîter ces types de données ensemble, pour cela mettez les à la fin de la structure.

32 bits est largement suffisant pour stocker le niveau des zombies et l'horodatage, cela nous fera économiser du gas en emboîtant les données comparativement à un `uint` (256-bits).
