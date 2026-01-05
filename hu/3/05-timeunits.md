---
title: Időegységek
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
            // 1. Definiáld a `cooldownTime`-ot itt

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
                // 2. Frissítsd a következő sort:
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
---

A `level` tulajdonság elég önmagától értetődő. Később, amikor létrehozzuk a csata rendszert, a zombik, akik több csatát nyernek, idővel szintet lépnek, és hozzáférést kapnak több képességhez.

A `readyTime` tulajdonság egy kicsit több magyarázatot igényel. A cél egy "cooldown periódus" hozzáadása, egy időtartam, amit egy zombinak várnia kell a táplálkozás vagy támadás után, mielőtt újra táplálkozhat / támadhat. Enélkül a zombi napi 1000-szer is támadhatna és szaporodhatna, ami túl könnyűvé tenné a játékot.

Ahhoz, hogy nyomon kövessük, mennyi időt kell várnia egy zombinak, mielőtt újra támadhat, használhatjuk a Solidity időegységeit.

## Időegységek

A Solidity néhány natív egységet biztosít az idő kezeléséhez.

A `now` változó visszaadja a legutóbbi blokk aktuális unix időbélyegét (a másodpercek számát, amelyek eltelték 1970. január 1-je óta). A unix idő, amikor ezt írom, `1515527488`.

>Megjegyzés: A Unix időt hagyományosan 32 bites számban tárolják. Ez a "2038-as év" problémához vezet, amikor a 32 bites unix időbélyegek túlcsordulnak, és sok régi rendszert tönkretesznek. Tehát ha azt szeretnénk, hogy a DApp-unk 20 év múlva is fusson, használhatnánk 64 bites számot helyette — de a felhasználóinknak több gázt kellene költeniük a DApp-unk használatához eközben. Tervezési döntések!

A Solidity tartalmazza az `seconds`, `minutes`, `hours`, `days`, `weeks` és `years` időegységeket. Ezek egy `uint`-té alakítják át az adott időtartam másodperceinek számát. Tehát `1 minutes` az `60`, `1 hours` az `3600` (60 másodperc x 60 perc), `1 days` az `86400` (24 óra x 60 perc x 60 másodperc), stb.

Íme egy példa arra, hogyan lehet hasznosak ezek az időegységek:

```
uint lastUpdated;

// Állítsd be a `lastUpdated`-ot `now`-ra
function updateTimestamp() public {
  lastUpdated = now;
}

// `true`-t ad vissza, ha 5 perc telt el az `updateTimestamp` hívása óta,
// `false`-t, ha 5 perc még nem telt el
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Használhatjuk ezeket az időegységeket a Zombi `cooldown` funkcióhoz.


## Tegyük próbára

Adjunk hozzá egy cooldown időt a DApp-unkhoz, és tegyük úgy, hogy a zombiknak **1 napot** kell várniuk a támadás vagy táplálkozás után, mielőtt újra támadhatnának.

1. Deklarálj egy `cooldownTime` nevű `uint`-ot, és állítsd be `1 days`-ra. (Bocsáss meg a rossz nyelvtanért — ha "1 day"-ra állítod, nem fog lefordulni!)

2. Mivel hozzáadtunk egy `level`-t és `readyTime`-ot a `Zombie` struktúránkhoz az előző fejezetben, frissítenünk kell a `_createZombie()`-t, hogy a helyes számú argumentumot használja, amikor új `Zombie` struktúrát hozunk létre.

  Frissítsd a `zombies.push` kódsort, hogy adjon hozzá még 2 argumentumot: `1` (a `level`-hez), és `uint32(now + cooldownTime)` (a `readyTime`-hoz).

>Megjegyzés: A `uint32(...)` szükséges, mert a `now` alapértelmezés szerint `uint256`-ot ad vissza. Tehát explicit módon `uint32`-re kell konvertálnunk.

A `now + cooldownTime` egyenlő lesz az aktuális unix időbélyeggel (másodpercekben) plusz 1 nap másodperceinek számával — ami egyenlő lesz a jelenlegi időből 1 nappal későbbi unix időbélyeggel. Később összehasonlíthatjuk, hogy ez a zombi `readyTime`-ja nagyobb-e, mint a `now`, hogy lássuk, eltelt-e elég idő a zombi újrahasználatához.

A következő fejezetben implementáljuk a `readyTime` alapján történő műveletek korlátozásának funkcionalitását.
