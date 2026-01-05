---
title: Szerződések változhatatlansága
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

          // 1. Töröld ezt:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Változtasd ezt csak deklarációra:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Add hozzá a setKittyContractAddress metódust itt

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
---

Eddig a Solidity elég hasonlónak tűnt más nyelvekhez, mint a JavaScript. De számos módon az Ethereum DApp-ok valójában elég különbözőek a normál alkalmazásoktól.

Kezdésként, miután telepítettél egy szerződést az Ethereumra, az **_változhatatlan_**, ami azt jelenti, hogy soha nem módosítható vagy frissíthető újra.

A kezdeti kód, amit egy szerződésbe telepítesz, ott marad, véglegesen, a blockchainen. Ez az egyik oka annak, hogy a biztonság olyan nagy aggodalom a Solidity-ben. Ha van egy hiba a szerződés kódjában, nincs módod később javítani. El kellene mondanod a felhasználóidnak, hogy kezdjenek el egy másik okos szerződés címet használni, amely tartalmazza a javítást.

De ez egyben az okos szerződések egyik funkciója is. A kód a törvény. Ha elolvasod egy okos szerződés kódját és ellenőrzöd, biztos lehet benne, hogy minden alkalommal, amikor meghívsz egy függvényt, pontosan azt fogja csinálni, amit a kód szerint csinálnia kell. Senki sem változtathatja meg később azt a függvényt, és adhat váratlan eredményeket.

## Külső függőségek

A 2. leckében beégettük a CryptoKitties szerződés címét a DApp-unkba. De mi történne, ha a CryptoKitties szerződésben lenne egy hiba és valaki elpusztítaná az összes macskát?

Nem valószínű, de ha ez megtörténne, teljesen használhatatlanná tenné a DApp-unkat — a DApp-unk egy beégetett címre mutatna, amely már nem ad vissza macskákat. A zombijaink nem tudnának táplálkozni macskákon, és nem tudnánk módosítani a szerződésünket, hogy javítsuk.

Ezért gyakran érdemes olyan függvényeket létrehozni, amelyek lehetővé teszik a DApp kulcsfontosságú részeinek frissítését.

Például a CryptoKitties szerződés címének beégetése helyett a DApp-unkba valószínűleg legyen egy `setKittyContractAddress` függvény, amely lehetővé teszi, hogy később megváltoztassuk ezt a címet, ha valami történik a CryptoKitties szerződéssel.

## Tegyük próbára

Frissítsük a 2. leckéből származó kódunkat, hogy képes legyen megváltoztatni a CryptoKitties szerződés címét.

1. Töröld azt a kódsort, ahol beégettük a `ckAddress`-t.

2. Változtasd azt a sort, ahol létrehoztuk a `kittyContract`-ot, hogy csak deklarálja a változót — azaz ne állítsd be semmire sem egyenlőnek.

3. Hozz létre egy függvényt `setKittyContractAddress` néven. Egy argumentumot vesz, `_address` (egy `address`), és `external` függvény legyen.

4. A függvényen belül adj hozzá egy kódsort, amely beállítja a `kittyContract`-ot `KittyInterface(_address)`-re.

> Megjegyzés: Ha észreveszel egy biztonsági rést ezzel a függvénnyel, ne aggódj — a következő fejezetben javítjuk ;)
