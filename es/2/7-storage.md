---
title: Storage vs Memory
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Empieza aquí

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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

En Solidity, hay dos sitios donde puedes guardar variables - en `storage` y en `memory`.

**_Storage_** se refiere a las variables guardadas permanentemente en la blockchain. Las variables de tipo **_memory_** son temporales, y son borradas en lo que una función externa llama a tu contrato. Piensa que es como el disco duro vs la RAM de tu ordenador.

La mayoría del tiempo no necesitas usar estas palabras clave ya que Solidity las controla por defecto. Las variables de estado (variables declaradas fuera de las funciones) son por defecto del tipo `storage` y son guardadas permanentemente en la blockchain, mientras que las variables declaradas dentro de las funciones son por defecto del tipo `memory` y desaparecerán una vez la llamada a la función haya terminado.

Aun así, hay momentos en los que necesitas usar estas palabras clave, concretamente cuando estes trabajando con **_structs_** y **_arrays_** dentro de las funciones:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Parece algo sencillo, pero solidity te dará un warning
    // diciendo que deberías declararlo `storage` o `memory`.

    // De modo que deberias declararlo como `storage`, así:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...donde `mySandwich` es un apuntador a `sandwiches[_index]`
    // de tipo storage, y...
    mySandwich.status = "Eaten!";
    // ...esto cambiará permanentemente `sandwiches[_index]` en la blockchain.

    // Si únicamente quieres una copia, puedes usar `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...donde `anotherSandwich` seria una simple copia de 
    // los datos en memoria, y...
    anotherSandwich.status = "Eaten!";
    // ...modificará la variable temporal y no tendrá efecto
    // en `sandwiches[_index + 1]`. Pero puedes hacer lo siguiente:
    sandwiches[_index + 1] = anotherSandwich;
    // ...si quieres que la copia con los cambios se guarde en la blockchain.
  }
}
```

No te preocupes si no has entendido del todo como usar esto - durante este tutorial te diremos cuándo usar `storage` y cuándo usar `memory`, y el compilador de Solidity también te dará advertencias para hacerte saber cuando usar cada una de estas palabras clave.

¡Por ahora, es suficiente con que entiendas en que caso necesitarás usar explícitamente `storage` o `memory`!

# Vamos a probarlo

¡Es hora de dar a nuestros zombis la posibilidad de alimentarse y multiplicarse!

Cuando un zombi se alimente de otras formas de vida, su ADN se combinará con el ADN de la otra forma de vida creando un nuevo zombi.

1. Crear una función llamada `feedAndMultiply`. Recibirá dos parámetros: `_zombieId` (un `uint`) y `_targetDna` (también un `uint`). Esta función debería ser `public`.

2. ¡No queremos que cualquier persona se alimente usando nuestro zombi! Así que primero, vamos a comprobar que somos dueños de ese zombi. Añade una sentencia `require` para asegurar que `msg.sender` es igual al dueño del zombi (similar a como lo hicimos en la función `createPseudoRandomZombie`).

 > Nota: De nuevo, como nuestro corrector de respuestas es primitivo, espera que `msg.sender` venga primero y marcará como respuesta incorrecta si cambias el orden. Pero normalmente cuando programes, podrás utilizar el orden que tu quieras - ambos son correctos.

3. Vamos a necesitar obtener el ADN de este zombi. Así que lo próximo que nuestra función debería hacer es declarar un `Zombie` localmente llamado `myZombie` (que deberá ser un puntero del tipo `storage`). Inicializa esta variable para que sea igual que el índice `_zombieId` de nuestro array `zombies`.

Deberás tener unas 4 líneas de código, incluyendo la línea de fín de la función `}`. 

¡Continuaremos rellenando esta función en el siguiente capítulo!
