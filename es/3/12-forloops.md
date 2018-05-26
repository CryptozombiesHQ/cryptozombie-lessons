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
        pragma solidity ^0.4.19;
        
        import "./zombiefeeding.sol";
        
        contract ZombieHelper is ZombieFeeding {
        
        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
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
        // Iniciar aquí
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
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[]) { uint[] memory result = new uint[](ownerZombieCount[_owner]); uint counter = 0; for (uint i = 0; i < zombies.length; i++) { if (zombieToOwner[i] == _owner) { result[counter] = i; counter++; } } return result; }
      }
---
En el capítulo anterior, mencionamos que a veces queremos usar bucles `for` para construir contenido dentro de un array en una función antes que simplemente guardar el array en storage.

Vamos a ver el por qué.

Para nuestra función `getZombiesByOwner`, una implementación nativa sería guardar un `mapping` de los dueños para los ejércitos zombis en el contrato `ZombieFactory`:

    mapping (address => uint[]) public ownerToZombies
    

De esta forma cada vez que creemos un nuevo zombi, simplemente tenemos que usar `ownerToZombies[owner].push(zombieId)` para añadirlo al array del ejército de zombis de ese usuario. Y `getZombiesByOwner` sería una función tan sencilla como:

    function getZombiesByOwner(address _owner) external view returns (uint[]) {
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

    function getEvens() pure external returns(uint[]) {
      uint[] memory evens = new uint[](5);
      // Guardamos el índice del nuevo array:
      uint counter = 0;
      // Iteramos del 1 al 10 con un bucle for:
      for (uint i = 1; i <= 10; i++) {
        // Si `i` es par...
        if (i % 2 == 0) {
          // Add it to our array
          evens[counter] = i;
          // Increment counter to the next empty index in `evens`:
          counter++;
        }
      }
      return evens;
    }
    

This function will return an array with the contents `[2, 4, 6, 8, 10]`.

## Put it to the test

Let's finish our `getZombiesByOwner` function by writing a `for` loop that iterates through all the zombies in our DApp, compares their owner to see if we have a match, and pushes them to our `result` array before returning it.

1. Declare a `uint` called `counter` and set it equal to ``. We'll use this variable to keep track of the index in our `result` array.

2. Declare a `for` loop that starts from `uint i = 0` and goes up through `i < zombies.length`. This will iterate over every zombie in our array.

3. Inside the `for` loop, make an `if` statement that checks if `zombieToOwner[i]` is equal to `_owner`. This will compare the two addresses to see if we have a match.

4. Inside the `if` statement:
    
    1. Add the zombie's ID to our `result` array by setting `result[counter]` equal to `i`.
    2. Increment `counter` by 1 (see the `for` loop example above).

That's it — the function will now return all the zombies owned by `_owner` without spending any gas.