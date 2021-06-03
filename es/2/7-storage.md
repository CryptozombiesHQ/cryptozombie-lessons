---
title: Storage vs Memory (Data location)
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

        // Start here

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
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; }
      }
---

In Solidity, there are two locations you can store variables — in `storage` and in `memory`.

***Storage*** se refiere a las variables guardadas permanentemente en la blockchain. Las variables de tipo ***Memory*** son temporales, y son borradas en lo que una función externa llama a tu contrato. Piensa que es como el disco duro vs la RAM de tu ordenador.

La mayoría del tiempo no necesitas usar estas palabras claves ya que Solidity las controla por defecto. Las variables de estado (variables declaradas fuera de las funciones) son por defecto del tipo `storage` y son guardadas permanentemente en la blockchain, mientras que las variables declaradas dentro de las funciones son por defecto del tipo `memory` y desaparecerán una vez cuando la llamada a la función termine.

Sin embargo, hay momentos en los que necesitas usar estas palabras clave, concretamente cuando estés trabajando con ***structs*** y ***arrays*** dentro de las funciones:

    contract SandwichFactory {
      struct Sandwich {
        string name;
        string status;
      }
    
      Sandwich[] sandwiches;
    
      function eatSandwich(uint _index) public {
        // Sandwich mySandwich = sandwiches[_index];
    
        // ^ Parece algo sencillo, pero solidity te dará un warning
        // diciendote que deberías declararlo `storage` o `memory`.
    
        // De modo que deberias declararlo como `storage`, así:
        Sandwich storage mySandwich = sandwiches[_index];
        // ...donde `mySandwich` es un apuntador a `sandwiches[_index]`
        // de tipo storage, y...
        mySandwich.status = "Eaten!";
        // ...esto cambiará permanentemente `sandwiches[_index]` en la blockchain.
    
        // Si solo quieres una copia, puedes usar `memory`:
        Sandwich memory anotherSandwich = sandwiches[_index + 1];
        // ...donde `anotherSandwich` seria una simple copia de
        // los datos en memoria, y...
        anotherSandwich.status = "Eaten!";
        // ...modificará la variable temporal y no tendrá efecto
        // en`sandwiches[_index + 1]`. Pero puedes hacer esto:
        sandwiches[_index + 1] = anotherSandwich;
        // ...si deseas copiar los cambios nuevamente en el almacenamiento en la blockchain.
      }
    }
    

No te preocupes si no has entendido del todo como usar esto — durante este tutorial te diremos cuándo usar `storage` y cuándo usar `memory`, y el compilador de Solidity también te dará advertencias para hacerte saber cuando usar cada una de estas palabras clave.

¡Por ahora, es suficiente con que entiendas en que caso necesitarás usar explícitamente `storage` o `memory`!

# Vamos a probarlo

¡Es hora de dar a nuestros zombis la posibilidad de alimentarse y multiplicarse!

Cuando un zombi se alimente de otras formas de vida, su ADN se combinará con el ADN de la otra forma de vida creando un nuevo zombi.

1. Crea una función llamada `feedAndMultiply`. Recibirá dos parámetros: `_zombieId` (un `uint`) y `_targetDna` (también un `uint`). Está función deberá ser `public`.

2. We don't want to let someone else feed our zombie! Así que primero, vamos a comprobar que somos dueños de ese zombi. Add a `require` statement to verify that `msg.sender` is equal to this zombie's owner (similar to how we did in the `createRandomZombie` function).
    
    > Nota: De nuevo, como nuestro corrector de respuestas es primitivo, espera que `msg.sender` venga primero y marcará como respuesta incorrecta si cambias el orden. Pero normalmente cuando programes, podrás utilizar el orden que tu quieras — ambos son correctos.

3. Vamos a necesitar obtener el ADN de este zombi. Así que lo próximo que nuestra función debería hacer es declarar un `Zombie` local llamado `myZombie` (que deberá ser un puntero del tipo `storage`). Coloca esta variable para que sea igual que el índice `_zombieId` de nuestro array `zombies`.

Deberías tener 4 líneas de código hasta ahora, incluyendo la línea de fin de la función `}`.

¡Continuaremos rellenando esta función en el siguiente capítulo!