---
title: Mapping-ek és címek
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

          // deklarálj mapping-eket itt

          function _createZombie(string memory _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
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

Tegyük többjátékos játékunkat úgy, hogy a zombiknak az adatbázisunkban tulajdonost adunk.

Ehhez 2 új adattípusra lesz szükségünk: `mapping` és `address`.

## Címek

Az Ethereum blockchain **_fiókokból_** áll, amelyekre úgy gondolhatsz, mint bankfiókokra. Egy fióknak van egy **_Ether_** egyenlege (az Ethereum blockchainen használt pénznem), és küldhetsz és fogadhatsz Ether fizetéseket más fiókoknak, pont úgy, mint a bankfiókod átutalhat pénzt más bankfiókoknak.

Minden fióknak van egy `address`-e, amelyre úgy gondolhatsz, mint egy bankszámlaszámra. Ez egy egyedi azonosító, amely arra a fiókra mutat, és így néz ki:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Ez a cím a CryptoZombies csapaté. Ha élvezed a CryptoZombies-t, küldhetsz nekünk néhány Ethert! 😉 )

A címek részleteibe egy későbbi leckében belemegyünk, de most csak azt kell megértened, hogy **egy cím egy specifikus felhasználóé** (vagy egy okos szerződésé).

Tehát használhatjuk egyedi azonosítóként a zombijaink tulajdonjogához. Amikor egy felhasználó új zombikat hoz létre az alkalmazásunkkal való interakcióval, beállítjuk azoknak a zombiknak a tulajdonjogát arra az Ethereum címre, amely meghívta a függvényt.

## Mapping-ek

Az 1. leckében a **_struktúrákat_** és a **_tömböket_** néztük meg. A **_mapping-ek_** egy másik módja az adatok szervezett tárolásának a Solidity-ben.

Egy `mapping` definiálása így néz ki:

```
// Egy pénzügyi alkalmazáshoz, egy uint tárolása, amely a felhasználó fiók egyenlegét tartalmazza:
mapping (address => uint) public accountBalance;
// Vagy használható felhasználónevek tárolásához/kikereséséhez userId alapján
mapping (uint => string) userIdToName;
```

Egy mapping lényegében egy kulcs-érték tároló az adatok tárolásához és kikereséséhez. Az első példában a kulcs egy `address` és az érték egy `uint`, a második példában a kulcs egy `uint` és az érték egy `string`.

# Tegyük próbára

A zombi tulajdonjog tárolásához két mapping-et fogunk használni: egyet, amely nyomon követi, hogy melyik cím birtokolja a zombit, és egy másikat, amely nyomon követi, hogy egy tulajdonosnak hány zombija van.

1. Hozz létre egy mapping-et `zombieToOwner` néven. A kulcs egy `uint` lesz (a zombit az id-ja alapján tároljuk és keressük ki) és az érték egy `address`. Tegyük ezt a mapping-et `public`-ká.

2. Hozz létre egy mapping-et `ownerZombieCount` néven, ahol a kulcs egy `address` és az érték egy `uint`.
