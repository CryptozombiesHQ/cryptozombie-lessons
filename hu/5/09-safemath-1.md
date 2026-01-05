---
title: Overflow-ok megelőzése
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";
        // 1. Import itt

        contract ZombieFactory is Ownable {

          // 2. Deklaráld a safemath használatát itt

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
      "zombieownership.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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
        pragma solidity >=0.5.0 <0.6.0;

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

          function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
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

          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal onlyOwnerOf(_zombieId) {
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
      "safemath.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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
        pragma solidity >=0.5.0 <0.6.0;

        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

          function balanceOf(address _owner) external view returns (uint256);
          function ownerOf(uint256 _tokenId) external view returns (address);
          function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
          function approve(address _approved, uint256 _tokenId) external payable;
        }
    answer: |
      pragma solidity >=0.5.0 <0.6.0;

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
---

Gratulálok, ez befejezi az ERC721 és ERC721x implementációt!

Nem volt olyan nehéz, ugye? Sok Ethereum dolog nagyon bonyolultnak tűnik, amikor hallod az embereket róla beszélni, szóval a legjobb módja annak, hogy megértsd, ha ténylegesen végigmész egy implementáción.

Tartsd észben, hogy ez csak egy minimális implementáció. Vannak extra funkciók, amelyeket hozzáadhatnánk az implementációnkhoz, például néhány extra ellenőrzés, hogy biztosítsuk, a felhasználók véletlenül ne adják át a zombijaikat a `0` címre (ezt "burning"-nek hívják egy token esetében — alapvetően egy olyan címre küldik, amelynek senkinek sincs privát kulcsa, lényegében helyrehozhatatlanná téve). Vagy hogy néhány alapvető árverési logikát tegyünk a DApp-be. (Tudsz gondolni néhány módszerre, hogyan implementálhatnánk ezt?)

De szerettük volna ezt a leckét kezelhető méretben tartani, szóval a legalapvetőbb implementációval mentünk. Ha szeretnél látni egy példát egy mélyebb implementációra, megnézheted az OpenZeppelin ERC721 szerződését ezen oktatóanyag után.

### Szerződés biztonsági fejlesztések: Overflow-ok és Underflow-ok

Megnézünk egy fontos biztonsági funkciót, amelyről tudnod kell, amikor okosszerződéseket írsz: Az overflow-ok és underflow-ok megelőzése.

Mi az **_overflow_**?

Tegyük fel, van egy `uint8`-unk, amely csak 8 bitet tud tárolni. Ez azt jelenti, hogy a legnagyobb szám, amit tárolhatunk, a bináris `11111111` (vagy decimálisan, 2^8 - 1 = 255).

Nézd meg a következő kódot. Mi lesz a `number` értéke a végén?

```
uint8 number = 255;
number++;
```

Ebben az esetben overflow-t okoztunk — szóval a `number` ellentmondásos módon most `0` lesz, annak ellenére, hogy növeltük. (Ha hozzáadsz 1-et a bináris `11111111`-hez, visszaáll `00000000`-ra, mint egy óra, amely `23:59`-ről `00:00`-ra megy).

Az underflow hasonló, ahol ha kivonsz `1`-et egy `uint8`-ból, amely egyenlő `0`-val, most `255` lesz (mert a `uint`-ok előjel nélküliek, és nem lehetnek negatívak).

Bár itt nem használunk `uint8`-at, és valószínűtlen, hogy egy `uint256` overflow-t okozzon, amikor `1`-gyel növeljük minden alkalommal (2^256 egy nagyon nagy szám), mégis jó védelembe tenni a szerződésünket, hogy a DApp-ünk soha ne legyen váratlan viselkedése a jövőben.

### SafeMath használata

Ennek megelőzésére az OpenZeppelin létrehozott egy **_library_**-t SafeMath néven, amely alapértelmezetten megelőzi ezeket a problémákat.

De mielőtt belemerülnénk... Mi az a library?

Egy **_library_** egy speciális típusú szerződés a Solidity-ben. Az egyik dolog, amire hasznos, hogy függvényeket csatolhatunk natív adattípusokhoz.

Például a SafeMath library-vel a `using SafeMath for uint256;` szintaxist használjuk. A SafeMath library-nek 4 függvénye van — `add`, `sub`, `mul`, és `div`. És most ezeket a függvényeket a `uint256`-ból így érhetjük el:

```
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```

A következő fejezetben megnézzük, mit csinálnak ezek a függvények, de most adjuk hozzá a SafeMath library-t a szerződésünkhöz.

## Tedd próbára

Már beillesztettük az OpenZeppelin `SafeMath` library-ját neked a `safemath.sol`-ban. Gyorsan megnézheted a kódot most, ha szeretnéd, de részletesen a következő fejezetben fogjuk megnézni.

Először mondjuk meg a szerződésünknek, hogy használja a SafeMath-ot. Ezt a ZombieFactory-ban fogjuk megtenni, a legalapvetőbb szerződésünkben — így használhatjuk bármelyik al-szerződésben, amely ebből örököl.

1. Importáld a `safemath.sol`-t a `zombiefactory.sol`-ba.

2. Add hozzá a `using SafeMath for uint256;` deklarációt.
