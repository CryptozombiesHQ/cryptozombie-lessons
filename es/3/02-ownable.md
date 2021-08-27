---
title: Contratos Apropiables
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

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
                emit NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

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
        pragma solidity ^0.4.25;
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public _owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
           constructor() internal {
             _owner = msg.sender;
             emit OwnershipTransferred(address(0), _owner)
           }
          /**
          * @return the address of the owner.
          */
          function owner() public view returns(address) {
            return _owner;
          }

          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(isOwner());
            _;
          }

           /**
          * @return true if `msg.sender` is the owner of the contract.
          */
          function isOwner() public view returns(bool) {
            return msg.sender == _owner;
          }
          
            /**
          * @dev Allows the current owner to relinquish control of the contract.
          * @notice Renouncing to ownership will leave the contract without an owner.
          * It will not be possible to call the functions with the `onlyOwner`
          * modifier anymore.
          */
          function renounceOwnership() public onlyOwner {
            emit OwnershipTransferred(_owner, address(0));
            _owner = address(0);
          }

          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {  
            _transferOwnership(newOwner);
          }

          /**
          * @dev Transfers control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function _transferOwnership(address newOwner) internal {
            require(newOwner != address(0));
            emit OwnershipTransferred(_owner, newOwner);
            _owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.25;

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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              randDna = randDna - randDna % 100;
              _createZombie(_name, randDna);
          }

      }
---

¿Has encontrado el agujero de seguridad en el capítulo anterior?

¡`setKittyContractAddress` es `external`, así que todo el mundo la puede ejecutar! Eso significa que cualquiera que llame a la función podrá cambiar la dirección del contrato de CryptoKitties, y romper nuestra aplicación para todos sus usuarios.

Queremos tener el poder de actualizar esa dirección en nuestro contrato, pero no queremos que todo el mundo sea capaz de hacerlo.

Para manejar casos como este, una práctica emergente común es hacer el contrato `Ownable` — significa que tiene un dueño (tú) con privilegios especiales.

## Contrato `Ownable` de OpenZeppelin

Abajo está el contrato `Ownable` definido en la librería Solidity de **_OpenZeppelin_**. OpenZeppelin es una librería segura donde hay contratos inteligentes para utilizar en tus propias DApps revisados por la comunidad. Despues de esta lección, mientras esperas ansiosamente la liberación de la Lección 4, ¡te recomendamos encarecidamente que visites su sitio web para fomentar tu aprendizaje!

Échale un vistazo al contrato más abajo. Vas a ver algunas cosas que no hemos aprendido aún, pero no te preocupes, hablaremos de ellas más adelante.

```
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
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() internal {
    _owner = msg.sender;
    emit OwnershipTransferred(address(0), _owner);
  }

  /**
   * @return the address of the owner.
   */
  function owner() public view returns(address) {
    return _owner;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  /**
   * @return true if `msg.sender` is the owner of the contract.
   */
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}
```

Alguna de las cosas que no hemos visto todavía:

- Constructores: `function Ownable()` es un **_constructor_**, que es una función especial opcional que tiene el mismo nombre que el contrato. Será ejecutada una única vez, cuando el contrato sea creado por primera vez.
- Modificadores de Funciones: `modifier onlyOwner()`. Los modificadores son como semifunciones que son usadas para modificar otras funciones, normalmente para comprobar algunos requisitos antes de la ejecución. En este caso, `onlyOwner` puede ser usada para limitar el acceso y que **solo** el **dueño** del contrato pueda ejecutar función. Hablaremos sobre los modificadores en el siguiente capítulo, y que hace ese extraño `_;`.
- Palabra clave `indexed`: no te preocupes por esto, no lo necesitamos todavía.

Basicamente `Ownable` hace lo siguiente:

1. Cuando el contrato ha sido creado, su constructor inicializa `owner` con `msg.sender` (la persona que lo ha implementado)

2. Añade el modificador `onlyOwner`, que puede restringir el acceso a solo el `owner` en una función.

3. Permite transferir el contrato a un nuevo `owner`.

`onlyOwner` es un requisito tan común que la mayoría de las DApps en Solidity suelen empezar con un copia/pega de este contrato `Ownable`, y después su primer contrato heredaría de él.

Como queremos limitar el acceso de `setKittyContractAddress` a `onlyOwner`, vamos a hacer lo mismo para nuestro contrato.

## Vamos a probarlo

Hemos copiado el código del contrato `Ownable` en un nuevo fichero, `ownable.sol`. Vamos a continuar haciendo que `ZombieFactory` lo herede.

1. Modifica nuestro código para que haga un `import` del contenido de `ownable.sol`. Si no recuerdas como hacer esto echa un vistazo a `zombiefeeding.sol`.

2. Modifica el contrato `ZombieFactory` para que herede de `Ownable`. De nuevo, puedes echarle un ojo a `zombiefeeding.sol` si no recuerdas como lo hicimos.
