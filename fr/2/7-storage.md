---
title: Stockage vs mémoire
actions: ['vérifierLaRéponse', 'indice']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // commencez ici

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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

En Solidity, il y a deux endroits pour stocker les variables - dans le `storage` (stockage) ou dans la `memory` (mémoire).

Le **_stockage_** est utilisé pour les variables stockées de manière permanente dans la blockchain. Les variables **_mémoires_** sont temporaires, et effacées entre les appels de fonction extérieure à votre contrat. C'est un peu comme le disque dur et la mémoire vive de votre ordinateur.

La plupart du temps, vous n'aurez pas besoin d'utiliser ces mots clés car Solidity gère ça tout seul. les variables d'état (déclarées en dehors des fonctions) sont par défaut `storage` et écrites de manière permanente dans la blockchain, alors que les variables déclarées à l'intérieur des fonctions sont `memory` et disparaissent quand l'appel à la fonction est terminé.

Cependant, il peut arriver que vous ayez besoin d'utiliser ces mots clés, surtout quand vous utilisez des **_structures_** et des **_tableaux_** à l'intérieur de fonctions :

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Cela pourrait paraître simple, mais Solidity renverra un avertissement
    // vous indiquant que vous devriez déclarer explicitement `storage` ou `memory` ici.

    // Vous devriez donc déclarez avec le mot clé `storage`, comme ceci :
    Sandwich storage mySandwich = sandwiches[_index];
    // ...dans ce cas, `mySandwich` est un pointeur vers `sandwiches[_index]`
    // dans le stockage et...
    mySandwich.status = "Eaten!";
    // ... changera définitivement `sandwiches[_index]` sur la blockchain.

    // Si vous voulez juste une copie, vous pouvez utiliser `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...dans ce cas, `anotherSandwich` sera simplement une copie des
    // données dans la mémoire et...
    anotherSandwich.status = "Eaten!";
    // ... modifiera simplement la variable temporaire et n'aura pas
    // d'effet sur `sandwiches[_index + 1]`. Mais vous pouvez faire ceci :
    sandwiches[_index + 1] = anotherSandwich;
    // ...si vous voulez copier les modifications dans le stockage de la blockchain.
  }
}
```

Ne vous inquiétez pas si nous ne comprenez pas complètement quand utiliser l'un ou l'autre pour l'instant - au cours du tutoriel, nous vous indiquerons quand utiliser `storage` et quand utiliser `memory`, et le compilateur Solidity vous avertira aussi pour vous indiquer quand vous devriez utiliser un de ces mots clés.

Pour l'instant, vous avez juste besoin de retenir qu'il y aura des cas où vous allez avoir besoin d'utiliser `storage` et `memory` !

# A votre tour

Il est temps de donner à nos zombies la capacités de se nourrir et de se multiplier !

Quand un zombie se nourri d'une autre forme de vie, son ADN se combine avec l'autre forme de vie pour créer un nouveau zombie.

1. Créez une fonction appelée `feedAndMultiply` qui aura  deux paramètres : `_zombieId` (un `uint`) et `_targetDna` (aussi un `uint`). Cette fonction devra être `public`.

2. Nous ne voulons pas que d'autres personnes puissent nourrir notre zombie ! Nous allons vérifier que nous sommes bien le propriétaire de ce zombie. Ajoutez une déclaration `require` pour vérifier que `msg.sender` est égal au propriétaire du zombie (de la même manière que dans la fonction `createPseudoRandomZombie`).

> Remarque : De la même manière, parce que notre validation de réponse est basique, il faudra que `msg.sender` soit en premier, sinon cela ne sera pas validé. Normalement quand vous codez, vous pouvez choisir l'ordre que vous voulez, les 2 étant justes.

3. Nous allons avoir besoin de l'ADN de ce zombie. La prochaine chose que notre fonction devra faire c'est de déclarer un `Zombie` local nommé `myZombie` (qui sera un pointeur `storage`). Définissez cette variable égale à l'index `_zombieId` de notre tableau `zombies`.

Vous devriez avoir 4 lignes de code pour l'instant, en comptant la ligne de fin `}`.

Nous continuerons de remplir cette fonction dans le prochain chapitre !
