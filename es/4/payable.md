---
title: Pagable
actions:
  - checkAnswer
  - hints
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      zombiehelper.sol: |
        pragma solidity ^0.4.25;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          // 1. Define el levelUpFee aqui

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Inserta la funcion LevelUp aquí

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
          }

        }
      zombiefeeding.sol: |
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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }
        }
      zombiefactory.sol: |
        pragma solidity ^0.4.25;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

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
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      ownable.sol: |
        pragma solidity ^0.4.25;

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
    answer: |
      pragma solidity ^0.4.25;
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

Hasta ahora, hemos cubierto varios **_function modifiers_**. Puede resultar difícil tratar de recordar todo, así que hagamos un breve repaso:

1. Tenemos modificadores de visibilidad que controlan cuándo y desde dónde puede ser llamada la función: `private` significa que sólo puede ser llamada desde otras funciones dentro del contrato; `internal` es como `private` pero también puede ser llamada por contratos que hereden desde este; `external` sólo puede ser llamada desde afuera del contrato; y finalmente `public` puede ser llamada desde cualquier lugar, tanto internamente como externamente.

2. También tenemos modificadores de estado, que nos dicen cómo interactúa la función con BlockChain: `view` nos dice que al ejecutar la función, no se guardará/cambiará ningún dato. `pure` nos indica que la función no solo no guarda ningún dato en la blockchain, sino que tampoco lee ningún dato de la blockchain. Ambos no cuestan nada de gas para llamar si son llamados externamente desde afuera del contrato (pero si tienen costo si son llamados internamente por otra función).

3. Luego tenemos modificadores personalizados, que aprendimos en la Lección 3: `onlyOwner` y `aboveLevel`, por ejemplo. Para estos podemos definir la lógica personalizada para determinar cómo afectan a una función.

Estos modificadores pueden ser apilados juntos en una definición de función de la siguiente manera:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

En este capítulo, introduciremos un modificador de función más: `payable`.

## El Modificador `payable`

Las funciones `payable` son parte de lo que hacen de Solidity y Ethereum algo tan genial — son un tipo de función especial que pueden recibir Ether.

Deja que eso se asimile por un minuto. Cuando llamas una función API en un servidor web normal, no puedes enviar dólares (USD$) junto con tu llamada de función — ni tampoco puedes enviar Bitcoin.

Pero en Ethereum, debido a que tanto el dinero (_Ether_), los datos (_transaction payload_) y el mismo código de contrato viven en Ethereum, es posible llamar a una función **y** pagar dinero al contrato al mismo tiempo.

Esto permite una lógica realmente interesante, como exigir un determinado pago al contrato para poder ejecutar una función.

## Veámoslo en un ejemplo

```
contract OnlineStore {
  function buySomething() external payable {
    // Verifique para asegurarse que se haya enviado 0.001 ether a la llamada de función:
    require(msg.value == 0.001 ether);
    // Si es así, alguna lógica para transferir el elemento digital a quien llama a la función:
    transferThing(msg.sender);
  }
}
```

Aquí, "msg.value" es una forma de ver cuánto Ether se envió al contrato, y "ether" es una unidad integrada.

Lo que sucede aquí es que alguien llamaría a la función desde web3.js (desde la interfaz JavaScript de la DApp) de la siguiente manera:

```
// Suponiendo que `OnlineStore` apunta a su contrato en Ethereum:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

Observe el campo `value`, donde la llamada a la función JavaScript especifica cuánto de `ether` enviar (0.001). Si piensas en la transacción como un sobre, y los parámetros que usted envía a la llamada de función son los contenidos de la carta que va adentro, entonces añadir un `value` es como poner dinero efectivo dentro del sobre — la carta y el dinero son entregados juntos al receptor.

> Nota: Si una función no es marcada como `payable` y usted intenta enviar Ether a esta, como se hizo anteriormente, la función rechazará su transacción.

## Ponlo a prueba

Vamos a crear una función `payable` en nuestro juego zombi.

Digamos que nuestro juego tiene una función donde los usuarios pueden pagar ETH para subir el nivel de sus zombis. El ETH será almacenado en el contrato, el cual tú posees — ¡Esto es un simple ejemplo de cómo podrías hacer dinero en tus juegos!

1. Define un `uint` llamado `levelUpFee` y configúralo como igual a `0.001 ether`.

2. Crea una función llamada `levelUp`. Esta tomará un parámetro, `_zombieId`, un `uint`. Debería ser `external` y `payable`.

3. La función primero debería `require` (requerir) que `msg.value` sea igual a `levelUpFee`.

4. Luego el `level` de este zombi debería incrementar: `zombies[_zombieId].level++`.
