---
title: Zombi DNS
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

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // kezdj itt
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
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Fejezzük be a `feedAndMultiply` függvény írását.

Az új zombi DNS-ének kiszámítási képlete egyszerű: a táplálkozó zombi DNS-ének és a cél DNS-ének az átlaga.

Például:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ egyenlő lesz 3333333333333333-mal
}
```

Később összetettebbé tehetjük a képletünket, ha akarjuk, például véletlenszerűséget adhatunk az új zombi DNS-éhez. De egyelőre egyszerűen tartjuk — mindig visszatérhetünk hozzá később.

# Tegyük próbára

1. Először meg kell győződnünk, hogy a `_targetDna` nem hosszabb 16 számjegynél. Ehhez beállíthatjuk a `_targetDna`-t `_targetDna % dnaModulus`-ra, hogy csak az utolsó 16 számjegyet vegyük.

2. Ezután a függvényünknek deklarálnia kell egy `newDna` nevű `uint`-ot, és beállítania, hogy egyenlő legyen a `myZombie` DNS-ének és a `_targetDna`-nak az átlagával (ahogy a fenti példában).

  > Megjegyzés: A `myZombie` tulajdonságait a `myZombie.name` és `myZombie.dna` használatával érheted el.

3. Amint megvan az új DNS, hívjuk meg a `_createZombie`-t. Megnézheted a `zombiefactory.sol` fület, ha elfelejted, milyen paraméterekre van szüksége ennek a függvénynek a meghívásához. Figyeld meg, hogy név szükséges, tehát egyelőre állítsuk be az új zombi nevét `"NoName"`-re — később írhatunk egy függvényt a zombik neveinek megváltoztatásához.

> Megjegyzés: A Solidity zsenik számára lehet, hogy észrevesznek egy problémát a kódunkban! Ne aggódj, a következő fejezetben javítjuk ;)
