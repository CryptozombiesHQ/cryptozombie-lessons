---
title: Unidades de Tiempo
actions:
  - 'comprobarRespuesta'
  - 'pistas'
requireLogin: verdadero
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;
        
        import "./ownable.sol";
        
        contract ZombieFactory is Ownable {
        
        event NewZombie(uint zombieId, string name, uint dna);
        
        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        // 1. Define `cooldownTime` aquí
        
        struct Zombie {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        }
        
        Zombie[] public zombies;
        
        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;
        
        function _createZombie(string _name, uint _dna) internal {
        // 2. Actualiza la siguiente línea:
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
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
        }
        
        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefactory.sol";
        
        contract KittyInterface {
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
        );
        }
        
        contract ZombieFeeding is ZombieFactory {
        
        KittyInterface kittyContract;
        
        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }
        
        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(_species) == keccak256("kitty")) {
        newDna = newDna - newDna % 100 + 99;
        }
        _createZombie("NoName", newDna);
        }
        
        function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        feedAndMultiply(_zombieId, kittyDna, "kitty");
        }
        
        }
      "ownable.sol": |
        /**
        * @title Apropiable
        * @dev El Contraro Apropiable tiene una dirección de propietario, y proporciona un control de autorización básico
        * funciones, esto simplifica la implementación de "permisos de usuario".
        */
        contract Ownable {
        address public owner;
        
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        
        /**
        * @dev El constructor del contrato apropiable establece el `propietario` original del contrato para el remitente
        * account.
        */
        function Ownable() public {
        owner = msg.sender;
        }
        
        /**
        * @dev Lo arroja si lo llama cualquier cuenta que no sea el propietario.
        */
        modifier onlyOwner() {
        require(msg.sender == owner);
        _;
        }
        
        /**
        * @dev Permite al propietario actual transferir el control del contrato a un newOwner (nuevo propietario).
        * @param newOwner La dirección para transferir la propiedad a.
        */
        function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./ownable.sol";
      contract ZombieFactory is Ownable {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits; uint cooldownTime = 1 days;
      struct Zombie { string name; uint dna; uint32 level; uint32 readyTime; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); randDna = randDna - randDna % 100; _createZombie(_name, randDna); }
      }
---
La propiedad `level` es auto-explicativa. Más adelante, cuando creemos el sistema de batalla, los zombis que ganen más batallas subirán de nivel y tendrán acceso a más habilidades.

La propiedad `readyTime` requiere algo más de explicación. El objetivo es añadir un "periodo de enfriamiento", una cantidad de tiempo que el zombi debe esperar después de atacar o alimentarse antes de poder volver a hacerlo. Sin esto, el zombi podría atacar y multiplicarse 1.000 veces al día, lo que haría muy fácil el juego.

Para controlar el tiempo que necesita esperar un zombi antes de volver a atacar, podemos usar las unidades de tiempo de Solidity.

## Unidades de Tiempo

Solidity proporciona algunas unidades nativas para trabajar con el tiempo.

La variable `now` devolverá el actual tiempo unix (la cantidad de segundos que han pasado desde el 1 de Enero de 1970). El tiempo unix cuando escribía esto es `1515527488`.

> Nota: El tiempo unix es tradicionalmente guardado en un número de 32 bits. Esto nos llevará a el problema del "Año 2038", donde las variables timestamp de tipo unix desbordarán y dejará inservibles muchos sistemas antiguos. Así que si queremos que nuestra DApp siga funcionando después de 20 años, podemos usar un número de 64 bits — pero mientras nuestros usuarios tendrán que gastar más gas para usar nuestra DApp. ¡Decisiones de diseño!

Solidity también contiene `segundos`, `minutos`, `horas`, `días`, `semanas` y `años` como unidades de tiempo. These will convert to a `uint` of the number of seconds in that length of time. So `1 minutes` is `60`, `1 hours` is `3600` (60 seconds x 60 minutes), `1 days` is `86400` (24 hours x 60 minutes x 60 seconds), etc.

Here's an example of how these time units can be useful:

    uint lastUpdated;
    
    // Set `lastUpdated` to `now`
    function updateTimestamp() public {
      lastUpdated = now;
    }
    
    // Will return `true` if 5 minutes have passed since `updateTimestamp` was 
    // called, `false` if 5 minutes have not passed
    function fiveMinutesHavePassed() public view returns (bool) {
      return (now >= (lastUpdated + 5 minutes));
    }
    

We can use these time units for our Zombie `cooldown` feature.

## Put it to the test

Let's add a cooldown time to our DApp, and make it so zombies have to wait **1 day** after attacking or feeding to attack again.

1. Declare a `uint` called `cooldownTime`, and set it equal to `1 days`. (Forgive the poor grammar — if you set it equal to "1 day", it won't compile!)

2. Since we added a `level` and `readyTime` to our `Zombie` struct in the previous chapter, we need to update `_createZombie()` to use the correct number of arguments when we create a new `Zombie` struct.
    
    Update the `zombies.push` line of code to add 2 more arguments: `1` (for `level`), and `uint32(now + cooldownTime)` (for `readyTime`).

> Note: The `uint32(...)` is necessary because `now` returns a `uint256` by default. So we need to explicitly convert it to a `uint32`.

`now + cooldownTime` will equal the current unix timestamp (in seconds) plus the number of seconds in 1 day — which will equal the unix timestamp 1 day from now. Later we can compare to see if this zombie's `readyTime` is greater than `now` to see if enough time has passed to use the zombie again.

We'll implement the functionality to limit actions based on `readyTime` in the next chapter.