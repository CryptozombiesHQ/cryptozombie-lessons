---
title: Importering
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // sett import-statement her

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

Jøss! Du vil merke at vi bare har ryddet opp koden til høyre, og du har nå faner øverst på redigeringsprogrammet. Kom igjen, klikk mellom fanene for å prøve det.

Koden vår ble ganske lang, så vi splitte den opp i flere filer for å gjøre det mer overskuelig. Dette er vanligvis hvordan du håndterer lange kodebaser i Solidity-prosjekter.

Når du har flere filer og du vil importere en fil til en annen, bruker Solidity `import`-nøkkelordet:

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Så hvis vi hadde en fil som heter `someothercontract.sol` i samme katalog som denne kontrakten (det er hva `./` betyr), ville det bli importert av kompilatoren.

# Test det

Nå som vi har satt opp en multi-filstruktur, må vi bruke `import` for å lese innholdet i den andre filen:

1. Importer `zombiefactory.sol` inn i din nye fil, `zombiefeeding.sol`. 
