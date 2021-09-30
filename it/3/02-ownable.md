---
title: Contratti Proprietari
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

        // 1. Importa qui

        // 2. Eredita qui:
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
      "ownable.sol": |
        pragma solidity ^0.4.25;

        /**
        * @title Ownable
        * @dev Un contratto di proprietà ha un indirizzo del proprietario e fornisce funzioni di autorizzazione di base
        * che semplificano l'implementazione delle "autorizzazioni utente".
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
---

Hai individuato la falla di sicurezza del capitolo precedente?

`setKittyContractAddress` è `external` quindi chiunque può chiamarlo! Ciò significa che chiunque abbia chiamato la funzione potrebbe cambiare l'indirizzo del contratto CryptoKitties ed interrompere la nostra app per tutti gli utenti.

Vogliamo la possibilità di aggiornare l'indirizzo nel nostro contratto, ma non vogliamo che tutti siano in grado di aggiornarlo.

Per gestire casi come questo, c'è una pratica comune come quella di rendere i contratti `Ownable` — nel senso che hanno un proprietario (tu) che ha privilegi speciali.

## Contratti `di proprietà` OpenZeppelin

Di seguito è riportato il contratto `Ownable` tratto dalla libreria di Solidity **_OpenZeppelin_**. OpenZeppelin è una libreria di contratti intelligenti sicuri e controllati dalla community che è possibile utilizzare nelle proprie DApp. Dopo questa lezione ti consigliamo vivamente di visitare il loro sito per migliorare il tuo apprendimento!

Dai un'occhiata al contratto di seguito. Vedrai alcune cose che non abbiamo ancora imparato ma non preoccuparti, ne riparleremo in seguito.

```
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
   * @dev Trasferisce il controllo del contratto ad un nuovo proprietario.
   * @param newOwner L'indirizzo a cui trasferire la proprietà.
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}
```

Ci sono alcune cose nuove che non abbiamo mai visto prima:

- Costruttori: `constructor()` è un **_costruttore_**, che è una funzione speciale opzionale. Verrà eseguito solo una volta, quando il contratto viene creato per la prima volta.
- Modificatori di funzioni: `modifier onlyOwner()`. I modificatori sono una specie di mezze funzioni che vengono utilizzate per modificare altre funzioni, in genere per verificare alcuni requisiti prima dell'esecuzione. In questo caso, `onlyOwner` può essere usato per limitare l'accesso, quindi **solo** il **proprietario** del contratto può eseguire questa funzione. Parleremo di più sui modificatori di funzione nel prossimo capitolo e su cosa faccia quello strano `_;`.
- parola chiave `indexed`: non preoccuparti di questo, non ne abbiamo ancora bisogno.

Quindi il contratto `di Proprietà` sostanzialmente fa quanto segue:

1. Quando viene creato un contratto, il suo costruttore imposta il `proprietario` su `msg.sender` (la persona che lo ha distribuito)

2. Aggiunge un modificatore `onlyOwner` che può limitare l'accesso a determinate funzioni solo al `proprietario`.

3. Ti consente di trasferire il contratto a un nuovo `proprietario`.

`onlyOwner` è un requisito così comune per i contratti che la maggior parte delle DApp di Solidity iniziano con un copia/incolla di questo contratto `Ownable`, quindi il loro primo contratto eredita da esso.

Dato che vogliamo limitare `setKittyContractAddress` a `onlyOwner`, faremo lo stesso per il nostro contratto.

## Facciamo una prova

Siamo andati avanti ed abbiamo copiato il codice del contratto `Ownable` in un nuovo file, `ownable.sol`. Andiamo ancora avanti e facciamo in modo che `ZombieFactory` erediti da esso.

1. Modifica il nostro codice per `importare` il contenuto di `ownable.sol`. Se non ricordi come farlo dai un'occhiata a `zombiefeeding.sol`.

2. Modifica il contratto `ZombieFactory` per ereditare da `Ownable`. Ancora una volta, puoi dare un'occhiata a `zombiefeeding.sol` se non ricordi come è fatto.
