---
title: Cosa mangiano gli zombi?
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        // Crea qui KittyInterface

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
        pragma solidity ^0.4.25;

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
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

È tempo di sfamare i nostri zombi! E cosa piace di più agli zombi?

Beh, è proprio così, i CryptoZombies amano mangiare...

**CryptoKitties!** 😱😱😱

(Sì, sono serio 😆)

Per fare questo avremo bisogno di leggere il kittyDna dal contratto intelligente di CryptoKitties. Possiamo farlo perché i dati di CryptoKitties sono archiviati apertamente sulla blockchain. La blockchain non è fantastica?!

Non preoccuparti: il nostro gioco non danneggerà effettivamente i CryptoKitties di nessuno. Stiamo solo *leggendo* i dati di CryptoKitties, non siamo in grado di eliminarli 😉

## Interagire con altri contratti

Affinché il nostro contratto parli con un altro contratto sulla blockchain che non possediamo, per prima cosa dobbiamo definire una **_interface_**.

Diamo un'occhiata ad un semplice esempio. Supponiamo che ci fosse un contratto sulla blockchain che assomigli a questo:

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

Questo sarebbe un semplice contratto in cui chiunque potrebbe memorizzare il proprio numero fortunato ed esso verrà cos' associato al proprio indirizzo Ethereum. Quindi chiunque altro potrebbe cercare il numero fortunato di quella persona usando il proprio indirizzo.

Ora diciamo che avevamo un contratto esterno che voleva leggere i dati in questo contratto usando la funzione `getNum`.

Per prima cosa dovremmo definire una **_interface_** del contratto `LuckyNumber`:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Si noti che questo sembra definire un contratto, ma con alcune differenze. Stiamo solo dichiarando le funzioni con cui vogliamo interagire — in questo caso `getNum` — e non menzioniamo nessuna delle altre funzioni o variabili di stato.

In secondo luogo, non stiamo definendo i corpi delle funzioni. Invece di parentesi graffe (`{` e `}`), stiamo semplicemente terminando la dichiarazione di funzione con un punto e virgola (`;`).

Quindi sembra una specie di scheletro da contratto. Ecco come il compilatore sa che è un'interfaccia.

Includendo questa interfaccia nel nostro codice dapp, il nostro contratto conosce l'aspetto delle funzioni dell'altro contratto, come chiamarle e che tipo di risposta aspettarsi.

Nella lezione successiva inizieremo a chiamare le funzioni dell'altro contratto, ma per ora dichiariamo la nostra interfaccia per il contratto CryptoKitties.

# Facciamo una prova

Abbiamo cercato il codice sorgente di CryptoKitties per te ed abbiamo trovato una funzione chiamata `getKitty` che restituisce tutti i dati del gattino, inclusi i suoi "geni" (che è ciò di cui il nostro gioco zombi ha bisogno per formare un nuovo zombi!).

La funzione è simile alla seguente:

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

    // se questa variabile è 0 allora non è in gestazione.
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

La funzione sembra un po' diversa da quelle cui siamo abituati a vedere. Puoi vedere che infatti ritorna... un mucchio di valori diversi! Se provieni da un linguaggio di programmazione come JavaScript questo è diverso: in Solidity puoi restituire più di un valore da una funzione.

Ora che sappiamo come appare questa funzione, possiamo usarla per creare un'interfaccia:

1. Definire un'interfaccia chiamata `KittyInterface`. Ricorda, sembra proprio come creare un nuovo contratto: usiamo la parola chiave `contract`.

2. All'interno dell'interfaccia, definire la funzione `getKitty` (che dovrebbe essere un copia/incolla della funzione sopra, ma con un punto e virgola dopo l'istruzione `returns`, invece di tutto il contenuto presente tra le parentesi graffe.
