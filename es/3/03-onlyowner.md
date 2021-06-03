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

        // Modify this function:
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
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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
      "ownable.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        /**
        * @title Ownable
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
        address private _owner;

        event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
        );

        /**
        * @dev El constructor Ownable establece a `owner` del contrato a la cuenta
        * remitente.
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
        * @dev Se lanza si es llamado por cualquier otra cuenta que no sea la del propietario.
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
        * No será posible llamar a las funciones con el modificador
        * `onlyOwner` más.
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
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      KittyInterface kittyContract;
      function setKittyContractAddress(address _address) external onlyOwner { kittyContract = KittyInterface(_address); }
      function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
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

    pragma solidity >=0.5.0 <0.6.0;
    
    /**
     * @title Ownable
     * @dev The Ownable contract has an owner address, and provides basic authorization control
     * functions, this simplifies the implementation of "user permissions".
     */
    contract Ownable {
      address private _owner;
    
      event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
      );
    
      /**
       * @dev El constructor Ownable establece el`owner` original del contrato a
       * la cuenta remitente.
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
       * @dev Se lanza si es llamado por alguien que no es el propietario.
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
       * @notice Renunciar a la propiedad dejará el contrato sin un propietario.
       * No será nunca más posible llamar a las funciones con el modificador `onlyOwner`.
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
    

Fíjate en el modificador `onlyOwner` en la función `renounceOwnership`. Cuando llamas a `renounceOwnership`, el código dentro de `onlyOwner` se ejecuta **primero**. Entonces cuando se encuentra con la sentencia `_;` en `onlyOwner`, vuelve y ejecuta el código dentro de `renounceOwnership`.

So while there are other ways you can use modifiers, one of the most common use-cases is to add a quick `require` check before a function executes.

En el caso de `onlyOwner`, añadiéndole este modificador a la función hace que **solo** el **dueño** del contrato (tú, si eres el que lo ha implementado) puede llamar a la función.

> Nota: Darle poderes especiales de esta manera al dueño a lo largo del contrato es usualmente necesario, pero puede también ser usado maliciosamente. Por ejemplo, el dueño puede añadir una función oculta ¡que le permita transferirse el zombi de cualquiera a sí mismo!
> 
> Así que es importante recordar que solo porque una DApp esté en Ethereum no significa automáticamente que sea descentralizada — tienes que leerte el código fuente completo para asegurarte que esté libre de poderes especiales controlados por su dueño que puedan ser potencialmente preocupantes. Hay un cuidadoso balance entre mantener el control sobre la DApp para poder arreglar los bugs potenciales, y construir una plataforma sin dueño donde tus usuarios puedan confiar la seguridad de sus datos.

## Vamos a probarlo

Ahora restringiremos el acceso a `setKittyContractAddress` de tal manera que sólo nosotros podamos modificarlo en un futuro.

1. Añade el modificador `onlyOwner` a `setKittyContractAddress`.