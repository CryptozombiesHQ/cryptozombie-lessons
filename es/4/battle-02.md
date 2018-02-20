---
título: Números Aleatorios
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
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
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
            if (keccak256(_species) == keccak256("kitty")) {
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
        pragma solidity ^0.4.19;

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
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      import "./zombiehelper.sol";

      contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
      }

---

¡Magnífico! Ahora descubramos la lógica de la batalla.

Todos los buenos juegos requieren cierto nivel de aleatoridad. ¿Entonces como generamos números aleatorios en Solidity?

La verdadera respuesta es que aquí, no puedes. Bueno, al menos no puedes hacerlo de forma segura.

Veamos ¿por qué?.

## Generación de números aleatorios a traves de `keccak256`

La mejor fuente de aleatoridad que tenemos en Solidity es la función hash `keccak256`.

Podríamos hacer algo como lo siguiente para generar un número aleatorio: 

```
// Generate a random number between 1 and 100:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

Lo que esto haría es tomar la marca de tiempo de `now`, `msg.sender`, y un incremento `nonce` (un número que solo se usa una vez, por lo que no ejecutamos la misma función hash con el mismo parámetro de entrada dos veces). 

Entonces usaría `keccak` para convertir estas entradas a una función de hash aleatoria, convierta esa función hash a un `uint`, y luego use `% 100` para tomar sólo los últimos 2 digitos, dándonos un número totalmente aleatorio entre 0 y 99.

### Este método es vulnerable al ataque de un nodo deshonesto

En Ethereum, cuando llamas a una función en un contrato, lo transmites a un nodo o nodos en la red como **_transacción_**. Los nodos de la red recopilan un montón de transacciones, intente ser el primero en resolver un problema matemático intensivo computacionalmente como una "Prueba de Trabajo", y luego publique ese grupo de transacciones junto con su Prueba de Trabajo (PoW) como un **_bloqueo_** para el resto de la red.

Una vez el nodo haya resuelto la PoW, los otros nodos dejan de intentar la PoW, verificar que la lista de transacciones del otro nodo sea válida, y luego acepte el bloque y siga intentando resolver el siguiente bloque.

**Esto hace que nuestra función de numeros aleatorios sea explotable.**

Digamos que teniamos un contrato de lanzamiento de moneda — te dirige el doble de tu dinero, se pierde todo. Digamos que uso la función aleatoria anterior para determinar cabezas o colas. (`random >= 50` son cabezas, `random < 50` son colas).

Si yo fuera un nodo, yo podria publicar una transacción **solo a mi propio nodo** y no compartirlo. Yo podría luego ejecutar la función de lanzamiento de moneda para ver si gano — y si pierdo, elijo no incluir esa transacción en el próximo bloque que estoy resolviendo. Puede seguir haciendo esto indefinidamente hasta que finalmente gane el lanzamiento de moneda y resolver el siguiente bloque, y obtuve beneficios.

## Entonces ¿cómo generamos números aleatorios de forma segura en Ethereum?

Porque todo el contenido de la blockchain es visible para todos los participantes, es este un problema difícil, y su solución está más allá del alcance de este tutorial. Puedes leer <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>this StackOverflow thread</a> para algunas ideas. Una idea sería usar un **_oráculo_** para acceder a una función de número aleatorio fuera de la blockchain de Ethereum.

Por supuesto, dado que decenas de miles de nodos de Ethereum en la red compiten para resolver el siguiente bloque, mis probabilidades de resolver el siguiente bloque son extremadamente bajas. Esto me tomaría mucho tiempo o recursos informáticos para explotar de manera rentable — pero si la recompensa fuera lo suficientemente alta (como si pudiera apostar $100,000,000 en la función lanzamiento de moneda), valdría la pena para mi atacar.

Entonces aunque esta generación de números aleatorios NO es segura en Ethereum, en la práctica a no ser que nuestra función aleatoria tenga mucho dinero en la línea , los usuarios de tu juego probablemente no tendrán recursos suficientes para atacarlo.

Porque estamos simplemente construyendo un juego simple para propositos demostrativos en este tutorial y no hay un gasto de dinero real, vamos a aceptar el intercambio de un generador de números aleatorios, que es simple de implementar, a pesar de que este no sea totalmente seguro.

En una futura lección, podemos cubrir usando **_oráculos_** (una manera segura de extraer datos desde fuera de Ethereum) para generear números aleatorios seguros desde fuera de la blockchain.

## Pongamoslo a prueba

Vamos a implementar una función de números aleatorios que podamos usar para determinar el resultado de nuestras batallas, incluso si no es totalmente seguro nuestro ataque.

1. Dale a nuestro contrato un `uint` llamado `randNonce`, y configuralo igual a `0`.

2. Crea una función llamada `randMod` (modulo aleatorio). Será una función `internal` que toma un `uint` llamado `_modulus`, y `returns` un `uint`.

3. La función primero debe incrementar `randNonce` (usando la sintaxis `randNonce++`).

4. Finalmente, debería (en una linea de codigo) calcular la conversión de tipo`uint` del hash `keccak256` de `now`, `msg.sender`, y `randNonce` — y `return` ese valor `% _modulus`. (Uff! Eso fue un bocado. Si no siguiste eso, simplemente eche un vistazo donde generamos un numero aleatorio — la logica es muy similar).
