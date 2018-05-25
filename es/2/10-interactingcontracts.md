---
title: '¿Qué Comen Los Zombis?'
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
        
        // Crea la KittyInterface aquí
        
        contract ZombieFeeding is ZombieFactory {
        
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        _createZombie("NoName", newDna);
        }
        
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
        
        function _createZombie(string _name, uint _dna) internal {
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
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      }
---
¡Es hora de alimentar a nuestros zombis! Y ¿Qué es lo que más les gusta comer?

Bueno lo que pasa es que a los CryptoZombies les encanta comer...

**¡CryptoKitties!** 

(Si, es enserio 

Para hacer esto necesitamos leer el kittyDna de el contrato inteligente de los CryptoKitties. Podemos hacer eso debido a que los datos de los CryptoKitties guardados en la blockchain son públicos. ¡¿No es blockchain genial?!

No te preocupes - nuestro juego aún no va a hacer dañor a ningún CryptoKitty. Solo vamos a *leer* los datos de los CryptoKitties, no podemos borrarlos 

## Interactuando con otros contratos

Para que nuestro contrato pueda hablar a otro contrato de la blockchain que no poseemos, necesitamos definir una ***interfaz***.

Vamos a ver un simple ejemplo. Digamos que hay un contrato en la blockchain que se veía así:

    contract LuckyNumber {
      mapping(address => uint) numbers;
    
      function setNum(uint _num) public {
        numbers[msg.sender] = _num;
      }
    
      function getNum(address _myAddress) public view returns (uint) {
        return numbers[_myAddress];
      }
    }
    

Este sería un simple contrato donde cualquiera puede guardar su número de la suerte, y este estará asociado a su dirección de Ethereum. De esta forma cualquiera podría ver el número de la suerte de una persona usando su dirección.

Now let's say we had an external contract that wanted to read the data in this contract using the `getNum` function.

First we'd have to define an ***interface*** of the `LuckyNumber` contract:

    contract NumberInterface {
      function getNum(address _myAddress) public view returns (uint);
    }
    

Notice that this looks like defining a contract, with a few differences. For one, we're only declaring the functions we want to interact with — in this case `getNum` — and we don't mention any of the other functions or state variables.

Secondly, we're not defining the function bodies. Instead of curly braces (`{` and `}`), we're simply ending the function declaration with a semi-colon (`;`).

So it kind of looks like a contract skeleton. This is how the compiler knows it's an interface.

By including this interface in our dapp's code our contract knows what the other contract's functions look like, how to call them, and what sort of response to expect.

We'll get into actually calling the other contract's functions in the next lesson, but for now let's declare our interface for the CryptoKitties contract.

# Put it to the test

We've looked up the CryptoKitties source code for you, and found a function called `getKitty` that returns all the kitty's data, including its "genes" (which is what our zombie game needs to form a new zombie!).

The function looks like this:

    function getKitty(uint256 _id) external view returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    ) {
        Kitty storage kit = kitties[_id];
    
        // if this variable is 0 then it's not gestating
        isGestating = (kit.siringWithId != 0);
        isReady = (kit.cooldownEndBlock <= block.number);
        cooldownIndex = uint256(kit.cooldownIndex);
        nextActionAt = uint256(kit.cooldownEndBlock);
        siringWithId = uint256(kit.siringWithId);
        birthTime = uint256(kit.birthTime);
        matronId = uint256(kit.matronId);
        sireId = uint256(kit.sireId);
        generation = uint256(kit.generation);
        genes = kit.genes;
    }
    

The function looks a bit different than we're used to. You can see it returns... a bunch of different values. If you're coming from a programming language like Javascript, this is different — in Solidity you can return more than one value from a function.

Now that we know what this function looks like, we can use it to create an interface:

1. Define an interface called `KittyInterface`. Remember, this looks just like creating a new contract — we use the `contract` keyword.

2. Inside the interface, define the function `getKitty` (which should be a copy/paste of the function above, but with a semi-colon after the `returns` statement, instead of everything inside the curly braces.