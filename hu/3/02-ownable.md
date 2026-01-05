---
title: Ownable szerződések
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        // 1. Import itt

        // 2. Örökölj itt:
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

            function _createZombie(string memory _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
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

          function setKittyContractAddress(address _address) external {
            kittyContract = KittyInterface(_address);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
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
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

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

          function _createZombie(string memory _name, uint _dna) internal {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
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

Észrevetted a biztonsági rést az előző fejezetben?

A `setKittyContractAddress` `external`, tehát bárki meghívhatja! Ez azt jelenti, hogy bárki, aki meghívta a függvényt, megváltoztathatná a CryptoKitties szerződés címét, és tönkretenné az alkalmazásunkat az összes felhasználó számára.

Szeretnénk, hogy legyen lehetőség frissíteni ezt a címet a szerződésünkben, de nem szeretnénk, hogy mindenki frissíthesse.

Az ilyen esetek kezelésére egy gyakori gyakorlat, hogy a szerződéseket `Ownable`-té teszik — ami azt jelenti, hogy van egy tulajdonosuk (te), akinek speciális jogosultságai vannak.

## Az OpenZeppelin `Ownable` szerződése

Az alábbi az `Ownable` szerződés az **_OpenZeppelin_** Solidity könyvtárból. Az OpenZeppelin egy biztonságos és közösség által ellenőrzött okos szerződések könyvtára, amelyet használhatsz a saját DApp-jaidban. Ezen lecke után erősen ajánljuk, hogy nézd meg az oldalukat a további tanuláshoz!

Olvasd át az alábbi szerződést. Látni fogsz néhány dolgot, amit még nem tanultunk, de ne aggódj, később beszélünk róluk.

```
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
```

Néhány új dolog, amit még nem láttunk:

- Konstruktorok: A `constructor()` egy **_konstruktor_**, amely egy opcionális speciális függvény. Csak egyszer hajtódik végre, amikor a szerződést először létrehozzák.
- Függvény módosítók: `modifier onlyOwner()`. A módosítók olyan fél-függvények, amelyek más függvények módosítására szolgálnak, általában néhány követelmény ellenőrzésére a végrehajtás előtt. Ebben az esetben az `onlyOwner` használható a hozzáférés korlátozására, hogy **csak** a szerződés **tulajdonosa** futtathassa ezt a függvényt. A következő fejezetben többet beszélünk a függvény módosítókról, és arról, hogy mit csinál az a furcsa `_;`.
- `indexed` kulcsszó: ne aggódj emiatt, még nincs rá szükségünk.

Tehát az `Ownable` szerződés alapvetően a következőket csinálja:

1. Amikor egy szerződést létrehoznak, a konstruktora beállítja a `owner`-t `msg.sender`-re (az, aki telepítette)

2. Hozzáad egy `onlyOwner` módosítót, amely korlátozhatja a hozzáférést bizonyos függvényekhez, hogy csak a `owner` férjen hozzá

3. Lehetővé teszi, hogy átruházd a szerződést egy új `owner`-re

Az `onlyOwner` olyan gyakori követelmény a szerződéseknél, hogy a legtöbb Solidity DApp ezzel az `Ownable` szerződéssel kezdődik, és az első szerződésük örökli tőle.

Mivel szeretnénk korlátozni a `setKittyContractAddress`-t `onlyOwner`-re, ugyanezt tesszük a szerződésünkkel is.

## Tegyük próbára

Előrehaladtunk és bemásoltuk az `Ownable` szerződés kódját egy új fájlba, `ownable.sol`-ba. Haladjunk tovább, és tegyük, hogy a `ZombieFactory` örököljön tőle.

1. Módosítsd a kódunkat, hogy `import`-álja az `ownable.sol` tartalmát. Ha nem emlékszel, hogyan kell ezt csinálni, nézd meg a `zombiefeeding.sol`-t.

2. Módosítsd a `ZombieFactory` szerződést, hogy örököljön az `Ownable`-ból. Ismét, megnézheted a `zombiefeeding.sol`-t, ha nem emlékszel, hogyan kell ezt csinálni.
