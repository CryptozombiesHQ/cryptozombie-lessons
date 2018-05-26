---
title: Contratos Apropiables
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
        
        // 1. Importalo aquí
        
        // 2. Heredalo aquí:
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
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); randDna = randDna - randDna % 100; _createZombie(_name, randDna); }
      }
---
¿Has encontrado el agujero de seguridad en el capítulo anterior?

¡`setKittyContractAddress` es `external`, así que cualquiera la puede llamar! Eso significa que cualquiera que haya llamado a la función podría cambiar la dirección del contrato de CryptoKitties, y romper nuestra aplicación para todos sus usuarios.

Queremos tener la habilidad de actualizar esa dirección en nuestro contrato, pero no queremos que todo el mundo sea capaz de hacerlo.

Para manejar casos como este, una práctica emergente común es hacer el contrato `Ownable` — significa que tiene un dueño (tú) con privilegios especiales.

## Contrato `Ownable` de OpenZeppelin

Abajo está el contrato `Ownable` definido en la libreria Solidity de ***OpenZeppelin***. OpenZeppelin es una libreria segura donde hay contratos inteligentes para utilizar en tus propias DApps revisados por la comunidad. Después de esta lección, ¡te recomendamos que visites su sitio web para fomentar tu aprendizaje!

Échale un vistazo al contrato más abajo. Vas a ver algunas cosas que no hemos aprendido aún, pero no te preocupes, hablaremos de ellas más adelante.

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
    

Alguna de las cosas nuevas que no hemos visto todavía:

- Constructores: `function Ownable()`` es un ***constructor***, el cual es una función especial opcional que tiene el mismo nombre que el contrato. Será ejecutada una sóla vez, cuando el contrato sea creado por primera vez.
- Modificadores de Funciones: `modifier onlyOwner()`. Los modificadores son como semi-funciones que son usadas para modificar otras funciones, normalmente para comprobar algunos requisitos antes de la ejecución. En este caso, `onlyOwner` puede ser utilizada para limitar el acceso para que **solo** el **dueño** del contrato pueda ejecutar esta función. Hablaremos sobre los modificadores en el siguiente capítulo, y que hace ese extraño `_;`.
- Palabra clave `indexed`: no te preocupes por esto, no lo necesitaremos todavía.

Básicamente el contrato `Ownable` hace lo siguiente:

1. Cuando un contrato ha sido creado, su constructor establece el `owner` a `msg.sender` (la persona que lo ha implementado)

2. Añade el modificador `onlyOwner`, que puede restringir el acceso a solo el `owner` en una función

3. It allows you to transfer the contract to a new `owner`

`onlyOwner` is such a common requirement for contracts that most Solidity DApps start with a copy/paste of this `Ownable` contract, and then their first contract inherits from it.

Since we want to limit `setKittyContractAddress` to `onlyOwner`, we're going to do the same for our contract.

## Put it to the test

We've gone ahead and copied the code of the `Ownable` contract into a new file, `ownable.sol`. Let's go ahead and make `ZombieFactory` inherit from it.

1. Modify our code to `import` the contents of `ownable.sol`. If you don't remember how to do this take a look at `zombiefeeding.sol`.

2. Modify the `ZombieFactory` contract to inherit from `Ownable`. Again, you can take a look at `zombiefeeding.sol` if you don't remember how this is done.