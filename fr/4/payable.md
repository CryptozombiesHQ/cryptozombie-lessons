---
title: Payable
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

          // 1. Définissez levelUpFee ici

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Ajoutez la fonction levelUp ici

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

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
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

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
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

Nous avons, jusqu'à présent, vu plusieurs **_modificateurs de fonction_**. Il n'est pas forcément évident de se rappeler de tous, nous allons donc les revoir rapidement :

1. Il existe des modificateurs de visibilité qui contrôlent quand et depuis où la fonction peut être appelée : `private` veut dire que la fonction ne peut être appelée que par les autres fonctions à l'intérieur du contrat; `internal` est comme `private` mais en plus, elle peut être appelée par les contrats qui héritent de celui-ci; avec `external`, la fonction ne peut être appelée que depuis l'extérieur du contrat; et enfin avec `public`, elle peut être appelée depuis n'importe où, à l'intérieur et à l'extérieur.

2. Il existe aussi des modificateurs d'état, qui nous indiquent comment la fonction interagit avec la BlockChain : `view` nous indique qu'en exécutant cette fonction, aucune donnée ne sera écrite/modifiée. `pure` nous indique que non seulement aucune donnée ne sera enregistrée sur la BlockChain, mais qu'en plus aucune donnée de la BlockChain ne sera lue. Ces 2 fonctions ne coûtent pas de gas si elles sont appelées depuis l'extérieur du contrat (mais elle coûtent du gas si elles sont appelées à l'intérieur du contrat par une autre fonction).

3. Ensuite nous avons les modificateurs personnalisés, que nous avons étudiés à la leçon 3 : `onlyOwner` et `aboveLevel` par exemple. Nous avons pu déterminer des logiques personnalisés pour ceux-ci, afin de choisir de quelles manières ils affectent une fonction.

On peut aussi ajouter plusieurs modificateurs à la définition d'une fonction :

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

Dans ce chapitre, nous allons voir un nouveau modificateur de fonction : `payable`.


## Le modificateur `payable`

Une des choses qui rend Solidity et Ethereum vraiment cool est le modificateur `payable`, une fonction `payable` est une fonction spéciale qui peut recevoir des Ether.

Réfléchissons une minute. Quand vous faites un appel à une fonction API sur un serveur normal, vous ne pouvez pas envoyer des dollars US en même temps - pas plus que des Bitcoin.

Mais en Ethereum, puisque la monnaie (_Ether_), les données (*charge utile de la transaction*) et le code du contrat lui-même sont directement sur Ethereum, il est possible pour vous d'appeler une fonction **et** de payer le contrat en même temps.

Cela permet un fonctionnement vraiment intéressant, comme demander un certain paiement au contrat pour pouvoir exécuter une fonction.

## Prenons un exemple
```
contract OnlineStore {
  function buySomething() external payable {
    // Vérifie que 0.001 ether a bien été envoyé avec l'appel de la fonction :
    require(msg.value == 0.001 ether);
    // Si c'est le cas, transférer l'article digital au demandeur de la fonction :
    transferThing(msg.sender);
  }
}
```

Ici, `msg.value` est la façon de voir combien d'Ether ont été envoyés au contrat, et `ether` est une unité intégrée.

Quelqu'un va appeler la fonction depuis web3.js (depuis l'interface utilisateur JavaScript de la DApp) de cette manière là :

```
// En supposant que `OnlineStore` pointe vers le contrat Ethereum :
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

On remarque le champs `value` (valeur), où l'appel de la fonction JavaScript indique combien d'`ether` envoyer (0.001). Si vous imaginez la transaction comme une enveloppe, et les paramètres que vous envoyez à l'appel de la fonction comme étant la lettre que vous mettez à l'intérieur, alors ajouter `value` revient au même que d'ajouter du cash à l'intérieur de l'enveloppe - la lettre et l'argent vont être donnés au même moment au destinataire.

> Remarque : Si une fonction n'est pas marquée `payable` et que vous essayez de lui envoyer des Ether, la fonction rejettera votre transaction.


## A votre tour

Nous allons créer une fonction `payable` pour notre jeu de zombie.

Disons que notre jeu permet aux utilisateurs de faire passer un niveau à leurs zombies en payant des ETH. Les ETH seront stockés dans le contrat, que vous possédez - c'est un exemple simple de comment faire de l'argent avec vos jeux !

1. Définissez un `uint` appelé `levelUpFee` égal à `0.001 ether`.

2. Créez une fonction appelée `levelUp`. Elle aura un paramètre, `_zombieId`, un `uint`. Elle devra être `external` et `payable`.

3. La fonction devra d'abord utiliser un `require` pour vérifier que `msg.value` soit égal à `levelUpFee`.

4. Elle devra ensuite incrémenter le `level` du zombie : `zombies[_zombieId].level++`.
