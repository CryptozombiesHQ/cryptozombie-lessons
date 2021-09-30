---
title: Pagamento
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

          // 1. Definisci levelUpFee qui

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Inserisci la funzione levelUp qui

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

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
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
---

Fino ad ora abbiamo nascosto alcune **_funzioni di modifica_**. Può essere difficile ricordare tutto, quindi passiamo a una breve recensione:

1. Abbiamo modificatori di visibilità che controllano da dove e quando la funzione può essere chiamata: `private` significa che è richiamabile solo da altre funzioni all'interno del contratto; `internal` è come `private` ma può anche essere chiamata da contratti che ereditano; `external` può essere chiamata solo al di fuori del contratto; ed infine `public` può essere chiamata ovunque, sia internamente che esternamente.

2. Abbiamo anche i modificatori di stato che ci dicono come la funzione interagisce nella BlockChain: `view` ci dice che eseguendo la funzione, nessun dato verrà salvato/modificato. `pure` ci dice che non solo la funzione non salva alcun dato nella blockchain ma non legge neanche i dati. Entrambi non costano gas per la chiamata se vengono chiamati esternamente, al di fuori del contratto (ma costano gas se chiamati internamente da un'altra funzione).

3. Quindi abbiamo `modifiers` personalizzati, che abbiamo appreso nella Lezione 3: `onlyOwner` ed `aboveLevel` per esempio. Per questi possiamo definire una logica personalizzata per determinare come influenzano una funzione.

Tutti questi modificatori possono essere impilati insieme su una definizione di funzione, come la seguente:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

In questo capitolo introdurremo un altra funzione di modifica: `payable`.

## Il modificatore `payable`

Le funzioni `payable` fanno parte di ciò che rendono Solidity ed Ethereum così interessanti: sono un tipo speciale di funzione che può ricevere Ether.

Riflettici un minuto. Quando chiami una funzione API su un normale server web, non puoi inviare dollari USA insieme alla tua chiamata di funzione, né puoi inviare Bitcoin.

Ma in Ethereum poiché sia il denaro (_Ether_), che i dati (*transaction payload*), che il codice del contratto stesso vivono tutti su Ethereum, è possibile chiamare una funzione **e** pagare il contratto al lo stesso tempo.

Ciò consente una logica davvero interessante, come richiedere un certo pagamento al contratto per eseguire una funzione.

## Vediamo un esempio
```
contract OnlineStore {
  function buySomething() external payable {
    // Verifica che 0,001 ether sia stato inviato alla chiamata di funzione:
    require(msg.value == 0.001 ether);
    // In tal caso, trasferire l'oggetto digitale al richiedente per la funzione:
    transferThing(msg.sender);
  }
}
```

Qui `msg.value` è un modo per vedere quanto Ether è stato inviato al contratto, ed `ether` è un'unità incorporata.

Quello che succede qui è che qualcuno potrebbe chiamare la funzione da web3.js (dal front-end JavaScript di DApp) come segue:

```
// Supponendo che `OnlineStore` punti al tuo contratto su Ethereum:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

Si noti il campo `value`, in cui la chiamata della funzione JavaScript specifica la quantità di `ether` da inviare (0.001). Pensa la transazione come ad una busta, i parametri che invii alla chiamata di funzione sono i contenuti della lettera che hai inserito, quindi aggiungere un valore è come mettere denaro nella busta: la lettera e il denaro vengono consegnati insieme al destinatario.

>Nota: se una funzione non è contrassegnata come `payable` e si tenta di inviare Ether come sopra, la funzione rifiuterà la transazione.


## Facciamo una prova

Creiamo una funzione `payable` nel nostro gioco di zombi.

Supponiamo che il nostro gioco abbia una funzione in cui gli utenti possono pagare ETH per far salire di livello i loro zombi. L'ETH verrà archiviato nel contratto di cui sei proprietario: questo è un semplice esempio di come potresti guadagnare con i tuoi giochi!

1. Definire un `uint` chiamato `levelUpFee`, ed impostarlo uguale a `0,001 ether`.

2. Creare una funzione denominata `levelUp`. Ci vorrà un parametro, `_zombieId`, un `uint`. Dovrà essere `external` e `payable`.

3. La funzione dovrebbe innanzitutto richiedere che `msg.value` sia uguale a `levelUpFee`.

4. Dovrebbe quindi aumentare il `level` di questo zombi: `zombies[_zombieId].level++`.
