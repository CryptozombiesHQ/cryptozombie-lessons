---
title: Importare
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        // inserisci qui la dichiarazione di importazione

        contract ZombieFeeding is ZombieFactory {

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

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
                emit NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

      }

---

Wow! Noterai che abbiamo appena ripulito il codice a destra ed ora hai delle schede nella parte superiore dell'editor. Vai avanti, fai clic tra le schede per provarlo.

Il nostro codice stava diventando piuttosto lungo, quindi l'abbiamo suddiviso in più file per renderlo più gestibile. Questo è normalmente il modo in cui gestirai lunghe basi di codice nei tuoi progetti Solidity.

Quando si hanno più file e si desidera importare un file in un altro, Solidity usa la parola chiave `import`:

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

So if we had a file named `someothercontract.sol` in the same directory as this contract (that's what the `./` means), it would get imported by the compiler.
Quindi se avessimo un file chiamato `someothercontract.sol` nella stessa directory di questo contratto (ecco cosa significa `./`), esso verrebbe importato dal compilatore.

# Facciamo una prova

Ora che abbiamo settato una struttura multi-file dobbiamo usare `import` per leggere il contenuto dell'altro file:

1. Importa `zombiefactory.sol` nel nostro nuovo file `zombiefeeding.sol`. 
