---
title: Import
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        // helyezd el az import állítást itt

        contract ZombieFeeding is ZombieFactory {

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

      }

---

Húha! Észreveszed, hogy most takarítottuk a jobb oldali kódot, és most vannak füljeid a szerkesztő tetején. Gyerünk, kattints a fülek között, hogy kipróbáld.

A kódunk elég hosszú lett, ezért több fájlra osztottuk, hogy kezelhetőbb legyen. Ez általában így kezeled a hosszú kódbázisokat a Solidity projekteidben.

Amikor több fájlod van és egy fájlt egy másikba szeretnél importálni, a Solidity az `import` kulcsszót használja:

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Tehát ha lenne egy `someothercontract.sol` nevű fájlunk ugyanabban a könyvtárban, mint ez a szerződés (ez az, amit a `./` jelent), azt a fordító importálná.

# Tegyük próbára

Most, hogy beállítottuk a több fájlból álló struktúrát, használnunk kell az `import`-ot, hogy elolvassuk a másik fájl tartalmát:

1. Importáld a `zombiefactory.sol`-t az új fájlunkba, a `zombiefeeding.sol`-ba. 
