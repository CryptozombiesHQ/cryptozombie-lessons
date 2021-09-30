---
title: Conto alla rovescia per gli Zombi
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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          // 1. Definisci qui la funzione `_triggerCooldown`

          // 2. Definisci qui la funzione `_isReady`

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

Ora che abbiamo una proprietà `readyTime` sulla nostra struttura `Zombie`, passiamola a `zombiefeeding.sol` ed implementiamo un timer di ricarica.

Modificheremo il nostro `feedAndMultiply` in modo tale che:

1. L'alimentazione inneschi il tempo di recupero di uno zombi e

2. Gli zombi non potranno nutrirsi di gattini fino al termine del tempo di recupero

Questo farà in modo che gli zombi non potranno nutrirsi illimitatamente di gattini e quindi moltiplicarsi tutto il giorno. In futuro, quando aggiungeremo la funzionalità di battaglia, faremo in modo che anche attaccare gli altri zombi si basi sul tempo di recupero.

Innanzitutto definiremo alcune funzioni di aiuto che ci consentono di impostare e controllare il `readyTime` di uno zombi.

## Passando le strutture come argomenti

È possibile passare un puntatore di archiviazione ad una struttura come argomento di una funzione `private` o `internal`. Ciò è utile, ad esempio, per passare le nostre strutture `Zombie` tra le funzioni.

La sintassi è simile alla seguente:

```
function _doStuff(Zombie storage _zombie) internal {
  // fai qualcosa con _zombie
}
```

In questo modo possiamo passare un riferimento al nostro zombi in una funzione invece di passare un ID zombi e cercarlo.

## Facciamo una prova

1. Inizia definendo la funzione `_triggerCooldown`. Ci vorrà 1 argomento, `_zombie`, un puntatore `Zombie storage`. La funzione dovrebbe essere `internal`.

2. Il corpo della funzione dovrebbe settare `_zombie.readyTime` su `uint32(now + cooldownTime)`.

3. Quindi crea una funzione chiamata `_isReady`. Questa funzione prenderà anche un argomento `Zombie storage` chiamato `_zombie`. Sarà una funzione `internal view` e restituirà un `bool`.

4. Il corpo della funzione dovrebbe restituire `(_zombie.readyTime <= now)`, che sarà `true` o `false`. Questa funzione ci dirà se è trascorso abbastanza tempo dall'ultima volta che lo zombi si è nutrito.
