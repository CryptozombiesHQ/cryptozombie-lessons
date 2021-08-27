---
title: Numeri Casuali (Random)
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity ^0.4.25;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          // Inizia qui
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            address _owner = owner();
            _owner.transfer(address(this).balance);
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
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
                uint rand = uint(keccak256(abi.encodePacked(_str)));;
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

      import "./zombiehelper.sol";

      contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        }
      }

---

Grande! Ora scopriamo la logica della battaglia.

Tutti i buoni giochi richiedono un certo livello di casualità. Quindi, come possiamo generare numeri casuali in Solidity?

La vera risposta qui è che non puoi. Beh, almeno non puoi farlo in sicurezza.

Diamo un'occhiata al perché.

## Generazione di numeri casuali tramite `keccak256`

La migliore fonte di casualità che abbiamo in Solidity è la funzione hash `keccak256`.

Potremmo fare qualcosa di simile per generare un numero casuale:

```
// Genera un numero casuale compreso tra 1 e 100:
uint randNonce = 0;
uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
randNonce++;
uint random2 = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
```

Quello che farebbe è prendere il timestamp di `now`, l'`msg.sender` ed un `nonce` incrementale (un numero che viene usato solo una volta, quindi non eseguiamo la stessa funzione hash con lo stesso input di parametri due volte).

Quindi "impacchetterebbe" gli input ed userebbe `keccak` per convertirli in un hash casuale. Successivamente, convertirà quell'hash in `uint` ed userebbe `%100` per prendere solo le ultime 2 cifre. Questo ci darà un numero totalmente casuale tra 0 e 99.

### Questo metodo è vulnerabile agli attacchi di un nodo disonesto

In Ethereum, quando si chiama la funzione di un contratto, si trasmette una transazione a un nodo o ai nodi della rete. I nodi della rete raccoglieranno quindi diverse transazioni, cercheranno di essere i primi a risolvere un problema matematico che richiede un calcolo intenso chiamato "Proof of Work" (PoW) e quindi trasmetterà questo gruppo di transazioni insieme al loro PoW in un blocco al resto della rete.

Quando un nodo ha risolto un PoW, gli altri nodi smettono di tentare di risolverlo, controllano che l'elenco delle transazioni dell'altro nodo sia valido, accettano il blocco e procedono alla risoluzione del blocco successivo.

**Questo rende utilizzabile la nostra funzione di numero casuale.**

Immagina di avere un contratto testa o croce, o raddoppi i tuoi soldi o perdi tutto. Usa la funzione di sopra per determinare se è testa o croce. (`random >= 50` è testa, `random < 50` è croce).

Se ho un nodo, potrei pubblicare una transazione **solo sul mio nodo** e non condividerla. Potrei eseguire il lancio della moneta per vedere se ho vinto - e se perdo, scegliere di non aggiungere questa transazione al blocco successivo che risolvo. Potrei andare avanti all'infinito fino a quando non vincerò e risolverò il blocco, e farò soldi.

## Quindi come possiamo generare numeri casuali in modo sicuro in Ethereum?

Poiché l'intero contenuto della blockchain è visibile a tutti i partecipanti, questo è un problema difficile e la sua soluzione va oltre lo scopo di questo tutorial. Puoi leggere <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>questo thread StackOverflow</a> per alcune idee. Un'idea sarebbe quella di utilizzare **_oracle_** per accedere ad una funzione di numero casuale dall'esterno della blockchain di Ethereum.

Naturalmente, poiché decine di migliaia di nodi Ethereum sulla rete sono in competizione per risolvere il blocco successivo, le mie probabilità di risolvere il blocco successivo sono davvero basse. Ci vorrebbe molto tempo e risorse informatiche per sfruttare questo profitto - ma se la ricompensa è abbastanza alta (come se potessi scommettere $100.000.000 sulla funzione di lancio della moneta), varrebbe la pena attaccare.

Quindi, sebbene questa generazione di numeri casuali NON sia sicura su Ethereum, in pratica, a meno che la nostra funzione casuale non abbia molti soldi sulla linea, gli utenti del tuo gioco probabilmente non avranno abbastanza risorse per attaccarlo.

Poiché in questo tutorial stiamo solo costruendo un semplice gioco a scopo dimostrativo e non ci sono soldi veri sulla linea, accetteremo i compromessi dell'utilizzo di un generatore di numeri casuali che è semplice da implementare, sapendo però che non è totalmente sicuro.

Nella prossima lezione potremo vedere come usare **_oracles_** (un modo sicuro per recuperare i dati al di fuori di Ethereum) per generare una funzione casuale dall'esterno della blockchain.

## Facciamo una prova

Implementeremo una funzione di numero casuale che possiamo usare per determinare l'esito dei nostri combattimenti, anche se non è completamente sicuro contro gli attacchi.

1. Dare al nostro contratto un `uint` chiamato `randNonce` uguale a `0`.

2. Creare una funzione chiamata `randMod` (modulo casuale). Sarà una funzione `internal` che prende un `uint` chiamato `_modulus` e restituisce un `uint`.

3. La funzione dovrebbe prima incrementare `randNonce` (usando la sintassi `randNonce++`).

4. Infine dovrebbe (in una riga di codice) calcolare il typecast `uint` dell'hash `keccak256` di `abi.encodePacked(now,msg.sender,randNonce)` — e restituire quel valore `%_modulus`. (Accidenti! È stato un grande pezzo, se non hai seguito tutto dai un'occhiata all'esempio sopra in cui abbiamo generato un numero casuale — la logica è molto simile).
