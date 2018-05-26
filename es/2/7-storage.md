---
title: Almacenamiento vs Memoria
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefactory.sol";
        
        contract ZombieFeeding is ZombieFactory {
        
        // Iniciar aquí
        
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
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; }
      }
---
En Solidity, hay dos lugares donde puedes guardar variables — en `storage` (almacenamiento) y en `memory` (memoria).

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

When a zombie feeds on some other lifeform, its DNA will combine with the other lifeform's DNA to create a new zombie.

1. Create a function called `feedAndMultiply`. It will take two parameters: `_zombieId` (a `uint`) and `_targetDna` (also a `uint`). This function should be `public`.

2. We don't want to let someone else feed using our zombie! So first, let's make sure we own this zombie. Add a `require` statement to make sure `msg.sender` is equal to this zombie's owner (similar to how we did in the `createRandomZombie` function).
    
    > Note: Again, because our answer-checker is primitive, it's expecting `msg.sender` to come first and will mark it wrong if you switch the order. But normally when you're coding, you can use whichever order you prefer — both are correct.

3. We're going to need to get this zombie's DNA. So the next thing our function should do is declare a local `Zombie` named `myZombie` (which will be a `storage` pointer). Set this variable to be equal to index `_zombieId` in our `zombies` array.

You should have 4 lines of code so far, including the line with the closing `}`.

We'll continue fleshing out this function in the next chapter!