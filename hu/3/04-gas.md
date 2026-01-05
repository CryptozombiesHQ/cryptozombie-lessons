---
title: Gáz
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;

            struct Zombie {
                string name;
                uint dna;
                // Add hozzá az új adatokat itt
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

          function setKittyContractAddress(address _address) external onlyOwner {
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
              uint32 level;
              uint32 readyTime;
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

Nagyszerű! Most már tudjuk, hogyan frissítsük a DApp kulcsfontosságú részeit, miközben megakadályozzuk, hogy más felhasználók szórakozzanak a szerződéseinkkel.

Nézzünk meg egy másik módot, ahogyan a Solidity elég különböző más programozási nyelvektől:

## Gáz — az üzemanyag, amin az Ethereum DApp-ok futnak

A Solidity-ben a felhasználóidnak fizetniük kell minden alkalommal, amikor végrehajtanak egy függvényt a DApp-odban egy **_gáz_** nevű valuta használatával. A felhasználók Etherrel (az Ethereum valutájával) vásárolnak gázt, így a felhasználóidnak ETH-t kell költeniük, hogy végrehajthassanak függvényeket a DApp-odban.

Mennyi gáz szükséges egy függvény végrehajtásához, az attól függ, mennyire összetett a függvény logikája. Minden egyes műveletnek van egy **_gáz költsége_**, amely nagyjából attól függ, mennyi számítási erőforrásra lesz szükség a művelet végrehajtásához (pl. a tárolóba írás sokkal drágább, mint két egész szám összeadása). A függvényed összes **_gáz költsége_** az összes egyedi művelet gáz költségeinek összege.

Mivel a függvények futtatása valódi pénzbe kerül a felhasználóidnak, a kód optimalizálás sokkal fontosabb az Ethereumon, mint más programozási nyelvekben. Ha a kódod hanyag, a felhasználóidnak prémiumot kell fizetniük a függvényeid végrehajtásáért — és ez millió dolláros felesleges költségeket jelenthet több ezer felhasználó esetében.

## Miért szükséges a gáz?

Az Ethereum olyan, mint egy nagy, lassú, de rendkívül biztonságos számítógép. Amikor végrehajtasz egy függvényt, a hálózat minden egyes csomópontjának ugyanazt a függvényt kell futtatnia a kimenet ellenőrzéséhez — több ezer csomópont, amely minden függvény végrehajtást ellenőriz, ez teszi az Ethereumot decentralizálttá, és az adatait változhatatlanná és cenzúra-állóvá.

Az Ethereum készítői biztosítani akarták, hogy senki ne tudja eltömíteni a hálózatot egy végtelen ciklussal, vagy lefoglalni az összes hálózati erőforrást nagyon intenzív számításokkal. Ezért úgy alakították ki, hogy a tranzakciók nem ingyenesek, és a felhasználóknak fizetniük kell a számítási időért, valamint a tárolásért.

> Megjegyzés: Ez nem feltétlenül igaz más blockchainekre, mint például azokra, amelyeket a CryptoZombies szerzői építenek a Loom Networknél. Valószínűleg soha nem lesz értelme egy olyan játékot közvetlenül az Ethereum mainneten futtatni, mint a World of Warcraft — a gáz költségek túlzottan drágák lennének. De futhatna egy másik konszenzus algoritmussal rendelkező blockchainen. Egy későbbi leckében többet fogunk beszélni arról, hogy milyen típusú DApp-okat érdemes telepíteni a Loom-ra az Ethereum mainnet helyett.

## Struktúra csomagolás gáz megtakarítás érdekében

Az 1. leckében említettük, hogy vannak más típusú `uint`-ek: `uint8`, `uint16`, `uint32`, stb.

Általában nincs előnye ezeknek az altípusoknak a használatának, mert a Solidity 256 bit tárolást foglal le, függetlenül a `uint` méretétől. Például a `uint8` használata a `uint` (`uint256`) helyett nem takarít meg gázt.

De van egy kivétel: a `struct`-okon belül.

Ha több `uint`-ed van egy struktúrán belül, a lehető legkisebb méretű `uint` használata lehetővé teszi a Solidity-nek, hogy ezeket a változókat együtt csomagolja, hogy kevesebb tárolást foglaljanak el. Például:

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// A `mini` kevesebb gázt fog költeni, mint a `normal`, a struktúra csomagolás miatt
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

Ezért egy struktúrán belül a lehető legkisebb egész altípusokat érdemes használni.

Azt is érdemes azonos adattípusokat együtt csoportosítani (azaz egymás mellé helyezni őket a struktúrában), hogy a Solidity minimalizálhassa a szükséges tárolóhelyet. Például egy struktúra `uint c; uint32 a; uint32 b;` mezőkkel kevesebb gázt fog költeni, mint egy struktúra `uint32 a; uint c; uint32 b;` mezőkkel, mert a `uint32` mezők együtt vannak csoportosítva.


## Tegyük próbára

Ebben a leckében 2 új funkciót fogunk hozzáadni a zombijainkhoz: `level` és `readyTime` — az utóbbit egy cooldown időzítő implementálásához fogjuk használni, hogy korlátozzuk, milyen gyakran táplálkozhat egy zombi.

Tehát ugorjunk vissza a `zombiefactory.sol`-hoz.

1. Adj hozzá még két tulajdonságot a `Zombie` struktúránkhoz: `level` (egy `uint32`), és `readyTime` (szintén egy `uint32`). Szeretnénk ezeket az adattípusokat együtt csomagolni, ezért tegyük őket a struktúra végére.

32 bit bőven elég a zombi szintjének és időbélyegének tárolásához, így ez megtakarít nekünk néhány gáz költséget azáltal, hogy szorosabban csomagoljuk az adatokat, mint ha egy normál `uint`-et (256 bit) használnánk.
