---
title: Modificatori di Zombi
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // Inizia qui

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

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
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
        pragma solidity ^0.4.25;

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
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
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
        pragma solidity ^0.4.25;

          /**
          * @title Ownable
          * @dev Il contratto di proprietà ha un indirizzo del proprietario e fornisce funzioni di controllo
          * delle autorizzazioni di base, ciò semplifica l'implementazione delle "autorizzazioni dell'utente".
          */
          contract Ownable {
            address private _owner;

            event OwnershipTransferred(
              address indexed previousOwner,
              address indexed newOwner
            );

            /**
            * @dev Il costruttore di proprietà imposta il `proprietario` originale del contratto sull'account del mittente.
            */
            constructor() internal {
              _owner = msg.sender;
              emit OwnershipTransferred(address(0), _owner);
            }

            /**
            * @return l'indirizzo del proprietario.
            */
            function owner() public view returns(address) {
              return _owner;
            }

            /**
            * @dev Genera se chiamato da qualsiasi account diverso dal proprietario.
            */
            modifier onlyOwner() {
              require(isOwner());
              _;
            }

            /**
            * @return vero se `msg.sender` è il proprietario del contratto.
            */
            function isOwner() public view returns(bool) {
              return msg.sender == _owner;
            }

            /**
            * @dev Consente all'attuale proprietario di rinunciare al controllo del contratto.
            * @notice La rinuncia alla proprietà lascerà il contratto senza un proprietario
            * Non sarà più possibile chiamare le funzioni con il modificatore `onlyOwner`.
            */
            function renounceOwnership() public onlyOwner {
              emit OwnershipTransferred(_owner, address(0));
              _owner = address(0);
            }

            /**
            * @dev Consente all'attuale proprietario di trasferire il controllo del contratto a un nuovo proprietario.
            * @param newOwner L'indirizzo a cui trasferire la proprietà.
            */
            function transferOwnership(address newOwner) public onlyOwner {
              _transferOwnership(newOwner);
            }

            /**
            * @dev Trasferisce il controllo del contratto a un nuovo proprietario.
            * @param newOwner L'indirizzo a cui trasferire la proprietà.
            */
            function _transferOwnership(address newOwner) internal {
              require(newOwner != address(0));
              emit OwnershipTransferred(_owner, newOwner);
              _owner = newOwner;
            }
          }
    answer: >
      pragma solidity ^0.4.25;

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

      }
---

Ora usiamo il nostro modificatore `aboveLevel` per creare alcune funzioni.

Il nostro gioco avrà alcuni incentivi per far salire di livello i loro zombi:

- Per gli zombi di livello 2 o superiore, gli utenti saranno in grado di cambiare il loro nome.
- Per gli zombi di livello 20 o superiore, gli utenti saranno in grado di fornire un loro DNA personalizzato.

Implementeremo queste funzioni di seguito. Ecco il codice di esempio della lezione precedente come riferimento:

```
// Una mappatura per memorizzare l'età di un utente:
mapping (uint => uint) public age;

// Funzione di modifica che richiede che questo utente abbia più di una certa età:
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

//  Deve avere più di 16 anni per guidare un'auto (almeno negli Stati Uniti).
function driveCar(uint _userId) public olderThan(16, _userId) {
  // Qualche funzione logica
}
```

## Facciamo una prova

1. Creare una funzione chiamata `changeName`. Ci vorranno 2 argomenti: `_zombieId` (un `uint`) e `_newName` (una `string`), inoltre lo renderemo `external`. Dovrebbe avere il modificatore `aboveLevel` e dovrebbe passare `2` per il parametro `_level`. (Non dimenticare di passare anche lo `_zombieId`).

2. Per prima cosa in questa funzione dobbiamo verificare che `msg.sender` sia uguale a `zombieToOwner[_zombieId]`. Utilizzare un'istruzione `request`.

3. Quindi la funzione dovrebbe impostare `zombies[_zombieId].name` uguale a `_newName`.

4. Crea un'altra funzione chiamata `changeDna` sotto `changeName`. La sua definizione ed i suoi contenuti saranno quasi identici a `changeName`, tranne per il fatto che il suo secondo argomento sarà `_newDna` (un `uint`) e dovrebbe passare `20` per il parametro `_level` su `aboveLevel`. E, naturalmente, dovrebbe impostare il `dna` dello zombi su `_newDna` invece di impostare il nome dello zombi.
