---
title: Modificador de Función onlyOwner
actions:
  - 'comprobarRespuesta'
  - 'pistas'
requireLogin: verdadero
material:
  editor:
    language: sol
    startingCode:
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
        
        // Modifica esta función:
        function setKittyContractAddress(address _address) external {
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
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;
        
        import "./ownable.sol";
        
        contract ZombieFactory is Ownable {
        
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
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
        }
        
        }
      "ownable.sol": |
        /**
        * @title Ownable
        * @dev El Contrato Ownable tiene una dirección de propietario, y ofrece funciones de control
        * permisos básicos, esto simplifica la implementación de "permisos de usuario".
        */
        contract Ownable {
        address public owner;
        
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        
        /**
        * @dev El constructor del Ownable establece al `owner` (propietario) original del contrato.
        * a la dirección de la cuenta del remitente.
        */
        function Ownable() public {
        owner = msg.sender;
        }
        
        
        /**
        * @dev Abandonar si es llamado por una cuenta que no sea el `owner`.
        */
        modifier onlyOwner() {
        require(msg.sender == owner);
        _;
        }
        
        
        /**
        * @dev Permite al propietario actual transferir el control del contrato a un newOwner (nuevo propietario).
        * @param newOwner La dirección del nuevo propietario.
        */
        function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      KittyInterface kittyContract;
      function setKittyContractAddress(address _address) external onlyOwner { kittyContract = KittyInterface(_address); }
      function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(_species) == keccak256("kitty")) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---
Ahora que nuestro contrato base `ZombieFactory` hereda de `Ownable`, podemos usar también el modificador de función `onlyOwner` en la función `ZombieFeeding`.

Esto es por como funciona la herencia de contratos. Recuerda:

    ZombieFeeding es ZombieFactory
    ZombieFactory es Ownable
    

Como `ZombieFeeding` es también `Ownable`, puedes acceder a las funciones / eventos / modificadores del contrato `Ownable`. Esto se aplica a cualquier contrato que en el futuro herede de `ZombieFeeding`.

## Modificadores de Funciones

Un modificador de función es igual que una función, pero usa la palabra clave `modifier` en lugar de `function`. Pero no puede ser llamado directamente como una función —  en vez de eso, podemos añadirle el nombre del modificador al final de la definición de la función para cambiar el comportamiento de ella.

Vamos a verlo con más detalle examinando `onlyOwner`:

    /**
     * @dev Lo arroja si lo llama cualquier cuenta que no sea el propietario.
    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
    

Tendríamos que usar el modificador de esta manera:

    contract MyContract is Ownable {
      event LaughManiacally(string laughter);
    
      // Mira como se usa `onlyOwner` debajo:
      function likeABoss() external onlyOwner {
        LaughManiacally("Muahahahaha");
      }
    }
    

Observa el modificador `onlyOwner` en la función `likeABoss`. Cuando llamas a `likeABoss`, el código dentro de `onlyOwner` se ejecuta **primero**. Entonces cuando se encuentra con la sentencia `_;` en `onlyOwner`, vuelve y ejecuta el código dentro de `likeABoss`.

Hay otras maneras de usar los modificadores, uno de los casos de uso mas comunes es añadir una rápida comprobación `require` antes de que se ejecute la función.

En el caso de `onlyOwner`, añadiéndole este modificador a la función hace que **solo** el **dueño** del contrato (tú, si eres el que lo ha implementado) puede llamar a la función.

> Nota: Darle poderes especiales de esta manera al dueño a lo largo del contrato es usualmente necesario, pero puede también ser usado maliciosamente. Por ejemplo, el dueño puede añadir una función oculta ¡que le permita transferirse el zombi de cualquiera a sí mismo!
> 
> Así que es importante recordar que solo porque una DApp esté en Ethereum no significa automáticamente que sea descentralizada — tienes que leerte el código fuente completo para asegurarte que esté libre de poderes especiales controlados por su dueño que puedan ser potencialmente preocupantes. Hay un cuidadoso balance entre mantener el control sobre la DApp para poder arreglar los bugs potenciales, y construir una plataforma sin dueño donde tus usuarios puedan confiar la seguridad de sus datos.

## Vamos a probarlo

Ahora restringiremos el acceso a `setKittyContractAddress` de tal manera que sólo nosotros podamos modificarlo en un futuro.

1. Añade el modificador `onlyOwner` a `setKittyContractAddress`.