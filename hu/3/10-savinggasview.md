---
title: Gáz megtakarítás 'View' függvényekkel
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          // Hozd létre a függvényedet itt

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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
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

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[] memory) {

        }

      }
---

Fantasztikus! Most már vannak speciális képességek a magasabb szintű zombiknak, hogy ösztönözzük a tulajdonosokat, hogy szintet lépjenek velük. Később hozzáadhatunk még többet, ha szeretnénk.

Adjunk hozzá még egy függvényt: a DApp-unknak szüksége van egy módszerre, hogy megtekintse egy felhasználó teljes zombiseregét — nevezzük el `getZombiesByOwner`-nek.

Ez a függvény csak olvasni fog adatokat a blockchainről, így `view` függvénnyé tehetjük. Ez elvezet egy fontos témához a gáz optimalizálásról:

## A View függvények nem kerülnek gázba

A `view` függvények nem kerülnek gázba, amikor egy felhasználó külsőleg hívja meg őket.

Ez azért van, mert a `view` függvények valójában nem változtatnak semmit a blockchainen – csak olvassák az adatokat. Tehát egy függvény `view`-val való jelölése azt mondja a `web3.js`-nek, hogy csak a helyi Ethereum csomópontodat kell lekérdeznie a függvény futtatásához, és nem kell ténylegesen tranzakciót létrehoznia a blockchainen (amelyet minden egyes csomópontnak futtatnia kellene, és gázba kerülne).

Később beszélünk a web3.js saját csomóponttal való beállításáról. De most a legfontosabb tanulság, hogy optimalizálhatod a DApp-od gáz használatát a felhasználóid számára, ha lehetőség szerint csak olvasható `external view` függvényeket használsz.

> Megjegyzés: Ha egy `view` függvényt belsőleg hívnak meg egy másik függvényből ugyanabban a szerződésben, amely **nem** `view` függvény, akkor még mindig gázba kerül. Ez azért van, mert a másik függvény tranzakciót hoz létre az Ethereumon, és még mindig minden csomópontnak ellenőriznie kell. Tehát a `view` függvények csak akkor ingyenesek, amikor külsőleg hívják meg őket.

## Tegyük próbára

Implementálunk egy függvényt, amely visszaadja egy felhasználó teljes zombiseregét. Később meghívhatjuk ezt a függvényt a `web3.js`-ből, ha szeretnénk megjeleníteni egy felhasználói profil oldalt a teljes sereggel.

Ennek a függvénynek a logikája egy kicsit bonyolult, így néhány fejezetbe telik az implementálása.

1. Hozz létre egy új `getZombiesByOwner` nevű függvényt. Egy argumentumot vesz: `_owner` (egy `address`).

2. Tegyük `external view` függvénnyé, hogy meghívhassuk a `web3.js`-ből gáz nélkül.

3. A függvény `uint[]`-t (egy `uint` tömböt) ad vissza `memory` adat helyként.

Hagyd üresen a függvény törzsét egyelőre, a következő fejezetben kitöltjük.
