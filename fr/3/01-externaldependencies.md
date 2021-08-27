---
title: Immutabilité des contrats
actions: ['vérifierLaRéponse', 'indice']
requireLogin: true
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

          // 1. Enlevez cette ligne :
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Changez celle-là par une déclaration :
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Ajoutez une méthode setKittyContractAddress ici

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
---

Jusqu'à présent, Solidity était plutôt similaire aux autres langages comme JavaScript. Mais il y a de nombreuses différences entre les DApps Ethereum et les applications normales.

Pour commencer, une fois que vous avez déployé un contrat Ethereum, il est **_immuable_**, ce qui veut dire qu'il ne pourra plus jamais être modifié ou mis à jour.

Le code que vous allez déployer initialement pour un contrat restera de manière permanente sur la blockchain. C'est pour cela que la sécurité est une préoccupation si importante en Solidity. S'il y a une faille dans le code de votre contrat, il n'y aucun moyen pour vous de le patcher plus tard. Vous devrez dire à vos utilisateurs d'utiliser une adresse de contrat différente qui a le correctif.

Mais c'est aussi une des fonctionnalités des smart contracts. Le code est immuable. Si vous lisez et vérifiez le code d'un smart contract, vous pouvez être sûr que chaque fois que vous appellerez une fonction, cela fera exactement ce que le code dit de faire. Personne ne pourra changer cette fonction plus tard et vous n'aurez pas de résultats inattendus.


## Dépendances externes

Dans la leçon 2, nous avons codé en dur le contrat CryptoKitties dans notre DApp. Mais qu'arriverait-il si le contrat CryptoKitties avait un bug et que quelqu'un détruisait tous les chatons ?

C'est peu probable, mais si cela arrive cela rendrait notre DApp complètement inutile - notre DApp pointerait vers une adresse écrite en dur qui ne retournerait plus aucun chaton. Nos zombies seraient incapables de se nourrir de chatons, et nous ne serions pas capable de modifier notre contrat pour le corriger.

Pour cette raison, c'est souvent utile d'avoir des fonctions qui vous permettent de mettre à jour des portions clés de la DApp.

Par exemple, au lieu d'écrire en dur l'adresse du contrat CryptoKitties dans notre DApp, nous devrions sûrement avoir une fonction `setKittyContractAddress` qui nous permet de changer cette adresse dans le futur au cas où quelque chose arriverait au contrat CryptoKitties.


## A votre tour

Mettons à jour notre code de la Leçon 2 pour pouvoir changer l'adresse du contrat CryptoKitties.

1. Supprimez la ligne de code où nous avons écrit en dur `ckAddress`.

2. Changez la ligne où nous avons créé `kittyContract` pour simplement déclarer une variable - c.-à.-d. ne pas la rendre égale à quelque chose.

3. Créez une fonction appelée `setKittyContractAddress` qui aura un paramètre, `_address` (une `address`), et qui devra être une fonction `external`.

4. Dans la fonction, ajoutez une ligne de code qui définit `kittyContract` égal à `KittyInterface(_address)`.

> Remarque : Si vous remarquez une faille de sécurité avec cette fonction, ne vous inquiétez pas - nous allons la corriger dans le prochain chapitre ;)
