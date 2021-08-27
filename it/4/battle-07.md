---
title: Lo Zombi Vince e Perde
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
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
              // 1. Aggiungi nuove proprietà qui
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                // 2. Modifica qui la nuova creazione di uno zombi:
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
      "zombieattack.sol": |
        pragma solidity ^0.4.25;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          uint randNonce = 0;
          uint attackVictoryProbability = 70;

          function randMod(uint _modulus) internal returns(uint) {
            randNonce++;
            return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
          }

          function attack(uint _zombieId, uint _targetId) external ownerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            Zombie storage enemyZombie = zombies[_targetId];
            uint rand = randMod(100);
          }
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

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) ownerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) ownerOf(_zombieId) {
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

          modifier ownerOf(uint _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            _;
          }

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal ownerOf(_zombieId) {
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
            uint16 winCount;
            uint16 lossCount;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) internal {
              uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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

Per il nostro gioco di zombi, vorremmo tenere traccia di quante battaglie i nostri zombi hanno vinto e perso. In questo modo potremmo avere una "classifica degli zombi" nel nostro gioco.

Potremmo archiviare questi dati in diversi modi nella nostra DApp — come mappature individuali, come una classifica o nella stessa struttura `Zombie`.

Ognuno ha i suoi vantaggi e compromessi a seconda di come intendiamo interagire con i dati. In questo tutorial, memorizzeremo le statistiche sulla nostra struttura `Zombie` per semplicità e le chiameremo `winCount` e `lossCount`.

Quindi torniamo a `zombiefactory.sol` ed aggiungiamo queste proprietà alla nostra struttura `Zombie`.

## Facciamo una prova

1. Modifica la nostra struttura `Zombie` per avere altre 2 proprietà:

  a. `winCount`, un `uint16`

  b. `lossCount`, sempre un `uint16`

  >Nota: ricorda, dal momento che possiamo impacchettare `uint`s all'interno di strutture, vogliamo usare gli `uint`s più piccoli con cui possiamo cavarcela. Un `uint8` è troppo piccolo, poiché 2^8 = 256 — se i nostri zombi attaccassero una volta al giorno, potrebbero arrivare al limite entro un anno. Ma 2^16 è 65536 — quindi a meno che un utente non vinca o perda ogni giorno per 179 anni consecutivi, dovremmo essere al sicuro.

2. Ora che abbiamo nuove proprietà sulla nostra struttura `Zombie`, dobbiamo cambiare la nostra definizione della funzione `_createZombie()`.

  Cambia la definizione di creazione degli zombi in modo che crei ogni nuovo zombi con vincite `0` e sconfitte `0`.
