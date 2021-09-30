---
title: Prevenire gli Overflow
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

        import "./ownable.sol";
        // 1. Importa qui

        contract ZombieFactory is Ownable {

          // 2. Dichiara di utilizzare safemath qui

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
      "zombieownership.sol": |
        pragma solidity ^0.4.25;

        import "./zombieattack.sol";
        import "./erc721.sol";

        contract ZombieOwnership is ZombieAttack, ERC721 {

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) external view returns (uint256) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) external view returns (address) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to]++;
            ownerZombieCount[_from]--;
            zombieToOwner[_tokenId] = _to;
            emit Transfer(_from, _to, _tokenId);
          }

          function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
            require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
            _transfer(_from, _to, _tokenId);
          }

          function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _approved;
            emit Approval(msg.sender, _approved, _tokenId);
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

          function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
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

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
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

          modifier onlyOwnerOf(uint _zombieId) {
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

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal onlyOwnerOf(_zombieId) {
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
      "safemath.sol": |
        pragma solidity ^0.4.25;

        /**
         * @title SafeMath
         * @dev Math operations with safety checks that throw on error
         */
        library SafeMath {

          /**
          * @dev Multiplies two numbers, throws on overflow.
          */
          function mul(uint256 a, uint256 b) internal pure returns (uint256) {
            if (a == 0) {
              return 0;
            }
            uint256 c = a * b;
            assert(c / a == b);
            return c;
          }

          /**
          * @dev Integer division of two numbers, truncating the quotient.
          */
          function div(uint256 a, uint256 b) internal pure returns (uint256) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint256 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          /**
          * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
          */
          function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            assert(b <= a);
            return a - b;
          }

          /**
          * @dev Adds two numbers, throws on overflow.
          */
          function add(uint256 a, uint256 b) internal pure returns (uint256) {
            uint256 c = a + b;
            assert(c >= a);
            return c;
          }
        }
      "erc721.sol": |
        pragma solidity ^0.4.25;

        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

          function balanceOf(address _owner) external view returns (uint256);
          function ownerOf(uint256 _tokenId) external view returns (address);
          function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
          function approve(address _approved, uint256 _tokenId) external payable;
        }
    answer: |
      pragma solidity ^0.4.25;

      import "./ownable.sol";
      import "./safemath.sol";

      contract ZombieFactory is Ownable {

        using SafeMath for uint256;

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

Congratulazioni, questo completa la nostra implementazione ERC721 ed ERC721x!

Non è stato così difficile, vero? Molte di queste cose di Ethereum sembrano davvero complicate quando senti le persone parlarne, quindi il modo migliore per capirlo è in realtà implementarlo da solo.

Tieni presente che questa è solo un'implementazione minima. Ci sono funzionalità extra che potremmo voler aggiungere alla nostra implementazione, come alcuni controlli extra per assicurarci che gli utenti non trasferiscano accidentalmente i loro zombi ad un indirizzo `0` (che si chiama "bruciare" un token — in pratica viene inviato ad un indirizzo di cui nessuno ha la chiave privata, rendendolo sostanzialmente irrecuperabile). O per mettere un po' di logica nell'asta di base nella DApp stessa. (Riesci a pensare ad alcuni modi in cui potremmo implementarlo?)

Volevamo mantenere questa lezione gestibile, quindi siamo andati con l'implementazione più elementare. Se vuoi vedere un esempio di un'implementazione più approfondita, puoi dare un'occhiata al contratto OpenZeppelin ERC721 dopo questo tutorial.

### Miglioramenti della sicurezza del contratto: overflow e underflow

Esamineremo una delle principali funzionalità di sicurezza di cui dovresti essere a conoscenza quando scrivi contratti intelligenti: prevenire overflow e underflow.

Che cosa è un **_overflow_**?

Diciamo che abbiamo un `uint8`, che può avere solo 8 bit. Ciò significa che il numero più grande che possiamo memorizzare è il binario `11111111` (o in decimale, 2^8 - 1 = 255).

Dai un'occhiata al seguente codice. Quanto è il valore di `number` alla fine?

```
uint8 number = 255;
number++;
```

In questo caso, lo abbiamo fatto andare in overflow — quindi `number` è controintuitivamente ora uguale a `0` anche se lo abbiamo aumentato. (Se aggiungi 1 al binario `11111111`, si reimposta su` 00000000`, come un orologio che va da `23:59` a `00:00`).

L'underflow è simile, dove se sottrai `1` da un `uint8` che equivale a `0`, ora sarà uguale a `255` (perché `uint`s non è firmato e non può essere negativo).

Anche se non stiamo usando `uint8` qui, e sembra improbabile che un `uint256` trabocchi quando aumenta di `1` ogni volta (2^256 è un numero davvero grande), è comunque bene mettere protezioni nel nostro contratto in modo che la nostra DApp non abbia mai comportamenti imprevisti in futuro.

### Uso di SafeMath

Per evitare questo, OpenZeppelin ha creato una **_libreria_** chiamata SafeMath che previene questi problemi.

Ma prima di entrare nel dettaglio... Cos'è una libreria?

Una **_libreria_** è un tipo speciale di contratto in Solidity. Una delle cose per cui è utile è che collega le sue funzioni a tipi di dati nativi.

Ad esempio, con la libreria SafeMath, useremo la sintassi `using SafeMath for uint256`. La libreria SafeMath ha 4 funzioni: `add`, `sub`, `mul` e `div`. E ora possiamo accedere a queste funzioni da `uint256` come segue:

```
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```

Vedremo cosa fanno queste funzioni nel prossimo capitolo, ma per ora aggiungiamo la libreria SafeMath al nostro contratto.

## Facciamo una prova

Abbiamo già incluso la libreria `SafeMath` di OpenZeppelin per te in `safemath.sol`. Puoi dare ora una rapida occhiata al codice se vuoi, ma lo vedremo in dettaglio nel prossimo capitolo.

Prima diciamo al nostro contratto di usare SafeMath. Lo faremo in ZombieFactory, il nostro contratto di base — in questo modo possiamo usarlo in qualsiasi sotto-contratto che eredita da questo.

1. Importa `safemath.sol` dentro `zombiefactory.sol`.

2. Aggiungi la dichiarazione `using SafeMath for uint256;`.
