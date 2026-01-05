---
title: Megjegyzések
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieownership.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombieattack.sol";
        import "./erc721.sol";
        import "./safemath.sol";

        /// TODO: Cseréld ki natspec leírásokra
        contract ZombieOwnership is ZombieAttack, ERC721 {

          using SafeMath for uint256;

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) external view returns (uint256) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) external view returns (address) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
            ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
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
            randNonce = randNonce.add(1);
            return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
          }

          function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            Zombie storage enemyZombie = zombies[_targetId];
            uint rand = randMod(100);
            if (rand <= attackVictoryProbability) {
              myZombie.winCount = myZombie.winCount.add(1);
              myZombie.level = myZombie.level.add(1);
              enemyZombie.lossCount = enemyZombie.lossCount.add(1);
              feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
            } else {
              myZombie.lossCount = myZombie.lossCount.add(1);
              enemyZombie.winCount = enemyZombie.winCount.add(1);
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
            zombies[_zombieId].level = zombies[_zombieId].level.add(1);
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
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";
        import "./safemath.sol";

        contract ZombieFactory is Ownable {

          using SafeMath for uint256;
          using SafeMath32 for uint32;
          using SafeMath16 for uint16;

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
            ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
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

        /**
         * @title SafeMath32
         * @dev SafeMath library implemented for uint32
         */
        library SafeMath32 {

          function mul(uint32 a, uint32 b) internal pure returns (uint32) {
            if (a == 0) {
              return 0;
            }
            uint32 c = a * b;
            assert(c / a == b);
            return c;
          }

          function div(uint32 a, uint32 b) internal pure returns (uint32) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint32 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          function sub(uint32 a, uint32 b) internal pure returns (uint32) {
            assert(b <= a);
            return a - b;
          }

          function add(uint32 a, uint32 b) internal pure returns (uint32) {
            uint32 c = a + b;
            assert(c >= a);
            return c;
          }
        }

        /**
         * @title SafeMath16
         * @dev SafeMath library implemented for uint16
         */
        library SafeMath16 {

          function mul(uint16 a, uint16 b) internal pure returns (uint16) {
            if (a == 0) {
              return 0;
            }
            uint16 c = a * b;
            assert(c / a == b);
            return c;
          }

          function div(uint16 a, uint16 b) internal pure returns (uint16) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint16 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          function sub(uint16 a, uint16 b) internal pure returns (uint16) {
            assert(b <= a);
            return a - b;
          }

          function add(uint16 a, uint16 b) internal pure returns (uint16) {
            uint16 c = a + b;
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

      import "./zombieattack.sol";
      import "./erc721.sol";
      import "./safemath.sol";

      contract ZombieOwnership is ZombieAttack, ERC721 {

        using SafeMath for uint256;

        mapping (uint => address) zombieApprovals;

        function balanceOf(address _owner) external view returns (uint256) {
          return ownerZombieCount[_owner];
        }

        function ownerOf(uint256 _tokenId) external view returns (address) {
          return zombieToOwner[_tokenId];
        }

        function _transfer(address _from, address _to, uint256 _tokenId) private {
          ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
          ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
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
---

A zombi játékunk Solidity kódja végre kész!

A következő leckékben megnézzük, hogyan lehet telepíteni a kódot az Ethereumra, és hogyan lehet interakcióba lépni vele Web3.js-szel.

De egy utolsó dolog, mielőtt elengedünk az 5. leckében: Beszéljünk a **kód megjegyzésekről**.

## Megjegyzések szintaxisa

A megjegyzések írása a Solidity-ben pontosan olyan, mint a JavaScript-ben. Már láttál néhány példát egy soros megjegyzésekre a CryptoZombies leckék során:

```
// Ez egy egy soros megjegyzés. Olyan, mint egy jegyzet magadnak (vagy másoknak)
```

Csak add hozzá a dupla `//`-t bárhová, és már kommentelsz. Olyan könnyű, hogy mindig csinálnod kellene.

De értem — néha egy sor nem elég. Végül is író születettél!

Így van több soros megjegyzésünk is:

```
contract CryptoZombies {
  /* Ez egy több soros megjegyzés. Szeretnék köszönetet mondani mindenkinek,
    aki időt szentelt ennek a programozási kurzusnak a kipróbálására.
    Tudom, hogy ingyenes mindenkinek, és ingyenes marad
    örökre, de mégis szívünket-lelkünket beletettük, hogy
    ezt a lehető legjobbra csináljuk.

    Tudd, hogy ez még mindig a Blockchain fejlesztés kezdete.
    Nagyon messzire jutottunk, de még sok módja van annak, hogy
    ezt a közösséget jobbá tegyük. Ha hibát követtünk el valahol, segíthetsz
    nekünk és nyithatsz egy pull request-et itt:
    https://github.com/loomnetwork/cryptozombie-lessons

    Vagy ha van néhány ötleted, megjegyzésed, vagy csak szeretnél
    köszönni - látogass el Telegram közösségünkhöz: https://t.me/loomnetworkdev
  */
}
```

Különösen jó gyakorlat megjegyzéseket írni a kódodhoz, hogy elmagyarázd minden függvény várt viselkedését a szerződésedben. Így egy másik fejlesztő (vagy te, 6 hónapos szünet után egy projekttől!) gyorsan át tudja nézni és megérteni magas szinten, mit csinál a kódod anélkül, hogy el kellene olvasnia magát a kódot.

A Solidity közösségben a szabvány egy **_natspec_** nevű formátum használata, amely így néz ki:

```
/// @title Egy szerződés alapvető matematikai műveletekhez
/// @author H4XF13LD MORRIS 💯💯😎💯💯
/// @notice Egyelőre ez a szerződés csak egy szorzó függvényt ad hozzá
contract Math {
  /// @notice Összeszoroz 2 számot
  /// @param x az első uint.
  /// @param y a második uint.
  /// @return z az (x * y) szorzata
  /// @dev Ez a függvény jelenleg nem ellenőrzi az overflow-okat
  function multiply(uint x, uint y) returns (uint z) {
    // Ez csak egy normál megjegyzés, és nem lesz felismerve a natspec által
    z = x * y;
  }
}
```

Az `@title` és `@author` egyértelmű.

Az `@notice` elmagyarázza egy **felhasználónak**, mit csinál a szerződés / függvény. Az `@dev` extra részleteket magyaráz el fejlesztőknek.

Az `@param` és `@return` arra szolgálnak, hogy leírják, mire való minden paraméter és visszatérési érték egy függvényben.

Vegyük észre, hogy nem mindig kell minden tagot használnod minden függvényhez — minden tag opcionális. De legalább hagyj egy `@dev` megjegyzést, amely elmagyarázza, mit csinál minden függvény.

# Tedd próbára

Ha még nem vetted észre, a CryptoZombies válasz-ellenőrző figyelmen kívül hagyja a megjegyzéseket, amikor ellenőrzi a válaszaidat. Szóval valójában nem tudjuk ellenőrizni a natspec kódodat ebben a fejezetben ;)

Azonban most már egy Solidity zseni vagy — csak feltételezzük, hogy megvan benned!

Próbáld ki úgyis, és próbálj hozzáadni néhány natspec taget a `ZombieOwnership`-hez:

1. `@title` — Pl. Egy szerződés, amely kezeli a zombi tulajdonjog átadását

2. `@author` — A neved!

3. `@dev` — Pl. Kompatibilis az OpenZeppelin ERC721 specifikáció draft implementációjával
