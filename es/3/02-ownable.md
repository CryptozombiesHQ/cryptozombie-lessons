---
title: Contratos Ownable
actions:
  - 'comprobarRespuesta'
  - 'pistas'
requireLogin: verdadero
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        // 1. Importalo aquí

        // 2. Inherit here:
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

        function _createZombie(string memory _name, uint _dna) internal {
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
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
        }

        }
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

        function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
        pragma solidity >=0.5.0 <0.6.0;

        /**
        * @title Ownable
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
        address public owner;

        event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
        );

        /**
        * @dev El constructor del Ownable establece al `owner` original del contrato.
        * a la dirección de la cuenta del remitente.
        */
        constructor() internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
        }

        /**
        * @devolver la dirección del propietario.
        */
        function owner() public view returns(address) {
        return _owner;
        }

        /**
        * @dev Se activa si lo llama cualquier cuenta que no sea el propietario.
        */
        modifier onlyOwner() {
        require(isOwner());
        _;
        }

        /**
        * @return true si `msg.sender` es el propietario del contrato.
        */
        function isOwner() public view returns(bool) {
        return msg.sender == _owner;
        }

        /**
        * @dev Permite al actual porpietario renunciar al control del contrato.
        * @notice Renunciar a la propiedad dejará el contrato sin un propietario.
        * No será posible llamar a las funciones con el `onlyOwner`
        * modificador más.
        */
        function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
        }

        /**
        * @dev Permite al actual propietario transferir el control del contrato a newOwner.
        * @param newOwner La dirección a transferir la posesión.
        */
        function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
        }

        /**
        * @dev Se transfiere el control del contrato a newOwner.
        * @param newOwner La dirección a transferir la posesión.
        */
        function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
        }
        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./ownable.sol";
      contract ZombieFactory is Ownable {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); randDna = randDna - randDna % 100; _createZombie(_name, randDna); }
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
    * @title Ownable
    * @dev El Contrato Ownable tiene una dirección de propietario, y ofrece funciones de control
    * permisos básicos, esto simplifica la implementación de "permisos de usuario".
     */
    contract Ownable {
      address private _owner;
    
      event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
      );
    
      /**
       * @dev El constructor Ownable establece al `owner` original del contrato.
       * a la dirección de la cuenta del remitente.
       */
      constructor() internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
      }
    
      /**
       * @return la dirección del propietario.
       */
      function owner() public view returns(address) {
        return _owner;
      }
    
      /**
       * @dev Se activa si alguien que no es el propietario.
       */
      modifier onlyOwner() {
        require(isOwner());
        _;
      }
    
      /**
       * @return true si `msg.sender` es el propietario del contrato.
       */
      function isOwner() public view returns(bool) {
        return msg.sender == _owner;
      }
    
      /**
       * @dev Permite al actual propietario renunciar al control del contrato.
       * @notice Renunciar a la propiedad del contrato dejaría el contrato sin un propietario.
       * No será nunca más posible llamar a las funciones con el modificador `onlyOwner`
       */
      function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
      }
    
      /**
       * @dev permite al actual propietario transferir el control del contrato a newOwner.
       * @param newOwner La dirección a transferir la propiedad.
       */
      function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
      }
    
      /**
       * @dev Se transfiere el control del contrato a newOwner.
       * @param newOwner La dirección a transferir la propiedad.
       */
      function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
      }
    }
    

Alguna de las cosas nuevas que no hemos visto todavía:

- Constructors: `constructor()` is a ***constructor***, which is an optional special function that has the same name as the contract. It will get executed only one time, when the contract is first created.
- Modificadores de Funciones: `modifier onlyOwner()`. Los modificadores son como semi-funciones que son usadas para modificar otras funciones, normalmente para comprobar algunos requisitos antes de la ejecución. En este caso, `onlyOwner` puede ser utilizada para limitar el acceso para que **solo** el **dueño** del contrato pueda ejecutar esta función. Hablaremos sobre los modificadores en el siguiente capítulo, y que hace ese extraño `_;`.
- Palabra clave `indexed`: no te preocupes por esto, no lo necesitaremos todavía.

Básicamente el contrato `Ownable` hace lo siguiente:

1. Cuando un contrato ha sido creado, su constructor establece el `owner` a `msg.sender` (la persona que lo ha implementado)

2. Añade el modificador `onlyOwner`, que puede restringir el acceso a solo el `owner` en una función

3. Permite transferir el contrato a un nuevo `owner`

`onlyOwner` es un requisito tan común que la mayoría de las DApps en Solidity suelen empezar con un copia/pega de este contrato `Ownable`, y después su primer contrato hereda de él.

Como queremos limitar el acceso de `setKittyContractAddress` a `onlyOwner`, vamos a hacer lo mismo para nuestro contrato.

## Vamos a probarlo

Hemos copiado el código del contrato `Ownable` en un nuevo fichero, `ownable.sol`. Vamos a continuar haciendo que `ZombieFactory` lo herede de él.

1. Modifica nuestro código para que haga un `import` del contenido de `ownable.sol`. Si no recuerdas como hacer esto echa un vistazo a `zombiefeeding.sol`.

2. Modifica el contrato `ZombieFactory` para que herede de `Ownable`. De nuevo, puedes echarle un ojo a `zombiefeeding.sol` si no recuerdas como lo hicimos.