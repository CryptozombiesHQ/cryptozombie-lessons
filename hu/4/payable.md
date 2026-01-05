---
title: Payable
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

          // 1. Definiáld a levelUpFee-t itt

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Helyezd be a levelUp függvényt ide

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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
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

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
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
---

Eddig elég sok **_függvénymódosítót_** vettünk át. Nehéz lehet mindent megjegyezni, ezért nézzünk át egy gyors áttekintést:

1. Láthatósági módosítók vannak, amelyek szabályozzák, hogy mikor és honnan hívható meg a függvény: a `private` azt jelenti, hogy csak a szerződés más függvényeiből hívható meg; az `internal` olyan, mint a `private`, de az örökölt szerződések is meghívhatják; az `external` csak a szerződésen kívülről hívható meg; végül a `public` bárhonnan hívható, mind belsőleg, mind külsőleg.

2. Vannak állapot módosítók is, amelyek megmondják, hogy a függvény hogyan lép kapcsolatba a blokklánccal: a `view` azt mondja, hogy a függvény futtatásával nem lesz mentve/változtatva adat. A `pure` azt mondja, hogy a függvény nem csak nem ment adatot a blokkláncra, hanem nem is olvas adatot a blokkláncról. Mindkettő ingyenes, ha külsőleg hívják meg a szerződésen kívülről (de gázba kerül, ha belsőleg hívja meg egy másik függvény).

3. Aztán vannak egyedi `modifier`-ek, amelyekről a 3. leckében tanultunk: például az `onlyOwner` és az `aboveLevel`. Ezeknél egyedi logikát definiálhatunk, hogy meghatározzuk, hogyan befolyásolják a függvényt.

Ezek a módosítók mind összeállíthatók egy függvénydefinícióban, így:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

Ebben a fejezetben bemutatunk még egy függvénymódosítót: a `payable`-t.

## A `payable` módosító

A `payable` függvények azok, amelyek a Solidity-t és az Ethereumot ilyen menővé teszik — ezek egy speciális típusú függvények, amelyek Ethert fogadhatnak.

Gondolj bele egy percig. Amikor egy normál webszerveren hívsz egy API függvényt, nem küldhetsz amerikai dollárt a függvényhívással együtt — és Bitcoin-t sem.

De az Ethereumon, mivel a pénz (_Ether_), az adatok (*tranzakció payload*) és maga a szerződés kódja mind az Ethereumon élnek, lehetséges, hogy egy függvényt hívsz **_és_** egyúttal pénzt fizetsz a szerződésnek.

Ez lehetővé tesz néhány igazán érdekes logikát, például egy bizonyos fizetés megkövetelését a szerződésnek a függvény végrehajtásához.

## Nézzünk egy példát

```
contract OnlineStore {
  function buySomething() external payable {
    // Ellenőrizd, hogy 0.001 ethert küldtek-e a függvényhívással:
    require(msg.value == 0.001 ether);
    // Ha igen, néhány logika a digitális tétel átadásához a függvény hívójának:
    transferThing(msg.sender);
  }
}
```

Itt a `msg.value` egy módja annak, hogy megnézd, mennyi Ethert küldtek a szerződésnek, és az `ether` egy beépített egység.

Itt az történik, hogy valaki így hívná meg a függvényt a web3.js-ből (a DApp JavaScript frontend-jéből):

```
// Feltételezve, hogy az `OnlineStore` a szerződésedre mutat az Ethereumon:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

Figyeld meg a `value` mezőt, ahol a JavaScript függvényhívás megadja, mennyi `ether`-t küldjön (0.001). Ha a tranzakcióra úgy gondolsz, mint egy borítékra, és a függvényhíváshoz küldött paraméterek a levél tartalma, amit beleraksz, akkor a `value` hozzáadása olyan, mintha készpénzt tennél a borítékba — a levél és a pénz együtt kerülnek kézbesítésre a címzettnek.

>Megjegyzés: Ha egy függvény nincs `payable`-ként jelölve, és Ethert próbálsz küldeni neki, ahogy fent látható, a függvény elutasítja a tranzakciót.


## Tedd próbára

Hozzunk létre egy `payable` függvényt a zombi játékunkban.

Tegyük fel, hogy a játékunknak van egy funkciója, ahol a felhasználók ETH-t fizethetnek, hogy szintet lépjenek a zombijaikkal. Az ETH a szerződésben lesz tárolva, amely a tiéd — ez egy egyszerű példa arra, hogyan lehet pénzt keresni a játékaiddal!

1. Definiálj egy `uint` típusú változót `levelUpFee` néven, és állítsd `0.001 ether`-re.

2. Hozz létre egy `levelUp` nevű függvényt. Egy paramétert vesz, `_zombieId`, egy `uint`. `external` és `payable` legyen.

3. A függvény először `require`-rel ellenőrizze, hogy a `msg.value` egyenlő-e a `levelUpFee`-vel.

4. Ezután növelje a zombi `level`-jét: `zombies[_zombieId].level++`.
