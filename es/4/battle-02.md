---
title: Números Aleatorios
actions:
  - 'comprobarRespuesta'
  - 'pistas'
requireLogin: verdadero
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiehelper.sol";
        
        contract ZombieBattle is ZombieHelper {
        // Iniciar aquí
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
      import "./zombiehelper.sol";
      contract ZombieBattle is ZombieHelper { uint randNonce = 0;
      function randMod(uint _modulus) internal returns(uint) { randNonce++; return uint(keccak256(now, msg.sender, randNonce)) % _modulus; } }
---
¡Grandioso! Ahora descifremos la lógica de batalla.

Todo buen juego necesita algún nivel de aleatoriedad. Entonces ¿Cómo generamos números aleatorios en Solidity?

La respuesta correcta es que no puede. Bueno, al menos no puede hacerlo de una manera segura.

Vamos a ver el por qué.

## La generación aleatoria de números a través de `keccak256`

La mejor fuente de aleatoriedad que tenemos en solidity es la función hash `keccak256`.

Podríamos hacer algo como lo siguiente para generar un número aleatorio:

    // Genera un número aleatorio entre 1 y 100:
    uint randNonce = 0;
    uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
    randNonce++;
    uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
    

Lo que esto haría es tomar la marca de tiempo de `now`, el `msg.sender`, y un `nonce` (un número que sólo se utiliza una vez, para que no ejecutemos dos veces la misma función hash con los mismos parámetros de entrada) en incremento.

Entonces utilizaría `keccak` para convertir estas entradas a un hash aleatorio, convertir ese hash a un `uint` y luego utilizar `% 100` para tomar los últimos 2 dígitos solamente, dándonos un número totalmente aleatorio entre 0 y 99.

### Este método es vulnerable a ataques de un nodo deshonesto

En Ethereum, cuando llamas a una función en un contrato, lo transmite a un nodo o nodos en la red como una ***transacción***. Los nodos en la red luego recolectan un montón de transacciones, intentan ser el primero en resolver el problema de matemática intensamente informático como una "Prueba de Trabajo", para luego publicar ese grupo de transacciones junto con sus Pruebas de Trabajo (PoW) como un ***bloque*** para el resto de la red.

Una vez que un nodo ha resuelto la PoW, los otros nodos dejan de resolver la PoW, verifican que las transacciones en la lista de transacciones del otro nodo son validas, luego aceptan el bloque y pasan a tratar de resolver el próximo bloque.

**Esto hace que nuestra función de números aleatorios sea explotable.**

Digamos que teníamos un contrato coin flip — cara duplicas tu dinero, sello lo pierdes todo. Digamos que utilizó la función aleatoria anterior para determinar cara o sello. (`random >= 50` es cara, `random < 50`es sello).

Si yo estuviera ejecutando un nodo, podría publicar una transacción **a mi propio nodo solamente** y no compartirla. Luego podría ejecutar la función coin flip para ver si gané — y si perdí, escojo no incluir esa transacción en el próximo bloque que estoy resolviendo. I could keep doing this indefinitely until I finally won the coin flip and solved the next block, and profit.

## So how do we generate random numbers safely in Ethereum?

Because the entire contents of the blockchain are visible to all participants, this is a hard problem, and its solution is beyond the scope of this tutorial. You can read <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>this StackOverflow thread</a> for some ideas. One idea would be to use an ***oracle*** to access a random number function from outside of the Ethereum blockchain.

Of course, since tens of thousands of Ethereum nodes on the network are competing to solve the next block, my odds of solving the next block are extremely low. It would take me a lot of time or computing resources to exploit this profitably — but if the reward were high enough (like if I could bet $100,000,000 on the coin flip function), it would be worth it for me to attack.

So while this random number generation is NOT secure on Ethereum, in practice unless our random function has a lot of money on the line, the users of your game likely won't have enough resources to attack it.

Because we're just building a simple game for demo purposes in this tutorial and there's no real money on the line, we're going to accept the tradeoffs of using a random number generator that is simple to implement, knowing that it isn't totally secure.

In a future lesson, we may cover using ***oracles*** (a secure way to pull data in from outside of Ethereum) to generate secure random numbers from outside the blockchain.

## Put it to the test

Let's implement a random number function we can use to determine the outcome of our battles, even if it isn't totally secure from attack.

1. Give our contract a `uint` called `randNonce`, and set it equal to ``.

2. Create a function called `randMod` (random-modulus). It will be an `internal` function that takes a `uint` named `_modulus`, and `returns` a `uint`.

3. The function should first increment `randNonce` (using the syntax `randNonce++`).

4. Finally, it should (in one line of code) calculate the `uint` typecast of the `keccak256` hash of `now`, `msg.sender`, and `randNonce` — and `return` that value `% _modulus`. (Whew! That was a mouthful. If you didn't follow that, just take a look at the example above where we generated a random number — the logic is very similar).