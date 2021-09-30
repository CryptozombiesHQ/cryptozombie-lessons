---
title: Lo Storage è Costoso
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

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            // Inizia qui
          }

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

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
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

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);

          return result;
        }

      }
---

Una delle operazioni più costose di Solidity è l'utilizzo di `storage`, specialmente quando scrivi.

Questo perché ogni volta che scrivi o modifichi un dato, questo viene scritto permanentemente nella blockchain. Per sempre! Migliaia di nodi in tutto il mondo devono archiviare tali dati sui loro dischi rigidi e questa quantità di dati continua a crescere nel tempo man mano che la blockchain cresce. Quindi c'è un costo per fare tutto questo.

Al fine di contenere i costi, si desidera evitare di scrivere i dati nell'archiviazione, tranne quando assolutamente necessario. A volte ciò implica una logica di programmazione apparentemente inefficiente — come ricostruire un array in `memory` ogni volta che viene chiamata una funzione invece di salvare semplicemente quell'array in una variabile per ricerche rapide. 

Nella maggior parte dei linguaggi di programmazione, eseguire il loop su set di dati di grandi dimensioni è costoso. Ma in Solidity, questo è molto più economico rispetto all'utilizzo di `storage` se è in una funzione `external view`, poiché le funzioni `view` non costano alcun gas agli utenti. (E il gas costa ai tuoi utenti soldi veri!).

Esamineremo i loop `for` nel prossimo capitolo, ma prima esaminiamo come dichiarare le matrici in memoria.

## Dichiarazione di array in memoria

Puoi usare la parola chiave `memory` con array per creare un nuovo array all'interno di una funzione senza bisogno di scrivere nulla nella memoria. L'array esisterà solo fino alla fine della chiamata di funzione, e questo è molto più economico dal punto di vista del gas rispetto all'aggiornamento di un array in `storage` — gratuito se si tratta di una funzione `view` chiamata esternamente.

Ecco come dichiarare un array in memoria:

```
function getArray() external pure returns(uint[]) {
  // Crea un nuovo array in memoria con una lunghezza di 3
  uint[] memory values = new uint[](3);
  // Aggiungi alcuni valori ad esso
  values.push(1);
  values.push(2);
  values.push(3);
  // Restituisce l'array
  return values;
}
```

Questo è un esempio banale solo per mostrarti la sintassi, ma nel prossimo capitolo vedremo come combinare questo con un ciclo `for` per casi d'uso reali.

>Nota: le matrici di memoria **devono** essere create con un argomento di lunghezza (in questo esempio, `3`). Al momento non possono essere ridimensionati come possono fare gli array di archiviazione con `array.push()`, sebbene ciò possa essere cambiato in una versione futura di Solidity.

## Facciamo una prova

Nella nostra funzione `getZombiesByOwner`, vogliamo restituire un array `uint[]` con tutti gli zombi di un determinato utente.

1. Dichiarare una variabile `uint[] memory` chiamata `result`

2. Impostalo uguale ad un nuovo array `uint`. La lunghezza dell'array dovrebbe essere comunque il numero degli zombi di questo `_owner`, che possiamo cercare dalla nostra `mapping` con: `ownerZombieCount[_owner]`.

3. Al termine della funzione restituire `result`. È solo un array vuoto in questo momento, ma nel prossimo capitolo lo riempiremo.
