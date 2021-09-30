---
title: Importar
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        // añade la sentencia import aquí

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

¡Guau! Notarás que hemos limpiado el código de la derecha, ahora tienes unas pestañas en la parte superior de tu editor. Adelante, clica entre las pestañas para probarlo.

Nuestro código estaba quedando algo largo, por eso lo hemos dividido en multiples archivos haciendolo así más manejable. Así es como normalmente deberás guardar tu código base en tus proyectos de Solidity.

Cuando tienes multiples archivos y quieres importar uno dentro de otro, Solidity usa la palabra clave `import`:

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Entonces si tenemos un fichero llamado `someothercontract.sol` en el mismo directorio que este contrato (eso es lo que significa `./`), será importado por el compilador.

# Vamos a probarlo

Ahora que tenemos una estructura de múltiples ficheros, necesitamos usar `import` para leer el contenido del otro fichero:

1. Importa `zombiefactory.sol` en nuestro nuevo fichero, `zombiefeeding.sol`. 
