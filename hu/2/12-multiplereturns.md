---
title: Több visszatérési érték kezelése
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

          // definiáld a függvényt itt

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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna);
        }

      }
---

Ez a `getKitty` függvény az első példa, amelyet láttunk, és több értéket ad vissza. Nézzük meg, hogyan kezeljük őket:

```
function multipleReturns() internal returns(uint a, uint b, uint c) {
  return (1, 2, 3);
}

function processMultipleReturns() external {
  uint a;
  uint b;
  uint c;
  // Így csinálod a többes hozzárendelést:
  (a, b, c) = multipleReturns();
}

// Vagy ha csak az egyik érték érdekel:
function getLastReturnValue() external {
  uint c;
  // Egyszerűen üresen hagyhatjuk a többi mezőt:
  (,,c) = multipleReturns();
}
```

# Tegyük próbára

Itt az idő, hogy interaktáljunk a CryptoKitties szerződéssel!

Készítsünk egy függvényt, amely lekéri a macska génjeit a szerződésből:

1. Készíts egy függvényt `feedOnKitty` néven. Két `uint` paramétert vesz, `_zombieId`-t és `_kittyId`-t, és `public` függvény legyen.

2. A függvény először deklaráljon egy `kittyDna` nevű `uint`-ot.

  > Megjegyzés: A `KittyInterface`-ben a `genes` egy `uint256` — de ha visszaemlékszel az 1. leckére, a `uint` a `uint256` aliasa — ugyanaz a dolog.

3. A függvény ezután hívja meg a `kittyContract.getKitty` függvényt `_kittyId`-val és tárolja a `genes`-t a `kittyDna`-ban. Emlékezz — a `getKitty` egy csomó változót ad vissza. (Pontosan 10-et — kedves vagyok, megszámoltam neked!). De csak az utolsó érdekel, a `genes`. Számold meg gondosan a vesszőket!

4. Végül a függvény hívja meg a `feedAndMultiply`-t, és adja át neki mind a `_zombieId`-t, mind a `kittyDna`-t.
