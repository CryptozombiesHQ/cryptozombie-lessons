---
title: Bucles For
actions:
  - 'comprobarRespuesta'
  - 'pistas'
requireLogin: verdadero
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
        }

        function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerZombieCount[_owner]);
        // Start here
        return result;
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

        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }

        function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
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
        _triggerCooldown(myZombie);
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

        function _createZombie(string memory _name, uint _dna) internal {
        uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
        * @dev El constructor Ownable establece al `owner` original del contrato
        * a la dirección de la cuenta del remitente.
        */
        constructor() internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
        }

        /**
        * @return la dirección del owner.
        */
        function owner() public view returns(address) {
        return _owner;
        }

        /**
        * @dev Se activa si es llamada por cualquier cuenta que no sea la del propietario.
        */
        modifier onlyOwner() {
        require(isOwner());
        _;
        }

        /**
        * @devuelve true si `msg.sender` es el propietario del contrato.
        */
        function isOwner() public view returns(bool) {
        return msg.sender == _owner;
        }

        /**
        * @dev Permite al actual propietario a renunciar al control del contrato.
        * @notice Renucniar a la propiedad del contrato comportará dejar el contrato sin dueño.
        * No será posible llamar las funciones con el modificador
        * `onlyOwner` nunca más.
        */
        function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
        }

        /**
        * @dev Permite al actual propietario transferir el controldel contrato a newOwner.
        * @param newOwner es la dirección a transferir la posesión.
        */
        function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
        }

        /**
        * @dev Transfiere el control del contrato a newOwner.
        * @param newOwner es la dirección a transferir la posesión.
        */
        function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
        }
        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[] memory) { uint[] memory result = new uint[](ownerZombieCount[_owner]); uint counter = 0; for (uint i = 0; i < zombies.length; i++) { if (zombieToOwner[i] == _owner) { result[counter] = i; counter++; } } return result; }
      }
---

En el capítulo anterior, mencionamos que a veces queremos usar bucles `for` para construir contenido dentro de un array en una función antes que simplemente guardar el array en storage.

Vamos a ver el por qué.

Para nuestra función `getZombiesByOwner`, una implementación nativa sería guardar un `mapping` de los dueños para los ejércitos zombis en el contrato `ZombieFactory`:

    mapping (address => uint[]) public ownerToZombies
    

De esta forma cada vez que creemos un nuevo zombi, simplemente tenemos que usar `ownerToZombies[owner].push(zombieId)` para añadirlo al array del ejército de zombis de ese usuario. Y `getZombiesByOwner` sería una función tan sencilla como:

    function getZombiesByOwner(address _owner) external view returns (uint[] memory) {
      return ownerToZombies[_owner];
    }
    

### El problema con este enfoque

Este planteamiento es tentador por su simplicidad. Pero vamos a ver que pasa si más tarde añadimos una función para transferir un zombi de un dueño a otro (¡cosa que querremos hacer en una lección próxima!).

Esa función de transferencia necesitará que: 1. Añadir el zombi al array `ownerToZombies` del nuevo dueño, 2. Eliminar el zombi del array `ownerToZombies` del antiguo dueño, 3. Mover todos los zombis en el array del antiguo dueño para rellenar el hueco que hemos dejado, y luego 4. Reducir el largo del array en 1.

El paso 3 costará demasiado gas, debido a que tenemos que hacer una escritura por cada zombi que queramos mover. Si un usuario tiene 20 zombis y cambia el primero de todos, tenemos que hacer 19 escrituras para mantener el orden del array.

Como escribir en storage es una de las operaciones más caras en Solidity, cada llamada a la función de transferencia será exteremadamente cara en cuanto al gas. Y lo peor, la función costará diferente cantidad de gas cada vez que se llame, dependiendo de cuantos zombis tenga el usuario en su ejército y el índice del zombi siendo intercambiado. Así que el usuario no sabrá cuanto gas enviar.

> Nota: Por supuesto, podemos mover el último zombi del array para rellenar el hueco que hemos dejado y reducir la longitud del array en uno. Pero cambiaremos el orden de nuestro ejército cada vez que hagamos una transacción.

Debido a que las funciones `view` no consumen gas cuando son llamadas externamente, podemos simplemente usar un bucle-for en `getZombiesByOwner` para iterar en el array de zombis y construir un array de zombis que pertenezcan a un usuario específico. Con esto nuestra función de `transferencia` será mucho más barata, ya que no necesitamos reordenar ningún array en storage, y porque este enfoque ligeramente contra-intuitivo es íntegramente más barato.

## Usando los bucles `for`

La sintaxis de los bucles `for` en Solidity es similar a JavaScript.

Vamos a ver un ejemplo donde queremos hacer un array de números pares:

    function getEvens() pure external returns(uint[] memory) {
      uint[] memory evens = new uint[](5);
      // Keep track of the index in the new array:
      uint counter = 0;
      // Iterate 1 through 10 with a for loop:
      for (uint i = 1; i <= 10; i++) {
        // If `i` is even...
        if (i % 2 == 0) {
          // Añadelo a nuestro array
          evens[counter] = i;
          // Incrementamos el contador al nuevo índice vacío de `evens`:
          counter++;
        }
      }
      return evens;
    }
    

La función devolverá un array con este contenido `[2, 4, 6, 8, 10]`.

## Vamos a probarlo

Vamos a terminar nuestra función `getZombiesByOwner` escribiendo un bucle `for` que itere todos los zombis de nuestra DApp, comparando su dueño para que cuando coincida con el que buscamos, lo añada al array `result` antes de devolverlo.

1. Declara un `uint` llamado `counter` y estableciéndolo a `0`. Usaremos esta variable para mantener el control del índice en nuestro array `result`.

2. Declara un bucle `for` que empiece en `uint i = 0` y vaya hasta `i < zombies.length`. Este iterará todos los zombis de nuestro array.

3. Dentro del bucle `for`, crea una sentencia `if` que compruebe si `zombieToOwner[i]` es igual a `_owner`. Esto comparará dos direcciones para ver si son iguales.

4. Dentro de la declaración `if`:
    
    1. Añadimos la ID del zombi a nuestro array `result` haciendo que `result[counter]` sea igual a `i`.
    2. Incrementamos `counter` a 1 (mira el bucle `for` del ejemplo de arriba).

Eso es — la función ahora devolverá todos los zombis del usuario `_owner` sin gastar nada de gas.