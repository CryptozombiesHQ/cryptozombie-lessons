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
        
        // 2. Añade un modificador a la definición de la función:
        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
        // 3. Elimina esta línea
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
      "zombieattack.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiehelper.sol";
        
        contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;
        uint attackVictoryProbability = 70;
        
        function randMod(uint _modulus) internal returns(uint) {
        randNonce++;
        return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
        
        function attack(uint _zombieId, uint _targetId) external {
        }
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
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      KittyInterface kittyContract;
      modifier ownerOf(uint _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); _; }
      function setKittyContractAddress(address _address) external onlyOwner { kittyContract = KittyInterface(_address); }
      function _triggerCooldown(Zombie storage _zombie) internal { _zombie.readyTime = uint32(now + cooldownTime); }
      function _isReady(Zombie storage _zombie) internal view returns (bool) { return (_zombie.readyTime <= now); }
      function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal ownerOf(_zombieId) { Zombie storage myZombie = zombies[_zombieId]; require(_isReady(myZombie)); _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(_species) == keccak256("kitty")) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); _triggerCooldown(myZombie); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); } }
---
Quien sea que llame a nuestra función `attack` — queremos asegurarnos de que el usuario sea realmente el dueño del zombi con el que está atacando. ¡Sería un problema de seguridad si se pudiera atacar con el zombi de alguien más!

¿Puede pensar en cómo podríamos añadir un chequeo para ver si la persona que llama a esta función es el dueño del `_zombieId` que está pasando?

Give it some thought, and see if you can come up with the answer on your own.

Take a moment... Refer to some of our previous lessons' code for ideas...

Answer below, don't continue until you've given it some thought.

## The answer

We've done this check multiple times now in previous lessons. In `changeName()`, `changeDna()`, and `feedAndMultiply()`, we used the following check:

    require(msg.sender == zombieToOwner[_zombieId]);
    

This is the same logic we'll need for our `attack` function. Since we're using the same logic multiple times, let's move this into its own `modifier` to clean up our code and avoid repeating ourselves.

## Put it to the test

We're back to `zombiefeeding.sol`, since this is the first place we used that logic. Let's refactor it into its own `modifier`.

1. Create a `modifier` called `ownerOf`. It will take 1 argument, `_zombieId` (a `uint`).
    
    The body should `require` that `msg.sender` is equal to `zombieToOwner[_zombieId]`, then continue with the function. You can refer to `zombiehelper.sol` if you don't remember the syntax for a modifier.

2. Change the function definition of `feedAndMultiply` such that it uses the modifier `ownerOf`.

3. Now that we're using a `modifier`, you can remove the line `require(msg.sender == zombieToOwner[_zombieId]);`