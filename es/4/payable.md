---
title: Payable
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
        
        // 1. Define levelUpFee aquí
        
        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
        }
        
        // 2. Inserta la función levelUp function aquí
        
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
      uint levelUpFee = 0.001 ether;
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function levelUp(uint _zombieId) external payable { require(msg.value == levelUpFee); zombies[_zombieId].level++; }
      function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[]) { uint[] memory result = new uint[](ownerZombieCount[_owner]); uint counter = 0; for (uint i = 0; i < zombies.length; i++) { if (zombieToOwner[i] == _owner) { result[counter] = i; counter++; } } return result; }
      }
---
Hasta ahora, hemos cubierto unos cuantos ***modificadores de función***. Puede resultar difícil tratar de recordar todo, así que hagamos un breve repaso:

1. Tenemos modificadores de visibilidad que controlan desde dónde y cuándo la función puede ser llamada: `private` significa que sólo puede ser llamada desde otras funciones dentro del contrato; `internal` es como `private` pero también puede ser llamada por contratos que hereden desde este; `external` sólo puede ser llamada desde afuera del contrato; y finalmente `public` puede ser llamada desde cualquier lugar, tanto internamente como externamente.

2. También tenemos modificadores, los cuales nos dicen cómo interactúa la función con la BlockChain: `view` nos indica que al ejecutar la función, ningún dato será guardado/cambiado. `pure` nos indica que la función no sólo no guarda ningún dato en la blockchain, si no que tampoco lee ningún dato de la blockchain. Ambos no cuestan nada de gas para llamar si son llamados externamente desde afuera del contrato (pero si cuestan combustible si son llamado internamente por otra función).

3. Luego tenemos los `modifiers` personalizados, de los cuales aprendimos en la Lección 3: `onlyOwner` y `aboveLevel`, por ejemplo. Para estos podemos definir la lógica personalizada para determinar cómo afectan a una función.

Todos estos modificadores pueden ser apilados juntos en una definición de función de la siguiente manera:

    function test() external view onlyOwner anotherModifier { /* ... */ }
    

En este capítulo, vamos a presentar un modificador de función más: `payable`.

## El Modificador `payable`

Las funciones `payable` son parte de lo que hace de Solidity y Ethereum algo tan genial — son un tipo de función especial que pueden recibir Ether.

Piénsalo por un momento. Cuando llama una función API en un servidor web normal, no puede enviar dólares (USD$) junto con su llamada de función — ni enviar Bitcoin.

But in Ethereum, because both the money (*Ether*), the data (*transaction payload*), and the contract code itself all live on Ethereum, it's possible for you to call a function **and** pay money to the contract at the same time.

This allows for some really interesting logic, like requiring a certain payment to the contract in order to execute a function.

## Let's look at an example

    contract OnlineStore {
      function buySomething() external payable {
        // Check to make sure 0.001 ether was sent to the function call:
        require(msg.value == 0.001 ether);
        // If so, some logic to transfer the digital item to the caller of the function:
        transferThing(msg.sender);
      }
    }
    

Here, `msg.value` is a way to see how much Ether was sent to the contract, and `ether` is a built-in unit.

What happens here is that someone would call the function from web3.js (from the DApp's JavaScript front-end) as follows:

    // Assuming `OnlineStore` points to your contract on Ethereum:
    OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
    

Notice the `value` field, where the javascript function call specifies how much `ether` to send (0.001). If you think of the transaction like an envelope, and the parameters you send to the function call are the contents of the letter you put inside, then adding a `value` is like putting cash inside the envelope — the letter and the money get delivered together to the recipient.

> Note: If a function is not marked `payable` and you try to send Ether to it as above, the function will reject your transaction.

## Putting it to the Test

Let's create a `payable` function in our zombie game.

Let's say our game has a feature where users can pay ETH to level up their zombies. The ETH will get stored in the contract, which you own — this a simple example of how you could make money on your games!

1. Define a `uint` named `levelUpFee`, and set it equal to `0.001 ether`.

2. Create a function named `levelUp`. It will take one parameter, `_zombieId`, a `uint`. It should be `external` and `payable`.

3. The function should first `require` that `msg.value` is equal to `levelUpFee`.

4. It should then increment this zombie's `level`: `zombies[_zombieId].level++`.