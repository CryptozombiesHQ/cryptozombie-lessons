---
title: Msg.sender
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
              // kezdj itt
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string memory _name) public {
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
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Most, hogy megvannak a mapping-eink, amelyek nyomon követik, ki birtokolja a zombit, frissíteni szeretnénk a `_createZombie` metódust, hogy használja őket.

Ehhez valamit kell használnunk, amit `msg.sender`-nek hívunk.

## msg.sender

A Solidity-ben vannak bizonyos globális változók, amelyek minden függvény számára elérhetők. Ezek egyike a `msg.sender`, amely az aktuális függvényt meghívó személy (vagy okos szerződés) `address`-ére utal.

> Megjegyzés: A Solidity-ben a függvény végrehajtásnak mindig egy külső hívóval kell kezdődnie. Egy szerződés csak ül a blockchainen és semmit sem csinál, amíg valaki nem hívja meg az egyik függvényét. Tehát mindig lesz egy `msg.sender`.

Íme egy példa a `msg.sender` használatára és egy `mapping` frissítésére:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Frissítsd a `favoriteNumber` mapping-et, hogy tárolja a `_myNumber`-t a `msg.sender` alatt
  favoriteNumber[msg.sender] = _myNumber;
  // ^ Az adatok tárolásának szintaxisa egy mapping-ben ugyanaz, mint a tömböknél
}

function whatIsMyNumber() public view returns (uint) {
  // Kérdezd le a küldő címében tárolt értéket
  // `0` lesz, ha a küldő még nem hívta meg a `setMyNumber`-t
  return favoriteNumber[msg.sender];
}
```

Ebben az egyszerű példában bárki meghívhatja a `setMyNumber`-t és tárolhat egy `uint`-ot a szerződésünkben, amely a címéhez lesz kötve. Aztán amikor meghívják a `whatIsMyNumber`-t, visszakapják az általuk tárolt `uint`-ot.

A `msg.sender` használata biztosítja az Ethereum blockchain biztonságát — az egyetlen módja annak, hogy valaki módosítsa valaki más adatait, az lenne, ha ellopná az Ethereum címéhez tartozó privát kulcsot.

# Tegyük próbára

Frissítsük az 1. leckéből származó `_createZombie` metódusunkat, hogy a zombi tulajdonjogát annak rendelje hozzá, aki meghívta a függvényt.

1. Először, miután visszakaptuk az új zombi `id`-ját, frissítsük a `zombieToOwner` mapping-et, hogy tárolja a `msg.sender`-t az `id` alatt.

2. Másodszor, növeljük az `ownerZombieCount`-ot erre a `msg.sender`-re.

A Solidity-ben növelhetsz egy `uint`-ot `++`-szal, pont úgy, mint a JavaScript-ben:

```
uint number = 0;
number++;
// a `number` most `1`
```

A végső válaszod ennek a fejezetnek 2 sor kódnak kell lennie.
