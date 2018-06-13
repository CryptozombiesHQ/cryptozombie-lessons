---
title: Import
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // tu doplň import

        contract ZombieFeeding is ZombieFactory {

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

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

            function _createZombie(string _name, uint _dna) private {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

      }

---
Hohó! Všimni si že sme trochu prečistili kód vpravo a v editora sa ti zobrazujú taby jednotlivých súborov. Vyskúšaj sa medzi nimi trochu preklikať. 

Náš kód začínal byť celkom dlhý, takže sme ho rozdelili do niekoľkých suborov, aby sa nám s ním ľahšie pracovalo. Toto je obvyklý spôsob ako si poradiť s vělkými Solidity projektami.

Keď máš niekoľko súborov a chceš importovať jeden do druhé'ho, v Solidity sa na to používa kľučove slovo `import`:'

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Takže ak by sme mali súbor s názvom `someothercontract.sol` v rovnakom adresári ako tento kontrakt (`./` referuje adresár v ktorom je daný kontrakt uložený). 

# Vyskúšaj si to sám

Teraz keď už máme pripravenú multi-súborovú štruktúru, musíme použiť `import` na to, aby sme mohli používať obsah iných súborov.

1. Importuj `zombiefactory.sol` do našeho nového súboru `zombiefeeding.sol`.
