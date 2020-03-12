---
title: Unità di Tempo
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. Definisci `cooldownTime` qui

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
                // 2. Aggiorna la seguente riga:
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
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
---

La proprietà `level` è piuttosto autoesplicativa. Più tardi, quando creeremo un sistema di combattimento, gli zombi che vincono più battaglie saliranno di livello in minor tempo ed avranno accesso a più abilità.

La proprietà `readyTime` richiede qualche spiegazione in più. L'obiettivo è quello di aggiungere un "tempo di recupero", semplicemente una quantità di tempo che uno zombi dovrà attendere, dopo che si è nutrito o ha attaccato, prima che gli sia concesso di mangiare o attaccare di nuovo. Senza questo lo zombi potrebbe attaccare e moltiplicarsi 1.000 volte al giorno, il che renderebbe il gioco troppo facile.

Per tenere traccia di quanto tempo uno zombi deve attendere fino a quando non potrà attaccare di nuovo, possiamo usare le unità di tempo di Solidity.

## Unità di Tempo

Solidity fornisce alcune unità native per gestire il tempo. 

La variabile `now` restituirà il timestamp unix corrente dell'ultimo blocco (il numero di secondi trascorsi dal 1 ° gennaio 1970). Il tempo unix mentre scrivo questo è `1515527488`.

> Nota: il tempo Unix è tradizionalmente memorizzato in un numero a 32 bit. Ciò porterà al problema "Anno 2038", quando i timestamp unix a 32 bit saranno pieni e romperanno molti sistemi legacy. Quindi, se volessimo che la nostra DApp continuasse a funzionare tra 20 anni, potremmo invece utilizzare un numero a 64 bit, ma nel frattempo i nostri utenti dovrebbero spendere più gas per utilizzare la nostra DApp. Decisioni di design!

Solidity contiene anche le unità di tempo `seconds`, `minutes`, `hours`, `days`, `weeks` e `years`. Questi si convertiranno in un `uint` del numero di secondi in quel periodo di tempo. Quindi `1 minutes` è `60`, `1 hours` è `3600` (60 secondi x 60 minuti), `1 days` è `86400` (24 ore x 60 minuti x 60 secondi), ecc.

Ecco un esempio di come queste unità di tempo possono essere utili:

```
uint lastUpdated;

// Imposta `lastUpdated` su `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Restituirà `true` se sono trascorsi 5 minuti da quando
// è stato chiamato` updateTimestamp`, `false` invece se non sono trascorsi 5 minuti
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Possiamo usare queste unità di tempo per la nostra funzione di `cooldown` degli Zombi.


## Facciamo una prova

Aggiungiamo un tempo di recupero alla nostra DApp e facciamo in modo che gli zombi debbano aspettare **1 giorno** dopo aver attaccato o nutrito per attaccare di nuovo.

1. Dichiara un `uint` chiamato `cooldownTime`, ed impostalo uguale a `1 days`. (Perdona la grammatica scadente: se la imposti a "1 day", non verrà compilato!)

2. Dato che abbiamo aggiunto un `level` e `readyTime` alla nostra struttura `Zombie` nel capitolo precedente, dobbiamo aggiornare `_createZombie()` per usare il numero corretto di argomenti quando creiamo una nuova struttura `Zombie`.

  Aggiorna la riga di codice `zombies.push` per aggiungere altri 2 argomenti: `1` (per `level`) e `uint32(now + cooldownTime)` (per `readyTime`).

> Nota: `uint32 (...)` è necessario perché `now` restituisce un `uint256` di default. Quindi dobbiamo convertirlo esplicitamente in un `uint32`.

`now + cooldownTime` sarà uguale al timestamp unix corrente (in secondi) più il numero di secondi in 1 giorno — che sarà uguale al timestamp unix tra 1 giorno da adesso. Successivamente possiamo confrontare per vedere se il `readyTime` di questo zombi è maggiore di `now` per vedere se è passato abbastanza tempo per utilizzare nuovamente lo zombi.

Implementeremo la funzionalità per limitare le azioni basate su `readyTime` nel prossimo capitolo.
