---
title: I token su Ethereum
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieownership.sol": |
        // Start here
      "zombieattack.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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
            if (rand <= attackVictoryProbability) {
              myZombie.winCount++;
              myZombie.level++;
              enemyZombie.lossCount++;
              feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
            } else {
              myZombie.lossCount++;
              enemyZombie.winCount++;
              _triggerCooldown(myZombie);
            }
          }
        }

      "zombiehelper.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

          function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) ownerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) ownerOf(_zombieId) {
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
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
        pragma solidity >=0.5.0 <0.6.0;

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

          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal ownerOf(_zombieId) {
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
        pragma solidity >=0.5.0 <0.6.0;

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

            function _createZombie(string memory _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string memory _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createRandomZombie(string memory _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }

      "ownable.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        /**
        * @title Ownable
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
          address private _owner;

          event OwnershipTransferred(
            address indexed previousOwner,
            address indexed newOwner
          );

          /**
          * @dev The Ownable constructor sets the original `owner` of the contract to the sender
          * account.
          */
          constructor() internal {
            _owner = msg.sender;
            emit OwnershipTransferred(address(0), _owner);
          }

          /**
          * @return the address of the owner.
          */
          function owner() public view returns(address) {
            return _owner;
          }

          /**
          * @dev Throws if called by any account other than the owner.
          */
          modifier onlyOwner() {
            require(isOwner());
            _;
          }

          /**
          * @return true if `msg.sender` is the owner of the contract.
          */
          function isOwner() public view returns(bool) {
            return msg.sender == _owner;
          }

          /**
          * @dev Allows the current owner to relinquish control of the contract.
          * @notice Renouncing to ownership will leave the contract without an owner.
          * It will not be possible to call the functions with the `onlyOwner`
          * modifier anymore.
          */
          function renounceOwnership() public onlyOwner {
            emit OwnershipTransferred(_owner, address(0));
            _owner = address(0);
          }

          /**
          * @dev Allows the current owner to transfer control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function transferOwnership(address newOwner) public onlyOwner {
            _transferOwnership(newOwner);
          }

          /**
          * @dev Transfers control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function _transferOwnership(address newOwner) internal {
            require(newOwner != address(0));
            emit OwnershipTransferred(_owner, newOwner);
            _owner = newOwner;
          }
        }

    answer: |
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombieattack.sol";

      contract ZombieOwnership is ZombieAttack {

      }
---

Parliamo di **_token_**.

Se conosci il mondo di Ethereum probabilmente hai sentito molte persone parlare di token —  in particolare del tipo di **_token ERC20_**.

Un **_token_** in Ethereum è fondamentalmente uno smart contract che segue alcune regole comuni — cioè contiene un insieme di funzioni standard che tutti gli altri token condividono, come `transferFrom(address _from, address _to, uint256 _amount)` e `balanceOf(address _owner)`.

Solitamente all'interno dello smart contract è contenuta una mappatura, `mapping(address => uint256) balances`, che tiene traccia del bilancio di ogni indirizzo.

Quindi fondamentalmente un token è un contratto che tiene traccia di chi e di quanto possiede, includendo alcune funzioni aggiuntive in modo che gli utenti possano trasferire i loro token ad altri indirizzi.

### Perché è importante?

Perchè tutti i token ERC20 condividono lo stesso insieme di funzioni con gli stessi nomi e possono quindi interagire tutti nello stesso modo.

Questo significa che se costruisci un'applicazione che è in grado di interagire con uno specifico token ERC20, è anche in grado di interagire con qualsiasi altro token ERC20. In questo modo altri token possono essere facilmente aggiunti alla tua applicazione in futuro senza bisogno di essere sviluppati su misura. Basterà semplicemente inserire l'indirizzo del nuovo contratto che rappresenta il token, e boom, la tua app potrà utilizzare un nuovo token.

Un esempio classico potrebbe essere quello di un exchange. Quando un exchange aggiunge un nuovo token ERC20 ha solo bisogno di aggiungere un altro contratto intelligente con cui dialogare. Gli utenti possono dire a quel determinato contratto di inviare token all'indirizzo del portafoglio dell' exchange, e l' exchange può dire al contratto di inviare i token indietro agli utenti quando richiedono un prelievo.

L' exchange ha solo bisogno di implementare questa logica di trasferimento una singola volta, e quando vorrà aggiungere un nuovo token ERC20, dovrà semplicemente aggiungere il nuovo indirizzo del contratto al suo database.

### Altri standard di token

I token ERC20 sono davvero interessanti quando devono rappresentare uno scambio di valore, al pari di una valuta. Non sono però particolarmente adatti per rappresentare zombie nel nostro gioco di zombie.

In primis, gli zombie non sono divisibili come le valute — io posso inviarti 0.237 ETH, ma inviarti 0.237 di zombie non avrebbe alcun senso logico.

Secondo, tutti gli zombie non sono creati equamente. Il tuo zombie di Livello 2 "**Steve**" è differente dal mio zombie "**H4XF13LD MORRIS 💯💯😎💯💯**" di Livello 732, che avrà altre proprietà e caratteristiche.

C'è un altro standard di token che è molto più adatto ai crypto-collectibles come CryptoZombies — e si chiamano **_ERC721 tokens._**

I **_token ERC721_** non **sono** intercambiabili e in alcun modo divisibili. Questo presuppone che ognuno di loro sia unico. Si possono scambiare solo su unità intere e ciascun token ha un unico ID. Questo è lo standard di token perfetto per rendere scambiabili i nostri zombie.

> Nota che usare uno standard come ERC721 ha un vantaggio. Non dobbiamo implementare la logica dell'asta o dell'escrow all'interno del nostro contratto che determina come i giocatori possono scambiare / vendere i nostri zombie. Se ci conformiamo alle specifiche standard, qualcun altro potrebbe costruire una piattaforma di scambio per beni cripto-tradable ERC721, e i nostri zombie ERC721 sarebbero utilizzabili su quella piattaforma. Quindi ci sono chiari vantaggi nell'usare uno standard di token invece di creare la propria logica di scambio.

## Mettiti alla prova

Ci immergeremo nell'implementazione dell'ERC721 nel prossimo capitolo. Ma prima, impostiamo la nostra struttura di file per questa lezione.

Includeremo tutta la logica ERC721 in un contratto chiamato `ZombieOwnership`.

1. Dichiara la versione di `pragma` all' inizio del file (puoi controllare i file delle lezioni precedenti per la sintassi).

2. Questo file dovrebbe contenere la variabile `import` da `zombieattack.sol`.

3. Dichiarare un nuovo contratto, `ZombieOwnership`, che eredita da `ZombieAttack`. Lascia il corpo del contratto vuoto per ora.
