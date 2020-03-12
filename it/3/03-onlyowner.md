---
title: Funzione di modifica OnlyOwner
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
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

          // Modifica questa funzione:
          function setKittyContractAddress(address _address) external {
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
          * @dev Il costruttore di proprietà imposta il `proprietario` originale del contratto sull'account
          * del mittente.
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
          * @notice La rinuncia alla proprietà lascerà il contratto senza un proprietario.
          * Non sarà più possibile chiamare le funzioni con il modificatore `onlyOwner`.
          */
          function renounceOwnership() public onlyOwner {
            emit OwnershipTransferred(_owner, address(0));
            _owner = address(0);
          }

          /**
          * @dev Consente all'attuale proprietario di trasferire il controllo del contratto ad un nuovo proprietario.
          * @param newOwner L'indirizzo a cui trasferire la proprietà.
          */
          function transferOwnership(address newOwner) public onlyOwner {
            _transferOwnership(newOwner);
          }

          /**
          * @dev Trasferisce il controllo del contratto ad un nuovo proprietario.
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
---

Ora che il nostro contratto di base `ZombieFactory` eredita da` Ownable`, possiamo usare il modificatore di funzione `onlyOwner` anche in` ZombieFeeding`.

Ciò è dovuto al modo in cui funziona l'eredità del contratto. Ricorda:

```
ZombieFeeding è ZombieFactory
ZombieFactory è Ownable
```

Pertanto `ZombieFeeding` è anche `Ownable` e può accedere alle funzioni / eventi / modificatori dal contratto `Ownable`. Questo vale per tutti i contratti che erediteranno da `ZombieFeeding` anche in futuro.

## Funzioni di Modifica

Una funzione di modifica ha l'aspetto di una classica funzione, ma usa la parola chiave `modifier` invece della parola chiave `function`. Inoltre non può essere chiamata direttamente come una funzione, si dovrà infatti associare il nome del modificatore alla fine della definizione di una funzione per cambiare il comportamento di tale funzione.

Diamo un'occhiata più da vicino esaminando `onlyOwner`:

```
pragma solidity ^0.4.25;

/**
 * @title Ownable
 * @dev Il contratto di proprietà ha un indirizzo del proprietario e fornisce funzioni di controllo delle autorizzazioni
 * di base, ciò semplifica l'implementazione delle "autorizzazioni dell'utente".
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
   * @notice La rinuncia alla proprietà lascerà il contratto senza un proprietario.
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
```

Notate il modificatore `onlyOwner` sulla funzione `renounceOwnership`. Quando chiami `renounceOwnership` il codice dentro `onlyOwner` viene eseguito per **primo**. Quindi quando si tratta dell'istruzione `_;` in `onlyOwner`, torna indietro ed esegue il codice all'interno di `renounceOwnership`.

Quindi ci sono altri modi in cui è possibile utilizzare i modificatori, uno dei casi d'uso più comuni è quello di aggiungere un rapido controllo `require` prima dell'esecuzione di una funzione.

Nel caso di `onlyOwner` l'aggiunta di questa funzione di modifica garantirà che **solo il proprietario** del contratto (tu, se lo hai implementato) sia abilitato a chiamare questa funzione.

> Nota: conferire al proprietario poteri speciali sul contratto in questo modo è spesso necessario ma potrebbe anche essere utilizzato in modo dannoso. Ad esempio, il proprietario potrebbe aggiungere una funzione backdoor che gli consentirebbe di trasferire gli zombi di chiunque a se stesso!

> Quindi è importante ricordare che solo perché una DApp è su Ethereum non significa automaticamente che sia decentralizzata — devi effettivamente leggere l'intero codice sorgente per assicurarti che sia privo di controlli speciali da parte del proprietario di cui devi potenzialmente preoccuparti. Come sviluppatore esiste un equilibrio tra il mantenimento del controllo di una DApp per correggere potenziali bug e la creazione di una piattaforma senza proprietario di cui gli utenti possono fidarsi per proteggere i propri dati.

## Facciamo una prova

Ora possiamo limitare l'accesso a `setKittyContractAddress` in modo che nessuno, tranne noi, possa modificarlo in futuro.

1. Aggiungi il modificatore `onlyOwner` a` setKittyContractAddress`.
