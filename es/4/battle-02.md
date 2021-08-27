---
title: Números Aleatorios
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // Start here
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            address _owner = owner();
            _owner.transfer(address(this).balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
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
      "zombiefactory.sol": |
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
      "ownable.sol": |
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
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiehelper.sol";

      contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        }
      }


---

¡Grandioso! Ahora descifremos la lógica de batalla

Todo buen juego necesita algún nivel de aleatoriedad. Entonces ¿Cómo generamos números aleatorios en Solidity?

La respuesta correcta es que no puede. Bueno, al menos no puede hacerlo de una manera segura.

Veamos por qué.

## La generación aleatoria de números a través de `keccak256`

La mejor fuente de aleatoriedad que tenemos en solidity es la función hash `keccak256`.

Podríamos hacer algo como lo siguiente para generar un número aleatorio:

```
// Generate a random number between 1 and 100:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

Lo que esto haría es tomar la marca de tiempo de `now`, el `msg.sender`, y un `nonce` (un número que sólo se utiliza una vez, para que no ejecutemos dos veces la misma función hash con los mismos parámetros de entrada) en incremento.

Luego entonces utilizaría `keccak` para convertir estas entradas a un hash aleatorio, convertir ese hash a un `uint` y luego utilizar `% 100` para tomar los últimos 2 dígitos solamente, dándonos un número totalmente aleatorio entre 0 y 99.

### Este método es vulnerable a ataques de nodos deshonestos

En Ethereum, cuando llama a una función en un contrato, lo transmite a un nodo o nodos en la red como una **_transacción_**. Los nodos en la red luego recolectan un montón de transacciones, intentan ser el primero en resolver el problema de matemática intensamente informático como una "Prueba de Trabajo", para luego publicar ese grupo de transacciones junto con sus Pruebas de Trabajo (PoW) como un **_bloque_** para el resto de la red.

Una vez que un nodo ha resuelto la PoW, los otros nodos dejan de intentar resolver la PoW, verifican que las transacciones en la lista de transacciones del otro nodo son válidas, luego aceptan el bloque y pasan a tratar de resolver el próximo bloque.

**Esto hace que nuestra función de números aleatorios sea explotable **.

Digamos que teníamos un contrato coin flip — cara y duplica su dinero, sello y pierde todo. Digamos que utilizó la función aleatoria anterior para determinar cara o sello. (`random >= 50` es cara, `random < 50` es sello).

Si yo estuviera ejecutando un nodo, podría publicar una transacción **a mi propio nodo solamente** y no compartirla. Luego podría ejecutar la función coin flip para ver si gané — y si perdí, escojo no incluir esa transacción en el próximo bloque que estoy resolviendo. Podría seguir haciendo esto indefinidamente hasta que finalmente gané el lanzamiento de la moneda y resolví el siguiente bloque, beneficiandome de ello.

## Entonces ¿Cómo generamos números aleatorio de manera segura en Ethereum?

Ya que todos los contenidos de la blockchain son visibles para todos los participantes, este es un problema dificil, y su solución está más allá del rango de este tutorial. Puede leer <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>este hilo de StackOverflow</a> para que se haga un idea. Una idea sería utilizar un **_oráculo_** para ingresar una función de número aleatorio desde fuera de la blockchain de Ethereum.

Por supuesto, debido a que cientos de miles de nodos de Ethereum en la red están compitiendo por resolver el próximo bloque, mis probabilidades de resolver el siguiente bloque son extremadamente escasas. Me tomaría mucho tiempo o recursos informáticos para explotar esto y que sea beneficioso — pero si la recompensa fuera lo suficientemente alta (como si pudiera apostar $100,000,000 en la función coin flip), para mi valdría la pena atacar.

Así que mientras esta generación de número aleatorio NO sea segura en Ethereum, en la práctica a menos que nuestra función aleatoria tenga mucho dinero en riesgo, es probable que los usuarios de su juego no tengan suficientes recursos para atacarla. 

Ya que sólo estamos construyendo un juego simple para propósitos de demo en este tutorial y no hay dinero real en riesgo, vamos a asumir el riesgo de utilizar un generador de números aleatorios que es simple de implementar, sabiendo que no es totalmente seguro.

En una lección futura, puede que cubramos el uso de los **_oráculos_** (una manera segura de incorporar datos desde afuera de Ethereum) para generar números aleatorios seguros desde afuera de la blockchain.

## Pongalo a prueba

Implementemos una función de número aleatorio que podamos utilizar para determinar el resultado de nuestras batallas, incluso si no está totalmente seguro de ataques.

1. Dé a nuestro contrato un `uint` llamado `randNonce`, y configurarlo como igual a `0`.

2. Cree una función llamada `randMod` (random-modulus). Será una función `internal` que tome un `uint` llamado `_modulus`, y `returns` un `uint`.

3. La función debería primero incrementar `randNonce` (utilizando la sintaxis `randNonce++`).

4. Finalmente, debería (en una línea de código) calcular el encasillado de `uint` del hash `keccak256` de `now`, `msg.sender` y `randNonce` — y `return` (arrojar) ese valor `% _modulus`. (¡Vaya! Eso fue un trabalenguas. Si pudo comprender eso, tan sólo eche un vistazo al ejemplo de arriba donde generamos un número aleatorio — la lógica es muy similar).
