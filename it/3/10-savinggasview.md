---
title: Risparmiare Gas con le funzioni 'View'
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

          // Crea la tua funzione qui

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

        function getZombiesByOwner(address _owner) external view returns(uint[]) {

        }

      }
---

Eccezionale! Per dare ai nostri proprietari un incentivo per farli salire di livello, abbiamo introdotto alcune abilità speciali per gli zombi di livello superiore. Se vogliamo possiamo aggiungerne altri in seguito.

Aggiungiamo un'altra funzione: la nostra DApp ha bisogno di un metodo per visualizzare l'intero esercito di zombi di un utente — chiamiamolo `getZombiesByOwner`.

Questa funzione dovrà solo leggere i dati dalla blockchain, quindi possiamo renderla una funzione `view`. Il che ci porta a un argomento importante quando si parla di ottimizzazione del gas:

## Le funzioni di visualizzazione (View) non costano Gas

Le funzioni `view` non costano gas quando vengono chiamate esternamente da un utente.

Questo perché le funzioni `view` non modificano niente sulla blockchain, ma leggono solo i dati. Quindi contrassegnare una funzione con `view` dice a `web3.js` che deve solo interrogare il tuo nodo Ethereum locale per eseguire la funzione, e in realtà non deve creare una transazione sulla blockchain (che dovrebbe essere eseguita su ogni singolo nodo con un costo di Gas).

Nasconderemo la configurazione di web3.js con il tuo nodo in seguito. Per ora, la cosa da ricordare è che puoi ottimizzare il consumo di gas della tua DApp per i tuoi utenti utilizzando le funzioni `external view` quando possibile.

> Nota: se una funzione `view` viene chiamata internamente da un'altra funzione nello stesso contratto che **non** è una funzione `view`, costerà comunque gas. Questo perché l'altra funzione crea una transazione su Ethereum e dovrà comunque essere verificata da ogni nodo. Quindi le funzioni `view` sono gratuite solo quando vengono chiamate esternamente.

## Facciamo una prova

Implementeremo una funzione che restituirà l'intero esercito di zombi di un utente. In seguito possiamo chiamare questa funzione da `web3.js` se vogliamo visualizzare una pagina del profilo utente con l'intero esercito.

La logica di questa funzione è un po' complicata, quindi ci vorranno alcuni capitoli per implementarla.

1. Creare una nuova funzione chiamata `getZombiesByOwner`. Ci vorrà un argomento, un `address` chiamato `_owner`.

2. Rendiamola una funzione `external view` così possiamo chiamarla da `web3.js` senza bisogno di gas.

3. La funzione dovrebbe restituire un `uint []` (un array di `uint`).

Lascia il corpo della funzione vuoto per ora, lo riempiremo nel prossimo capitolo.
