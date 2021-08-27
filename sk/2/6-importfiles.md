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

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

      }

---
Hohó! Všimni si, že sme trochu prečistili kód vpravo, a že v editore sa ti zobrazujú taby jednotlivých súborov. Vyskúšaj sa medzi nimi trochu preklikať. 

Náš kód začínal byť pomerne dlhý, takže sme ho rozdelili do niekoľkých suborov. Toto je častý spôsob ako si poradiť s veľkými Solidity projektami.

Keď máš niekoľko súborov a chceš importovať jeden do druhého, Solidity na to používa kľúčové slovo `import`:'

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Ak by sme mali súbor s názvom `someothercontract.sol` v rovnakom adresári ako tento kontrakt (`./` referuje adresár v kontrakt uložený), takto by sme ho naimportovali. 

# Vyskúšaj si to sám

Teraz keď už máme pripravenú viac súborovú štruktúru projektu, použijeme `import` na to, aby sme mohli využívať obsah iných súborov.

1. Importuj `zombiefactory.sol` do našeho nového súboru `zombiefeeding.sol`.
