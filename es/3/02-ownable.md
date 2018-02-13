---
titulo: Contratos Propios
acciones: ['checkAnswer', 'hints']
requiereSesión: true
material:
  editor:
    lenguaje: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Importar aquí

        // 2. Heredar aquí:
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
         * @titulo Propio
         * @dev El contrato Propio tiene una dirección de propietario, y provee funciones basicas de control de
         * autorización, esto simplifica la implementación de "permisos de usuario".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev El constructor propio define al propietario `original` del contrato a la cuenta del
           * remitente.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Surge si es llamada por una cuenta que no sea la del propietario.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Permite que el propietario actual transfiera el control del contrato a un nuevoPropietario.
           * @param nuevoPropietario La dirección a la cual se transfiere la propiedad.
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
---

Notaste la falla de seguridad en el capitulo anterior?

`setKittyContractAddress` es `externa`, asi que nadie puede llamarla! Eso significa que cualquiera que llamé la función puede cambiar la dirección del contrato de los CryptoKitties, y destruir la aplicación.

Queremos la abilidad para actualizar esta dirección en nuestro contrato, pero no queremos que todos puedan hacerlo.

Para manejar casos como este, una practica común que ha surgido es hacer los `Propios` a los contratos — lo cual quiere decir que tienen un dueño (tu) el cual posee privilegios especiales.

## Contrato `Propio` de OpenZeppelin

Mas abajo está el contrato `Propio` tomado de la biblioteca **_OpenZeppelin_** de Solidity. OpenZeppelin es una biblioteca de contratos inteligentes seguros y desarrollados por la comunidad que puedes usar en tus propias DApps. Luego de esta leción, mientras esperas ansiosamente el lanzamiento de la Lección 4, te recomendamos que te pases por su sitio para su aprendizaje posterior!

Lee el contrato que está mas abajo. Verás unas cuantas cosas que aun no hemos aprendido, pero no te preocupes, hablaremos de ellas mas adelante.

```
/**
 * @titulo Propio
 * @dev El contrato propio tiene una dirección de propietario, y provee funciones básicas de control
 * de autorización, esto simplifica la implementación de los "permisos de usuario".
 */
contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev EL constructor propio define el `propietario` original del contrato la cuenta del
   * remitente.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Surge si es llamada por una cuenta que no sea la del dueño.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Permite que el propietario actual transfiera el control del contrato a un nuevoPropietario.
   * @param nuevoPropietario La dirección a la cual se transfiere la propiedad.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
```

Algunas cosas que no hemos visto hasta ahora:

- Constructores: `función de propietario()` es un **_constructor_**, que es una función especial funcional que tiene el mismo nombre que el contrato. Será ejecutado solo una vez, cuando el contrato es inicialmente creado.
- Modificadores de Funciones: `modificador soloPropietario()`. Los modificadores son una especie de medias-funciones que son usadas para modiicar otras funciones, usualmente para revisar algunos requisitos previos a la ejecución. En este caso, `soloPropietario` puede ser usado para limitar el acceso para que **solo** el **propietario** del contrato pueda ejecutar esta función. Hablaremos mas de los modificadores de funciones en el siguiente capitulo, y de lo que ese extraño `_;` hace.
- `indexed`: no te preocupes por esto, no lo necesitamos todavía.

Así que el contrato `Propietario` basicamente hace lo siguiente:

1. Cuando un contrato es creado, su constructor define el `propietario` a `msg.sender` (la persona que lo implementó)

2. Agrega un modificador `soloPropietario`, el cual restringe el acceso a ciertas funciones para que solo el `Propietario` pueda acceder a ellas.

3. Te permite transferir el contrato a un nuevo `propietario`

`soloPropietario` es un requisito tan común para los contratos que casi todas las DApps de Solidity inician con un copiar/pegar de este contrato `Propio`, y luego, su primer contrato lo hereda de el.

Ya que queremos limitar el `setKittyContractAddress` a `soloPropietario`, haremos lo mismo para nuestro contrato.

## Pongamoslo a prueba

Hemos avanzado y copiado el codigo del contrato `Propio` en un archivo nuevo, `propio.sol`. Avancemos y hagamos que `ZombieFactory` lo herede de el.

1. Modifica nuestro codigo para `importar` los contenidos de `propio.sol`. Si no recuerdas como hacerlo, echale un vistazo a `zombiefeeding.sol`.

2. Modifica el contrato de `ZombieFactory` para que herede de `Propio`. Nuevamente, puedes echarle un vistazo a `zombiefeeding.sol` si no recuerdes como se hace.
