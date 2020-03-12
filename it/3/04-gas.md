---
title: Gas
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

            struct Zombie {
                string name;
                uint dna;
                // Aggiungi nuovi dati qui
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
---

Grande! Ora sappiamo come aggiornare porzioni chiave della DApp impedendo ad altri utenti di incasinare i nostri contratti.

Diamo un'occhiata ad un altro modo per cui Solidity è molto diversa dagli altri linguaggi di programmazione:

## Gas - il carburante Ethereum che funziona con le DApps 

In Solidity i tuoi utenti devono pagare ogni volta che eseguono una funzione sulla DApp usando una valuta chiamata **_gas_**. Gli utenti acquistano gas con Ether (la valuta su Ethereum), quindi i tuoi utenti devono spendere ETH per eseguire le funzioni sulla tua DApp.

La quantità di gas necessaria per eseguire una funzione dipende dalla complessità della logica di tale funzione. Ogni singola operazione ha un **_costo del gas_** basato approssimativamente sulla quantità di risorse di elaborazione necessarie per eseguire tale operazione (ad es. La scrittura in memoria è molto più costosa dell'aggiunta di due numeri interi). Il **_costo del gas_** totale della tua funzione è la somma dei costi del gas di tutte le sue singole operazioni.

Poiché l'esecuzione di funzioni costa denaro reale per i tuoi utenti, l'ottimizzazione del codice è molto più importante in Ethereum che in altri linguaggi di programmazione. Se il tuo codice è pessimo, i tuoi utenti dovranno pagare di più per eseguire le tue funzioni — e questo potrebbe aggiungere fino a milioni di dollari in commissioni non necessarie tra le migliaia di utenti.

## Perché è necessario il Gas?

Ethereum è come un grande, lento, computer ma estremamente sicuro. Quando si esegue una funzione ogni singolo nodo sulla rete dovrà eseguire quella stessa funzione per verificarne l'output: migliaia di nodi che verificano l'esecuzione di ogni funzione sono ciò che rende decentralizzato Ethereum ed i suoi dati immutabili e resistenti alla censura.

I creatori di Ethereum volevano assicurarsi che qualcuno non potesse ostruire la rete con un ciclo infinito, o impegnare tutte le risorse della rete con calcoli davvero pesanti. Quindi lo hanno fatto in modo che le transazioni non siano gratuite e gli utenti debbano pagare per i tempi di calcolo e per lo spazio di archiviazione.

> Nota: questo non è necessariamente vero per i sidechains, come quelli che gli autori di CryptoZombies stanno costruendo su Loom Network. Probabilmente non avrà mai senso eseguire un gioco come World of Warcraft direttamente sulla rete principale di Ethereum: i costi del gas sarebbero proibitivi. Ma potrebbe funzionare su una sidechain con un diverso algoritmo di consenso. Parleremo di più su quali tipi di DApps vorresti distribuire su sidechains rispetto alla mainnet di Ethereum in una lezione futura.

## Struttura ad incastro per risparmiare gas

Nella Lezione 1 abbiamo menzionato che ci sono altri tipi di `uint`s: `uint8`, `uint16`, `uint32`, ecc.

Normalmente non c'è alcun vantaggio nell'utilizzare questi sottotipi perché Solidity riserva 256 bit di memoria indipendentemente dalla dimensione `uint`. Ad esempio, l'uso di `uint8` invece di `uint` (`uint256`) non ti farà risparmiare alcun gas.

Ma c'è un'eccezione a questo: dentro `struct`s.

Se hai più `uint`s all'interno di una struttura, l'uso di un `uint` di dimensioni minori, quando possibile, consentirà a Solidity di raggruppare queste variabili per occupare meno spazio di archiviazione. Per esempio:

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` costerà meno gas rispetto a` normale` a causa della struttura ad incastro.
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

Per questo motivo all'interno di una struttura ti consigliamo di utilizzare i sottotipi di numeri interi più piccoli con cui puoi cavartela.

Ti consigliamo inoltre di raggruppare insieme tipi di dati identici (ovvero metterli uno
accanto all'altro nella struttura) in modo che Solidity possa ridurre al minimo lo spazio di archiviazione richiesto. Ad esempio, una struttura con
campi `uint c; uint32 a; uint32 b;` costerà meno gas di una struttura con campi `uint32 a; uint c; uint32 b;`
perché i campi `uint32` sono raggruppati insieme.


## Facciamo una prova

In questa lezione aggiungeremo 2 nuove funzionalità ai nostri zombi: `level` e `readyTime` — quest'ultimo verrà usato per implementare un timer di ricarica per limitare la frequenza con cui uno zombi può nutrirsi.

Quindi torniamo a `zombiefactory.sol`.

1. Aggiungi altre due proprietà alla nostra struttura `Zombie`: `level` (un `uint32`) e `readyTime` (anch'esso un `uint32`). Vogliamo mettere insieme questi tipi di dati, quindi mettiamoli alla fine della struttura.

32 bit è più che sufficiente per contenere il livello ed il timestamp dello zombi, quindi questo ci farà risparmiare alcuni costi del gas comprimendo i dati più strettamente rispetto all'uso di un normale `uint` (256 bit).
