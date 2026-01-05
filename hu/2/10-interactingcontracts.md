---
title: Mit esznek a zombik?
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefactory.sol";

        // Hozd létre a KittyInterface-t itt

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Itt az idő, hogy tápláljuk a zombijainkat! És mit szeretnek leginkább enni a zombik?

Nos, úgy történik, hogy a CryptoZombies szeretnek enni...

**CryptoKitties-t!** 😱😱😱

(Igen, komolyan mondom 😆 )

Ehhez be kell olvasnunk a kittyDna-t a CryptoKitties okos szerződésből. Ezt megtehetjük, mert a CryptoKitties adatok nyíltan tárolódnak a blockchainen. Nem menő a blockchain?!

Ne aggódj — a játékunk valójában nem fog bántani senki CryptoKitty-ját. Csak *olvassuk* a CryptoKitties adatokat, nem tudjuk valójában törölni őket 😉

## Interakció más szerződésekkel

Ahhoz, hogy a szerződésünk beszéljen egy másik szerződéssel a blockchainen, amely nem a miénk, először definiálnunk kell egy **_interfészt_**.

Nézzünk meg egy egyszerű példát. Tegyük fel, hogy volt egy szerződés a blockchainen, amely így nézett ki:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

Ez egy egyszerű szerződés lenne, ahol bárki tárolhatná a szerencseszámát, és az Ethereum címéhez lenne kötve. Aztán bárki más megnézhetné annak a személynek a szerencseszámát a címük használatával.

Most tegyük fel, hogy volt egy külső szerződésünk, amely be akarta olvasni az adatokat ebből a szerződésből a `getNum` függvény használatával.

Először definiálnunk kellene a `LuckyNumber` szerződés egy **_interfészét_**:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Figyeld meg, hogy ez úgy néz ki, mint egy szerződés definiálása, néhány különbséggel. Egyrészt csak azokat a függvényeket deklaráljuk, amelyekkel interaktálni szeretnénk — ebben az esetben a `getNum` — és nem említjük a többi függvényt vagy állapot változót.

Másrészt nem definiáljuk a függvény törzseit. A kapcsos zárójelek (`{` és `}`) helyett egyszerűen pontosvesszővel (`;`) zárjuk a függvény deklarációt.

Tehát egyfajta szerződés vázra hasonlít. Így tudja a fordító, hogy ez egy interfész.

Az interfész beillesztésével a dapp kódunkba a szerződésünk tudja, hogyan néznek ki a másik szerződés függvényei, hogyan hívhatja meg őket, és milyen választ várhat.

A következő leckében belemegyünk, hogyan hívjuk meg a másik szerződés függvényeit, de most deklaráljuk az interfészünket a CryptoKitties szerződéshez.

# Tegyük próbára

Megkerestük neked a CryptoKitties forráskódját, és találtunk egy `getKitty` nevű függvényt, amely visszaadja az összes macska adatát, beleértve a "génjeit" is (amire a zombi játékunknak szüksége van egy új zombi létrehozásához!).

A függvény így néz ki:

```
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
) {
    Kitty storage kit = kitties[_id];

    // ha ez a változó 0, akkor nem vemhes
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

A függvény kicsit másképp néz ki, mint amit megszoktunk. Láthatod, hogy visszaad... egy csomó különböző értéket. Ha olyan programozási nyelvről jössz, mint a JavaScript, ez más — a Solidity-ben több értéket is visszaadhatsz egy függvényből.

Most, hogy tudjuk, hogyan néz ki ez a függvény, használhatjuk egy interfész létrehozásához:

1. Definiálj egy interfészt `KittyInterface` néven. Emlékezz, ez úgy néz ki, mint egy új szerződés létrehozása — a `contract` kulcsszót használjuk.

2. Az interfészen belül definiáld a `getKitty` függvényt (amelynek a fenti függvény másolása/beillesztése kell legyen, de pontosvesszővel a `returns` állítás után, a kapcsos zárójelekben lévő minden helyett).
