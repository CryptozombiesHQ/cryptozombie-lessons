---
title: Importation
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // mettre la déclaration d'importation ici

        contract ZombieFeeding is ZombieFactory {

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

            function _createZombie(string _name, uint _dna) private {
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

      contract ZombieFeeding is ZombieFactory {

      }

---

Vous remarquerez que nous avons fait un peu de ménage dans notre code à droite ! Vous avez maintenant des onglets en haut de votre éditeur. Cliquez sur les onglets pour voir.

Notre code devenant plutôt long, nous l'avons donc séparé en plusieurs fichiers pour mieux le gérer. C'est comme cela que vous devriez gérer les projets Solidity qui ont beaucoup de lignes de code.

Quand vous avez plusieurs fichiers et que vous voulez importer un fichier dans un autre, Solidity utilise le mot clé `import` (importation) :

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Nous avons donc un fichier nommé `someothercontract.sol` dans le même répertoire que ce contrat (c'est ce que `./` veut dire), il sera importé par le compilateur.

# A votre tour

Maintenant que nous avons une structure avec plusieurs fichiers, nous allons avoir besoin d'utiliser `import` pour lire le contenu de l'autre fichier :

1. Importer `zombiefactory.sol` dans notre nouveau fichier `zombiefeeding.sol`.
