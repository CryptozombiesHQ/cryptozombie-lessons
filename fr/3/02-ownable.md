---
title: Contrats avec propriétaire
actions: ['vérifierLaRéponse', 'indice']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Importez ici

        // 2. Héritez ici :
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

          function setKittyContractAddress(address _address) external {
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

Avez-vous trouvé la faille de sécurité dans le chapitre précédent ?

`setKittyContractAddress` est `external`, donc n'importe qui peut l'appeler ! Cela veut dire que n'importe qui pourrait changer l'adresse du contrat CryptoKitties en l'appelant, et casser notre application pour tous les utilisateurs.

Nous voulons être capable de mettre à jour cette adresse de notre contrat, mais nous ne voulons pas que tout le monde puisse le faire.

Pour gérer une situation comme celle-là, il y a une pratique courante qui consiste à rendre les contrats `Ownable` (avec propriétaire) - ce qui veut dire qu'ils ont un propriétaire (vous) avec des privilèges spéciaux.

## Le contrat `Ownable` d'OpenZeppelin

Ci-dessous vous trouverez le contrat `Ownable` issu de la bibliothèque Solidity d'**_OpenZeppelin_**. OpenZeppelin est une bibliothèque de smart contracts sécurisés et approuvés par la communauté que vous pouvez utiliser dans vos propres DApps. Après cette leçon, alors que vous allez attendre avec impatience la sortie de la Leçon 4, nous vous recommandons fortement d'aller voir leur site internet pour en apprendre d'avantage !

Lisez-le contrat ci-dessous. Vous allez voir des choses que nous ne connaissons pas encore, mais ne vous inquiétez pas, nous en parlerons plus tard.

```
 /**
  * @title Ownable
  * @dev Le contrat Ownable a une adresse de propriétaire, et offre des fonctions de contrôle
  * d’autorisations basiques, pour simplifier l’implémentation des "permissions utilisateur".
  */
contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

   /**
    * @dev Le constructeur Ownable défini le `owner` (propriétaire) original du contrat égal
    * à l'adresse du compte expéditeur (msg.sender).
    */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Abandonne si appelé par un compte autre que le `owner`.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

   /**
    * @dev Permet au propriétaire actuel de transférer le contrôle du contrat
    * à un `newOwner` (nouveau propriétaire).
    * @param newOwner C'est l'adresse du nouveau propriétaire
    */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
```

Quelques nouveautés que nous n'avions pas encore vues :

- Constructeurs : `function Ownable()` est un **_constructor_** (constructeur), c'est une fonction spéciale optionnelle qui a le même nom que le contrat. Elle sera exécutée seulement une fois, lorsque le contrat est créé.
- Modificateurs de fonction : `modifier onlyOwner()`. Les modificateurs sont comme des demi-fonctions qui permettent de modifier d'autres fonctions, souvent pour vérifier des conditions avant l'exécution. Dans ce cas, `onlyOwner` peut être utilisé pour limiter l'accès pour que **seulement** (only) le **propriétaire** (owner) du contrat puisse exécuter cette fonction. Nous parlerons plus en détail des modificateurs de fonction dans le prochain chapitre, et ce que cet étrange `_;` fait.
- Mot-clé `indexed` : ne vous inquiétez pas pour celui là, nous n'en avons pas encore besoin.

Pour résumer le contrat `Ownable` fait fondamentalement ceci :

1. Quand un contrat est créé, son constructeur défini le `owner` égal à `msg.sender` (la personne qui le déploie)

2. Il ajoute un modificateur `onlyOwner`, qui permet de restreindre l'accès à certaines fonctions à seulement le `owner`

3. Il vous permet de transférer le contrat à un nouvel `owner`

`onlyOwner` est une condition si courante pour les contrats que la plupart des DApps Solidity commencent par copier/coller ce contrat `Ownable`, et leur premier contrat en hérite.

Vu que nous voulons limiter `setKittyContractAddress` à `onlyOwner`, nous allons faire pareil pour notre contrat.

## A votre tour

Nous avons pris de l'avance et avons copié le code du contrat `Ownable` dans un nouveau fichier, `ownable.sol`. Nous allons faire hériter `ZombieFactory` de celui-ci.

1. Modifiez notre code pour `import` le contenu de `ownable.sol`. Si vous ne vous rappelez plus comment faire, regardez `zombiefeeding.sol`.

2. Modifiez le contrat `ZombieFactory` pour qu'il hérite de `Ownable`. Pareillement, regardez `zombiefeeding.sol` si vous ne vous rappelez plus comment faire.
