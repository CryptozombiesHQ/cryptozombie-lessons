---
title: Require
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
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
              // kezdj itt
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
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
---

Az 1. leckében úgy csináltuk, hogy a felhasználók új zombikat hozhatnak létre a `createRandomZombie` meghívásával és egy név megadásával. Azonban, ha a felhasználók folyamatosan meghívhatnák ezt a függvényt, hogy korlátlan számú zombit hozzanak létre a seregükben, a játék nem lenne túl szórakoztató.

Tegyük úgy, hogy minden játékos csak egyszer hívhatja meg ezt a függvényt. Így az új játékosok akkor hívják meg, amikor először elindítják a játékot, hogy létrehozzák a kezdeti zombit a seregükben.

Hogyan tehetjük úgy, hogy ez a függvény csak játékosonként egyszer hívódjon meg?

Erre a `require`-t használjuk. A `require` azt teszi, hogy a függvény hibát dob és leállítja a végrehajtást, ha valamilyen feltétel nem igaz:

```
function sayHiToVitalik(string memory _name) public returns (string memory) {
  // Összehasonlítja, hogy a _name egyenlő-e "Vitalik"-kal. Hibát dob és kilép, ha nem igaz.
  // (Megjegyzés: A Solidity-ben nincs natív string összehasonlítás, ezért
  // a keccak256 hash-eket hasonlítjuk össze, hogy lássuk, egyenlőek-e a stringek)
  require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
  // Ha igaz, folytatja a függvényt:
  return "Hi!";
}
```

Ha ezt a függvényt `sayHiToVitalik("Vitalik")`-kal hívod meg, "Hi!"-t ad vissza. Ha bármilyen más bemenettel hívod meg, hibát dob és nem hajtja végre.

Tehát a `require` elég hasznos bizonyos feltételek ellenőrzéséhez, amelyeknek igaznak kell lenniük egy függvény futtatása előtt.

# Tegyük próbára

A zombi játékunkban nem szeretnénk, hogy a felhasználó korlátlan számú zombit hozhasson létre a seregében a `createRandomZombie` ismételt meghívásával — ez nem tenné túl szórakoztatóvá a játékot.

Használjuk a `require`-t, hogy biztosítsuk, ez a függvény csak egyszer hajtódik végre felhasználónként, amikor létrehozzák az első zombijukat.

1. Helyezz el egy `require` állítást a `createRandomZombie` elején. A függvénynek ellenőriznie kell, hogy a `ownerZombieCount[msg.sender]` egyenlő-e `0`-val, és különben hibát kell dobnia.

> Megjegyzés: A Solidity-ben nem számít, melyik tagot teszed először — mindkét sorrend egyenértékű. Azonban mivel a válasz ellenőrzőnk nagyon alapvető, csak egy választ fogad el helyesnek — azt várja, hogy a `ownerZombieCount[msg.sender]` jöjjön először.
