---
title: Storage vs Memory (Adat hely)
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Kezdj itt

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

            function _createZombie(string memory _name, uint _dna) private {
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

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

A Solidity-ben két helyen tárolhatsz változókat — `storage`-ban és `memory`-ben.

A **_Storage_** a blockchainen véglegesen tárolt változókra utal. A **_Memory_** változók ideiglenesek, és törlődnek a szerződésed külső függvény hívásai között. Gondolj rá úgy, mint a számítógéped merevlemezére vs RAM-ra.

A legtöbb esetben nem kell használnod ezeket a kulcsszavakat, mert a Solidity alapértelmezetten kezeli őket. Az állapot változók (a függvényeken kívül deklarált változók) alapértelmezetten `storage`-ok és véglegesen íródnak a blockchainre, míg a függvényeken belül deklarált változók `memory`-k és eltűnnek, amikor a függvény hívás véget ér.

Azonban vannak esetek, amikor szükséges ezeket a kulcsszavakat használni, nevezetesen amikor **_struktúrákkal_** és **_tömbökkel_** dolgozol függvényeken belül:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Elég egyszerűnek tűnik, de a Solidity figyelmeztetést ad,
    // hogy itt explicit módon kell deklarálnod a `storage`-t vagy `memory`-t.

    // Tehát ehelyett a `storage` kulcsszóval kell deklarálnod, így:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...ebben az esetben a `mySandwich` egy mutató a `sandwiches[_index]`-re
    // a storage-ban, és...
    mySandwich.status = "Eaten!";
    // ...ez véglegesen megváltoztatja a `sandwiches[_index]`-et a blockchainen.

    // Ha csak egy másolatot szeretnél, használhatod a `memory`-t:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...ebben az esetben az `anotherSandwich` egyszerűen egy másolat lesz
    // az adatokból a memory-ban, és...
    anotherSandwich.status = "Eaten!";
    // ...csak az ideiglenes változót módosítja és nincs hatása
    // a `sandwiches[_index + 1]`-re. De megteheted ezt:
    sandwiches[_index + 1] = anotherSandwich;
    // ...ha vissza szeretnéd másolni a változásokat a blockchain storage-ba.
  }
}
```

Ne aggódj, ha még nem érted teljesen, mikor melyiket kell használni — ebben az oktatóanyagban elmondjuk, mikor használd a `storage`-t és mikor a `memory`-t, és a Solidity fordító is figyelmeztetéseket ad, hogy tudasd, mikor kellene használnod ezeket a kulcsszavakat.

Egyelőre elég megérteni, hogy vannak esetek, amikor explicit módon kell deklarálnod a `storage`-t vagy `memory`-t!

# Tegyük próbára

Itt az idő, hogy a zombijainknak képességet adjunk a táplálkozásra és szaporodásra!

Amikor egy zombi táplálkozik valamilyen más élőlényen, a DNS-e összekeveredik a másik élőlény DNS-ével, hogy új zombit hozzon létre.

1. Hozz létre egy függvényt `feedAndMultiply` néven. Két paramétert vesz: `_zombieId` (egy `uint`) és `_targetDna` (szintén egy `uint`). Ez a függvény `public` legyen.

2. Nem szeretnénk, hogy valaki más táplálkoztassa a zombinkat! Tehát először győződjünk meg róla, hogy mi birtokoljuk ezt a zombit. Adj hozzá egy `require` állítást, hogy ellenőrizze, hogy a `msg.sender` egyenlő-e ezzel a zombi tulajdonosával (hasonlóan, ahogy a `createRandomZombie` függvényben csináltuk).

 > Megjegyzés: Ismét, mivel a válasz ellenőrzőnk primitív, azt várja, hogy a `msg.sender` jöjjön először, és hibásnak jelöli, ha felcseréled a sorrendet. De általában amikor programozol, bármelyik sorrendet használhatod, amit preferálsz — mindkettő helyes.

3. Szükségünk lesz erre a zombi DNS-ére. Tehát a következő dolog, amit a függvényünknek csinálnia kell, hogy deklaráljon egy helyi `Zombie`-t `myZombie` néven (ami egy `storage` mutató lesz). Állítsd be ezt a változót, hogy egyenlő legyen a `_zombieId` indexű elemmel a `zombies` tömbünkben.

Eddig 4 sor kódodnak kell lennie, beleértve a záró `}` sort.

A következő fejezetben folytatjuk ezt a függvényt!
