---
title: Refactorizando la Lógica Común
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

        // 1. Crea un modificador aquí
        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }

        function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
        }

        function _isReady(Zombie storage _zombie) internal view returns (bool) {
        return (_zombie.readyTime <= now);
        }

        // 2. Add modifier to function definition:
        function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal {
        // 3. Remove this line
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
      "zombieattack.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;
        uint attackVictoryProbability = 70;

        function randMod(uint _modulus) internal returns(uint) {
        randNonce++;
        return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        }

        function attack(uint _zombieId, uint _targetId) external {
        }
        }
      "zombiehelper.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      KittyInterface kittyContract;
      modifier ownerOf(uint _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); _; }
      function setKittyContractAddress(address _address) external onlyOwner { kittyContract = KittyInterface(_address); }
      function _triggerCooldown(Zombie storage _zombie) internal { _zombie.readyTime = uint32(now + cooldownTime); }
      function _isReady(Zombie storage _zombie) internal view returns (bool) { return (_zombie.readyTime <= now); }
      function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal ownerOf(_zombieId) { Zombie storage myZombie = zombies[_zombieId]; require(_isReady(myZombie)); _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); _triggerCooldown(myZombie); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); } }
---

Quien sea que llame a nuestra función `attack` — queremos asegurarnos de que el usuario sea realmente el dueño del zombi con el que está atacando. ¡Sería un problema de seguridad si se pudiera atacar con el zombi de alguien más!

¿Puede pensar en cómo podríamos añadir un chequeo para ver si la persona que llama a esta función es el dueño del `_zombieId` que está pasando?

Piénsalo por un rato, y observa si puedes conseguir la respuesta por tu cuenta.

Tomate tu tiempo... Revisa el código de algunas de las lecciones anteriores para conseguir ideas...

Respuesta abajo, no continúe hasta que lo hayas pensado realmente.

## La respuesta

Hemos hecho este chequeo varias veces en lecciones anteriores. En `changeName()`, `changeDna()`, y `feedAndMultiply()`, utilizamos el siguiente chequeo:

    require(msg.sender == zombieToOwner[_zombieId]);
    

Esta es la misma lógica que necesitaremos para nuestra función `attack`. Ya que estamos utilizando multiples veces la misma lógica, movamos esto a su propio `modifier` para limpiar nuestro código y evitar redundancias.

## Vamos a probarlo

Regresamos a `zombiefeeding.sol`, debido a que este es el primer lugar dónde usamos esa lógica. Vamos a refactorizarlo en su propio `modifier`.

1. Crea un `modifier` llamado `ownerOf`. Tomará 1 argumento `_zombieId` (un `uint`).
    
    El cuerpo debería `require` (requerir) que `msg.sender` sea igual a `zombieToOwner[_zombieId]`, y luego continuar con la función. Puede consultar `zombiehelper.sol` si no recuerda la sintaxis para un modificador.

2. Cambia la definición de la función de `feedAndMultiply` de manera que utilice el modificador `ownerOf`.

3. Ahora que estamos utilizando un `modifier`, puedes eliminar la línea `require(msg.sender == zombieToOwner[_zombieId]);`