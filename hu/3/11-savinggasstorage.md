---
title: A tárolás drága
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

          function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
            // Kezdj itt
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
          uint[] memory result = new uint[](ownerZombieCount[_owner]);

          return result;
        }

      }
---

A Solidity egyik drágább művelete a `storage` használata — különösen az írások.

Ez azért van, mert minden alkalommal, amikor írsz vagy változtatsz egy adatot, az véglegesen a blockchainre íródik. Örökre! Több ezer csomópontnak a világon tárolnia kell ezt az adatot a merevlemezeiken, és ez az adatmennyiség idővel növekszik, ahogy a blockchain növekszik. Tehát van költsége ennek.

A költségek alacsonyan tartása érdekében kerülni kell az adatok tárolóba írását, kivéve, ha abszolút szükséges. Néha ez látszólag hatékonytalan programozási logikát jelent — mint például egy tömb újraépítése `memory`-ban minden alkalommal, amikor egy függvény meghívódik, ahelyett, hogy egyszerűen elmentenénk azt a tömböt egy változóban a gyors kereséshez.

A legtöbb programozási nyelvben a nagy adathalmazokon való iterálás drága. De a Solidity-ben ez sokkal olcsóbb, mint a `storage` használata, ha egy `external view` függvényben van, mivel a `view` függvények nem kerülnek gázba a felhasználóidnak. (És a gáz valódi pénzbe kerül a felhasználóidnak!).

A következő fejezetben áttekintjük a `for` ciklusokat, de először nézzük meg, hogyan kell tömböket deklarálni a memóriában.

## Tömbök deklarációja a memóriában

Használhatod a `memory` kulcsszót tömbökkel, hogy új tömböt hozz létre egy függvényen belül anélkül, hogy bármit is írnál a tárolóba. A tömb csak a függvény hívás végéig létezik, és ez sokkal olcsóbb gáz szempontjából, mint egy tömb frissítése a `storage`-ban — ingyenes, ha egy külsőleg hívott `view` függvény.

Íme, hogyan kell egy tömböt deklarálni a memóriában:

```
function getArray() external pure returns(uint[] memory) {
  // Példányosíts egy új tömböt a memóriában 3 hosszúsággal
  uint[] memory values = new uint[](3);

  // Adj hozzá néhány értéket
  values[0] = 1;
  values[1] = 2;
  values[2] = 3;

  return values;
}
```

Ez egy triviális példa csak a szintaxis bemutatásához, de a következő fejezetben megnézzük, hogyan kombináljuk ezt `for` ciklusokkal valós használati esetekhez.

>Megjegyzés: A memória tömbök **kötelezően** hosszúság argumentummal kell létrehozni (ebben a példában `3`). Jelenleg nem lehet átméretezni őket, mint a tároló tömböket `array.push()`-szal, bár ez változhat a Solidity jövőbeli verziójában.

## Tegyük próbára

A `getZombiesByOwner` függvényünkben szeretnénk visszaadni egy `uint[]` tömböt az összes zombival, amelyeket egy adott felhasználó birtokol.

1. Deklarálj egy `result` nevű `uint[] memory` változót

2. Állítsd be egy új `uint` tömbnek. A tömb hossza az legyen, hogy hány zombit birtokol ez a `_owner`, amit a `mapping`-ból nézhetünk ki: `ownerZombieCount[_owner]`.

3. A függvény végén add vissza a `result`-ot. Most még csak egy üres tömb, de a következő fejezetben kitöltjük.
