---
title: Que mangent les zombies ?
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // créer l'interface KittyInterface ici

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Il est temps de nourrir nos zombies ! Et qu'est ce que les zombies aiment manger par dessus tout ?

Eh bien, il se trouve que les CryptoZombies adorent manger des...

**CryptoKitties!** 😱😱😱

(Oui, Je suis sérieux 😆)

Pour pouvoir faire ça, nous allons avoir besoin de lire l'ADN des chatons (kittyDna) depuis le smart contract CryptoKitties. Nous pouvons le faire car les données de CryptoKitties sont stockées ouvertement sur la blockchain. C'est pas génial la blockchain ?!

Ne vous en faites pas - notre jeu ne va faire de mal à aucun CryptoKitty. Nous allons seulement *lire* les données de CryptoKitties, nous ne sommes pas capables de les supprimer 😉.

## Interagir avec d'autres contrats

Pour que notre contrat puisse parler avec un autre contrat que nous ne possédons pas sur la blockchain, nous allons avoir besoin de définir une **_interface_**.

Prenons un exemple simple. Imaginons un contrat comme celui-ci sur la blockchain :

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```
Cela serait un simple contrat où n'importe qui pourrait stocker son nombre porte-bonheur, et il serait associé à leur adresse Ethereum. Ensuite n'importe qui pourrait regarder leur nombre porte-bonheur en utilisant leur adresse.

Maintenant, imaginons que nous avons un contrat externe qui voudrait lire les données de ce contrat en utilisant la fonction `getNum`.

Premièrement, nous devrions définir une **_interface_** du contract `LuckyNumber` :

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Vous remarquerez que cela ressemble à la définition d'un contrat, avec quelques différences. Premièrement nous déclarons seulement les fonctions avec lesquelles nous souhaitons interagir - dans ce cas, `getNum` - et nous ne mentionnons aucune autre fonction ou variable.

Deuxièmement, nous ne définissons par de corps de fonction, à la place des `{` et `}`, nous finissons simplement la déclaration de la fonction avec un `;`.

C'est un peu comme le squelette d'un contrat. C'est comme ça que le compilateur sait que c'est une interface.

En incluant cette interface dans le code de notre dapp, notre contrat sait à quoi ressemble les fonctions de l'autre contrat, comment les appeler, et quelle type de réponse en attendre.

Nous verrons comment appeler les fonctions de l'autre contrat dans la prochaine leçon, pour l'instant nous allons déclarer notre interface pour le contrat CryptoKitties.

# A votre tour

Nous avons regardé le code source de CryptoKitties pour vous, et avons trouvé une fonction appelée `getKitty` qui retourne toutes les données des chatons, "gènes" inclus (c'est ce dont nous avons besoin pour créer un nouveau zombie !).

La fonction ressemble à :
```
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
) {
    Kitty storage kit = kitties[_id];

    // si cette variable est 0 alors elle n'est pas en gestation
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

La fonction est un peu différente que ce dont nous avons l'habitude. Vous pouvez voir qu'elle retourne... un tas de différentes valeurs. Si vous venez d'un langage de programmation comme JavaScript, c'est différent - en Solidity une fonction peut retourner plus d'une valeur.

Maintenant que nous savons à quoi ressemble notre fonction, nous pouvons l'utiliser pour créer une interface :

1. Définissez une interface appelée `KittyInterface`. C'est comme déclarer un nouveau contrat - nous utilisons le mot clé `contract`.

2. Dans l'interface, définissez une fonction `getKitty` (qui devrait être un copier/coller de la fonction ci-dessus, mais avec un `;` après la déclaration `returns` au lieu de tout ce qu'il y a entre les `{}`).
