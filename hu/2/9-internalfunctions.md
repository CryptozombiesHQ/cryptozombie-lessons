---
title: További információk a függvény láthatóságról
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
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

            // szerkeszd a függvény definíciót lent
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
      "zombiefeeding.sol": |
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
---

**Az előző leckében lévő kódban van egy hiba!**

Ha megpróbálod fordítani, a fordító hibát fog dobni.

A probléma az, hogy megpróbáltuk meghívni a `_createZombie` függvényt a `ZombieFeeding`-ből, de a `_createZombie` egy `private` függvény a `ZombieFactory`-ban. Ez azt jelenti, hogy egyik szerződés sem, amely örökli a `ZombieFactory`-t, nem fér hozzá.

## Internal és External

A `public` és `private` mellett a Solidity-nek még két típusa van a függvény láthatóságnak: `internal` és `external`.

Az `internal` ugyanaz, mint a `private`, kivéve, hogy az ezt a szerződést örökölő szerződések is hozzáférnek. **(Hé, ez úgy hangzik, mint amit itt szeretnénk!)**.

Az `external` hasonló a `public`-hoz, kivéve, hogy ezek a függvények CSAK a szerződésen kívülről hívhatók — nem hívhatók meg más függvények által a szerződésen belül. Később beszélünk arról, miért érdemes `external`-t használni `public` helyett.

Az `internal` vagy `external` függvények deklarálásához a szintaxis ugyanaz, mint a `private` és `public` esetén:

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string memory) {
    baconSandwichesEaten++;
    // Meghívhatjuk itt, mert internal
    eat();
  }
}
```

# Tegyük próbára

1. Változtasd a `_createZombie()`-t `private`-ról `internal`-ra, hogy a másik szerződésünk hozzáférhessen.

  Már visszavittünk a megfelelő fülre, a `zombiefactory.sol`-ra.
