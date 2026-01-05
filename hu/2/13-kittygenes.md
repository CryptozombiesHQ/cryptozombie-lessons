---
title: "Bónusz: Macska gének"
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

          // Módosítsd a függvény definíciót itt:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // Adj hozzá egy if állítást itt
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // És módosítsd a függvény hívást itt:
            feedAndMultiply(_zombieId, kittyDna);
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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

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

A függvény logikánk most kész... de adjunk hozzá egy bónusz funkciót.

Tegyük úgy, hogy a macskákból készült zombiknak legyen valami egyedi jellemzőjük, amely mutatja, hogy macska-zombik.

Ehhez hozzáadhatunk néhány speciális macska kódot a zombi DNS-éhez.

Ha visszaemlékszel az 1. leckére, jelenleg csak a 16 jegyű DNS első 12 számjegyét használjuk a zombi megjelenésének meghatározásához. Tehát használjuk az utolsó 2 fel nem használt számjegyet "speciális" jellemzők kezeléséhez.

Azt mondjuk, hogy a macska-zombiknak `99` az utolsó két DNS számjegye (mivel a macskáknak 9 élete van). Tehát a kódunkban azt mondjuk, hogy `if` egy zombi macskából jön, akkor állítsuk be az utolsó két DNS számjegyet `99`-re.

## If állítások

Az if állítások a Solidity-ben pont úgy néznek ki, mint a JavaScript-ben:

```
function eatBLT(string memory sandwich) public {
  // Emlékezz, stringekkel a keccak256 hash-eket kell összehasonlítanunk
  // az egyenlőség ellenőrzéséhez
  if (keccak256(abi.encodePacked(sandwich)) == keccak256(abi.encodePacked("BLT"))) {
    eat();
  }
}
```

# Tegyük próbára

Implementáljuk a macska génjeit a zombi kódunkban.

1. Először változtassuk meg a `feedAndMultiply` függvény definícióját, hogy egy 3. argumentumot is vegyen: egy `_species` nevű `string`-et, amelyet `memory`-ban tárolunk.

2. Ezután, miután kiszámoltuk az új zombi DNS-ét, adjunk hozzá egy `if` állítást, amely összehasonlítja a `_species` és a `"kitty"` string `keccak256` hash-eit. Nem adhatunk közvetlenül stringeket a `keccak256`-nak. Ehelyett `abi.encodePacked(_species)`-t adunk argumentumként a bal oldalon és `abi.encodePacked("kitty")`-t argumentumként a jobb oldalon.

3. Az `if` állításon belül az utolsó 2 DNS számjegyet `99`-re szeretnénk cserélni. Ennek egyik módja a következő logika használata: `newDna = newDna - newDna % 100 + 99;`.

  > Magyarázat: Tegyük fel, hogy a `newDna` `334455`. Ekkor a `newDna % 100` `55`, tehát a `newDna - newDna % 100` `334400`. Végül adjunk hozzá `99`-et, hogy `334499`-et kapjunk.

4. Végül meg kell változtatnunk a `feedOnKitty`-n belüli függvény hívást. Amikor meghívja a `feedAndMultiply`-t, adjuk hozzá a `"kitty"` paramétert a végére.
