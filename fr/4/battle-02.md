---
title: Nombres aléatoires
actions: ['vérifierLaRéponse', 'indice']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // Commencez ici
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
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
      import "./zombiehelper.sol";

      contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
      }

---

Super ! Maintenant essayons de comprendre la logique de combat.

Tous les bons jeux ont besoin d'une part d'aléatoire. Comment pouvons-nous générer des nombres aléatoires en Solidity ?

La vraie réponse est qu'on ne peut pas. Du moins, nous ne pouvons pas le faire de manière sûre.

Voyons voir pourquoi.

## La génération de nombre aléatoire avec `keccak256`

La meilleure source d'aléatoire que nous avons avec Solidity est la fonction de hachage `keccak256`.

Pour générer un nombre aléatoire, nous pourrions faire quelque chose qui ressemble à :

```
// Générer un nombre aléatoire entre 1 et 100 :
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```
Cela prendrait l'horodatage de `now`, le `msg.sender`, et incrémenterait `nonce` (un nombre qui est utilisé seulement une fois, pour ne pas exécuter la même fonction avec les même paramètres plusieurs fois).

Ensuite, cela utilisera le `keccak` pour convertir ces paramètres en un hachage aléatoire, le convertir en un `uint` et utiliser `% 100` pour prendre seulement les 2 derniers chiffres, afin d'avoir un nombre aléatoire entre 0 et 99.

### Cette méthode est vulnérable aux attaques d'un nœud malhonnête.

En Ethereum, quand vous appelez la fonction d'un contrat, vous diffuser une **_transaction_** à un nœud ou à des nœuds du réseau. Les nœuds du réseau vont ensuite collecter plusieurs transactions, vont essayer d'être le premier à résoudre un problème mathématique qui demande un calcul intensif appelé "Proof of Work" (Preuve de Travail) ou PoW, et vont ensuite diffuser ce groupe de transactions avec leur PoW dans un **_bloc_** au reste du réseau.

Quand un nœud a résolu un PoW, les autres nœuds arrêtent d'essayer de résoudre le PoW, ils vérifient que la liste des transactions de l'autre nœud soit valide, acceptent le bloc et passent à la résolution du bloc suivant.

**Cela rend notre fonction nombre aléatoire exploitable.**

Imaginez que nous avons un contrat pile ou face - face vous doublez votre argent, pile vous perdez tout. Et qu'il utilise la fonction ci-dessus pour déterminer si c'est pile ou face. (`random >= 50` c'est face, `random < 50` c'est pile).

Si j'ai un nœud, je pourrais publier une transaction **seulement à mon propre nœud** et ne pas la partager. Je pourrais exécuter le code de la fonction pile ou face pour voir si j'ai gagné - et si je perds, choisir de ne pas ajouter cette transaction dans le prochain bloc que je résous. Je pourrais continuer indéfiniment jusqu'à ce que je gagne et résolve le bloc, et gagner de l'argent.

## Comment faire pour générer des nombres aléatoires de manière sûre sur Ethereum ?

Parce que tout le contenu de la blockchain est visible de tous les participants, c'est un problème difficile, et la solution est au-delà du cadre de ce tutoriel. Vous pouvez lire <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>Cette discussion StackOverflow (en anglais)</a> pour vous faire une idée. Une des possibilités serait d'avoir un **_oracle_** pour avoir accès à une fonction aléatoire en dehors de la blockchain Ethereum.

Bien sur, puisque des dizaine de milliers de nœuds Ethereum sur le réseau rivalisent pour résoudre le prochain bloc, mes chances de résoudre le prochain bloc sont vraiment faibles. Il me faudrait énormément de puissance de calcul et de temps pour réussir à l'exploiter - mais si la récompense est assez élevée (si je pouvais parier 100 000 000$ sur la fonction pile ou face), cela vaudrait la peine de l'attaquer.

Même si cette fonction aléatoire N'EST PAS sécurisée sur Ethereum, en pratique, à part si notre fonction aléatoire a beaucoup d'argent en jeu, les utilisateurs de votre jeu n'auront sûrement pas assez de ressources pour l'attaquer.

Puisque nous construisons simplement un jeu à des fin de démonstration dans ce tutoriel, et qu'il n'y a pas vraiment d'argent en jeu, nous allons accepter les compromis d'utiliser un générateur de nombre aléatoire simple à implémenter, sachant qu'il n'est pas totalement sûr.

Dans une prochaine leçon, il se peut que nous voyons comment utiliser des **_oracles_** (un moyen sécurisé de récupérer des données en dehors d'Ethereum) pour générer une fonction aléatoire depuis l'extérieur de la blockchain.

## A votre tour

Nous allons implémenter une fonction de nombre aléatoire que nous pourrons utiliser pour déterminer le résultat de nos combats, même si ce n'est pas totalement sécurisé contre les attaques.

1. Donnez à notre contrat un `uint` appelé `randNonce` égal à `0`.

2. Créez une fonction appelée `randMod` (Modulo aléatoire). Elle sera `internal`, aura un paramètre `uint` appelé `_modulus`, et renverra avec `returns` un `uint`.

3. La fonction devra d'abord incrémenter `randNonce` (en utilisant la syntaxe `randNonce++`).

4. Enfin, elle devra (en une ligne de code) calculer un `uint` à partir du hachage `keccak256` de `now`, `msg,sender` et `randNonce` - et renvoyer avec `return` cette valeur modulo (%) `_modulus`. (Ouf! C'était un gros morceau, si vous n'avez pas tout suivi, jetez un œil à l'exemple ci-dessus où nous avons généré un nombre aléatoire - la logique est très similaire).
