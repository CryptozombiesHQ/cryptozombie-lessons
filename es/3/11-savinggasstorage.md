---
title: Storage es Costoso
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
        // Start here
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
      pragma solidity >=0.5.0 <0.6.0;
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[] memory) { uint[] memory result = new uint[](ownerZombieCount[_owner]);
      return result; }
      }
---

Una de las operaciones más caras en Solidity es usar `storage` — especialmente la escritura.

Esto es debido a que cada vez que escribes o cambias algún dato, este se guarda permanentemente en la blockchain. ¡Para siempre! Miles de nodos alrededor del mundo necesitan guardar esos datos en sus discos duros, y esa cantidad de datos sigue creciendo a lo largo del tiempo a medida que crece la blockchain. Así que tiene que haber un costo para hacer eso.

Para seguir manteniendo los costes bajos, querrás evitar escribir datos en "storage" a no ser que sea absolutamente necesario. A veces esto implica usar en programación una lógica ineficiente — como volver a construir un array en `memoria` cada vez que una función es llamada en vez de simplemente guardar ese array en una variable para acceder a sus datos más rápido.

En la mayoría de los lenguajes de programación, usar bucles sobre largos conjuntos de datos es costoso. Pero en Solidity, esta es una manera más barata que usar `storage` si está en una función `external view`, debido a que las funciones `view` no les cuesta a los usuarios nada de gas. (¡Y el gas le cuesta a tus usuarios dinero real!).

Veremos los bucles `for` en el siguiente capítulo, pero primero, vamos a ver como declarar los arrays en memoria.

## Declarando arrays en memoria

Puedes usar la palabra clave `memory` con arrays para crear un nuevo ararys dentro de una función sin necesidad de escribir nada en storage. El array solo existirá hasta el final de la llamada de la función, y esto es más barato en cuanto a gas que actualizar un array en `storage` — gratis si está dentro de una función `view` llamada externamente.

Así es como se declara un array en memoria:

    function getArray() external pure returns(uint[] memory) {
      // Instantiate a new array in memory with a length of 3
      uint[] memory values = new uint[](3);
    
      // Put some values to it
      values[0] = 1;
      values[1] = 2;
      values[2] = 3;
    
      return values;
    }
    

Esto es un ejemplo trivial para enseñarte a cómo usar la sintaxis, pero en el próximo capítulo veremos como combinarlo con bucles `for` para usarlo en casos de uso reales.

> Nota: los arrays de tipo memory **deben** son creados con un argumento de longitud (en este ejemplo, `3`). Actualmente no pueden ser redimensionados como los arrays storage pueden serlo usando `array.push()`, de todas maneras esto puede cambiar en futuras versiones de Solidity.

## Vamos a probarlo

En nuestra función `getZombiesByOwner`, queremos devolver un array `uint[]` con todos los zombis de un usuario particular.

1. Declara una variable `uint[] memory` llamada `result`

2. Establecela a un nuevo array de tipo `uint`. El largo del array debería ser igual al los zombis que posea su `_owner`, el cual podamos mirarlo desde nuestro `mapping` con: `ownerZombieCount[_owner]`.

3. Al final de la función devuelve `result`. Esta devolverá un array vacío por ahora, pero lo rellenaremos en el próximo capítulo.