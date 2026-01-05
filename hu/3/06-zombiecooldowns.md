---
title: Zombi cooldown-ok
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          // 1. Definiáld a `_triggerCooldown` függvényt itt

          // 2. Definiáld a `_isReady` függvényt itt

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
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string memory _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
    answer: >
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

        function setKittyContractAddress(address _address) external onlyOwner {
          kittyContract = KittyInterface(_address);
        }

        function _triggerCooldown(Zombie storage _zombie) internal {
          _zombie.readyTime = uint32(now + cooldownTime);
        }

        function _isReady(Zombie storage _zombie) internal view returns (bool) {
            return (_zombie.readyTime <= now);
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
---

Most, hogy van egy `readyTime` tulajdonságunk a `Zombie` struktúránkon, ugorjunk a `zombiefeeding.sol`-ra, és valósítsunk meg egy visszaszámláló időzítőt.

Módosítani fogjuk a `feedAndMultiply` függvényünket úgy, hogy:

1. Az etetés elindítja a zombi visszaszámlálását, és

2. A zombik nem etethetnek cicákon, amíg a visszaszámlálási időszakuk el nem telt.

Ezáltal a zombik nem tudnak korlátlanul cicákon etetni és egész nap szaporodni. A jövőben, amikor hozzáadjuk a harci funkcionalitást, a támadás is a visszaszámlálásra fog támaszkodni.

Először is definiálunk néhány segédfüggvényt, amelyek lehetővé teszik számunkra, hogy beállítsuk és ellenőrizzük egy zombi `readyTime` értékét.

## Struktúrák átadása argumentumként

Egy struktúra tárolási mutatóját átadhatod argumentumként egy `private` vagy `internal` függvénynek. Ez hasznos például a `Zombie` struktúráink függvények közötti átadására.

A szintaxis így néz ki:

```
function _doStuff(Zombie storage _zombie) internal {
  // do stuff with _zombie
}
```

Így a zombinkra mutató referenciát adhatunk át egy függvénynek, ahelyett, hogy egy zombi ID-t adnánk át és megkeresnénk azt.

## Tedd próbára

1. Kezdj egy `_triggerCooldown` függvény definiálásával. Egy argumentumot vesz, `_zombie`, egy `Zombie storage` mutató. A függvény `internal` legyen.

2. A függvény törzse beállítja a `_zombie.readyTime`-ot `uint32(now + cooldownTime)`-ra.

3. Ezután hozz létre egy `_isReady` nevű függvényt. Ez a függvény szintén egy `Zombie storage` argumentumot vesz `_zombie` néven. `internal view` függvény legyen, és `bool`-t adjon vissza.

4. A függvény törzse visszaadja a `(_zombie.readyTime <= now)` értéket, amely `true` vagy `false` lesz. Ez a függvény megmondja, hogy eltelt-e elég idő az utolsó etetés óta.
