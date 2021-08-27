---
title: I Cicli For
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
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // Inizia qui
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
---

Nel capitolo precedente, abbiamo menzionato che a volte vorrai usare un ciclo `for` per costruire il contenuto di un array in una funzione piuttosto che semplicemente salvarlo nello storage.

Diamo un'occhiata al perché.

Per la nostra funzione `getZombiesByOwner`, un'implementazione ingenua sarebbe quella di memorizzare un `mapping` dei proprietari sugli eserciti di zombi nel contratto `ZombieFactory`:

```
mapping (address => uint[]) public ownerToZombies
```

Quindi ogni volta che creiamo un nuovo zombi, useremmo semplicemente `ownerToZombies[owner].push(zombieId)` per aggiungerlo all'array zombi di quel proprietario. E `getZombiesByOwner` sarebbe una funzione molto semplice:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### Il problema con questo approccio

Questo approccio è allettante per la sua semplicità. Ma vediamo cosa succede se in seguito aggiungiamo una funzione per trasferire uno zombi da un proprietario all'altro (cosa che sicuramente vorremmo aggiungere in una lezione successiva!).

Tale funzione di trasferimento dovrebbe:
1. Inserire lo zombi sull'array `ownerToZombies` del nuovo proprietario,
2. Rimuovi lo zombi dall'array `ownerToZombies` del vecchio proprietario,
3. Sposta tutti gli zombi nell'array del proprietario più vecchio di un posto per riempire il buco, e poi
4. Riduci la lunghezza dell'array di 1.

Lo step 3 sarebbe estremamente costoso dal punto di vista del gas, dal momento che dovremmo scrivere per ogni zombi di cui abbiamo cambiato la posizione. Se un proprietario ha 20 zombi e scambia il primo, dovremmo fare 19 scritture per mantenere l'ordine dell'array.

Poiché la scrittura su memoria è una delle operazioni più costose in Solidity, ogni chiamata a questa funzione di trasferimento sarebbe estremamente costosa dal punto di vista del gas. E peggio ancora, costerebbe una diversa quantità di gas ogni volta che viene chiamata, a seconda di quanti zombi ha l'utente nel proprio esercito e dell'indice dello zombi scambiato. Quindi l'utente non saprebbe quanto gas inviare esattamente.

>Nota: ovviamente potremmo spostare l'ultimo zombi nell'array per riempire lo slot mancante e ridurre la lunghezza dell'array di uno. Ma così cambieremo l'ordine del nostro esercito di zombi ogni volta che facciamo uno scambio.

Poiché le funzioni `view` non costano gas quando vengono chiamate esternamente, possiamo semplicemente usare un ciclo for in `getZombiesByOwner` per iterare l'intero array di zombi e creare un array di zombi che appartengono a questo specifico proprietario. Quindi la nostra funzione `transfer` sarà molto più economica, dal momento che non abbiamo bisogno di riordinare alcun array in memoria, in qualche modo controintuitivamente questo approccio è complessivamente più economico.

## Usare i cicli `for`

La sintassi dei cicli `for` in Solidity è simile a quella di JavaScript.

Diamo un'occhiata ad un esempio in cui vogliamo creare una matrice di numeri pari:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // Tieni traccia dell'indice nel nuovo array:
  uint counter = 0;
  // Ripetiamo da 1 a 10 con un ciclo for:
  for (uint i = 1; i <= 10; i++) {
    // Se `i` è pari ...
    if (i % 2 == 0) {
      // Aggiungilo al nostro array
      evens[counter] = i;
      // Incrementiamo il `contatore` di 1:
      counter++;
    }
  }
  return evens;
}
```

Questa funzione restituirà un array con il contenuto `[2, 4, 6, 8, 10]`.

## Facciamo una prova

Finiamo la nostra funzione `getZombiesByOwner` scrivendo un ciclo` for` che scorre attraverso tutti gli zombi nella nostra DApp, confronta il loro proprietario per vedere se abbiamo una corrispondenza e li inserisce nel nostro array `result` prima di restituirlo.

1. Dichiarare un `uint` chiamato `counter` ed impostarlo uguale a `0`. Useremo questa variabile per tenere traccia dell'indice nel nostro array `result`.

2. Dichiara un ciclo `for` che inizia da `uint i = 0` e passa attraverso `i < zombies.length`. Questo ripeterà ogni zombi nel nostro array.

3. All'interno del ciclo `for`, fai un'istruzione `if` che controlli se `zombieToOwner[i]` è uguale a `_owner`. Questo confronterà i due indirizzi per verificare se abbiamo una corrispondenza.

4. All'interno dell'istruzione `if`:
   1. Aggiungi l'ID dello zombi al nostro array `result` impostando `result[counter]` uguale a `i`.
   2. Incrementare `counter` di 1 (vedere l'esempio del ciclo `for` di sopra).

Ecco fatto: la funzione ora restituirà tutti gli zombi di proprietà di `_owner` senza spendere gas.
