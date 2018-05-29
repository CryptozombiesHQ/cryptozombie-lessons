---
title: Previniendo Desbordamientos
actions:
  - 'comprobarRespuesta'
  - 'pistas'
requireLogin: verdadero
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;
        
        import "./ownable.sol";
        // 1. Importar aquí:
        
        contract ZombieFactory is Ownable {
        
        // 2. Declara usando safemath aquí
        
        event NewZombie(uint zombieId, string name, uint dna);
        
        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        uint cooldownTime = 1 days;
        
        struct Zombie {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
        }
        
        Zombie[] public zombies;
        
        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;
        
        function _createZombie(string _name, uint _dna) internal {
        uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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
      "zombieownership.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombieattack.sol";
        import "./erc721.sol";
        
        contract ZombieOwnership is ZombieAttack, ERC721 {
        
        mapping (uint => address) zombieApprovals;
        
        function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerZombieCount[_owner];
        }
        
        function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return zombieToOwner[_tokenId];
        }
        
        function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerZombieCount[_to]++;
        ownerZombieCount[_from]--;
        zombieToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId);
        }
        
        function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
        }
        
        function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
        }
        
        function takeOwnership(uint256 _tokenId) public {
        require(zombieApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
        }
        }
      "zombieattack.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiehelper.sol";
        
        contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;
        uint attackVictoryProbability = 70;
        
        function randMod(uint _modulus) internal returns(uint) {
        randNonce++;
        return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
        
        function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
        Zombie storage myZombie = zombies[_zombieId];
        Zombie storage enemyZombie = zombies[_targetId];
        uint rand = randMod(100);
        if (rand <= attackVictoryProbability) {
        myZombie.winCount++;
        myZombie.level++;
        enemyZombie.lossCount++;
        feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
        } else {
        myZombie.lossCount++;
        enemyZombie.winCount++;
        _triggerCooldown(myZombie);
        }
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
        
        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
        zombies[_zombieId].name = _newName;
        }
        
        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
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
        
        modifier onlyOwnerOf(uint _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        _;
        }
        
        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }
        
        function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
        }
        
        function _isReady(Zombie storage _zombie) internal view returns (bool) {
        return (_zombie.readyTime <= now);
        }
        
        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal onlyOwnerOf(_zombieId) {
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
      "safemath.sol": |
        pragma solidity ^0.4.18;
        
        /**
        * @title SafeMath
        * @dev Operaciones matemáticas con chequeos de seguridad que arrojan un error
        */
        library SafeMath {
        
        /**
        * @dev Multiplicar dos números, arroja un desbordamiento.
        */
        function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
        return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
        }
        
        /**
        * @dev La división entera de dos números, omiten el cociente.
        */
        function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automáticamente arroja cuando divide por 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // No hay ningún caso en el que esto no se mantenga
        return c;
        }
        
        /**
        * @dev Restar dos números, arroja un desbordamiento (es decir, si el sustraendo es mayor que el minuendo).
        */
        function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
        }
        
        /**
        * @dev Sumar dos números, arroja un desbordamiento.
        */
        function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
        }
        }
      "erc721.sol": |
        contract ERC721 {
        event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
        event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
        
        function balanceOf(address _owner) public view returns (uint256 _balance);
        function ownerOf(uint256 _tokenId) public view returns (address _owner);
        function transfer(address _to, uint256 _tokenId) public;
        function approve(address _to, uint256 _tokenId) public;
        function takeOwnership(uint256 _tokenId) public;
        }
    answer: |
      pragma solidity ^0.4.19;
      
      import "./ownable.sol";
      import "./safemath.sol";
      
      contract ZombieFactory is Ownable {
      
      using SafeMath for uint256;
      
      event NewZombie(uint zombieId, string name, uint dna);
      
      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;
      uint cooldownTime = 1 days;
      
      struct Zombie {
      string name;
      uint dna;
      uint32 level;
      uint32 readyTime;
      uint16 winCount;
      uint16 lossCount;
      }
      
      Zombie[] public zombies;
      
      mapping (uint => address) public zombieToOwner;
      mapping (address => uint) ownerZombieCount;
      
      function _createZombie(string _name, uint _dna) internal {
      uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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
---
¡Felicidades, eso completa nuestra implementación de ERC721!

Eso no fue tan difícil, ¿verdad? Muchas de estas cosas de Ethereum suenan realmente complicadas cuando escuchas a personas hablar de ellas, así que la mejor manera de entenderlas es realizarlas tú mismo.

Ten en cuenta que esto es sólo una implementación mínima. Hay características adicionales que podemos desear añadir a nuestra implementación, como algunas comprobaciones adicionales para asegurarnos de que los usuarios no transfieran accidentalmente sus zombis a la dirección `` (que se llama "quemar" un token, — básicamente se envía a una dirección a la cual nadie tiene su clave privada, haciéndolo irrecuperable). Quizás, implementar alguna lógica básica de subasta en su DApp. (¿Puedes pensar en algunas formas para implementar eso?)

Pero queríamos que esta lección fuera manejable, por lo que optamos por la implementación más básica. Si deseas ver un ejemplo de una implementación más profunda, puedes echar un vistazo al contrato de OpenZeppelin con ERC721 después de este tutorial.

### Mejoras de seguridad en el contrato: Desbordamientos por exceso (Overflows) y por defecto (Underflows)

Vamos a ver una característica de seguridad importante que debe tener en cuenta al escribir contratos inteligentes: Prevención de desbordamientos por exceso (overflow) y por defecto (underflow).

¿Qué es un ***desbordamiento***?

Digamos que tenemos un campo `uint8`, que sólo puede tener 8 bits. Esto significa, que el número más grande que podemos almacenar es binario `11111111` (o en decimal, 2^8 - 1 = 255).

Take a look at the following code. What is `number` equal to at the end?

    uint8 number = 255;
    number++;
    

In this case, we've caused it to overflow — so `number` is counterintuitively now equal to `` even though we increased it. (If you add 1 to binary `11111111`, it resets back to `00000000`, like a clock going from `23:59` to `00:00`).

An underflow is similar, where if you subtract `1` from a `uint8` that equals ``, it will now equal `255` (because `uint`s are unsigned, and cannot be negative).

While we're not using `uint8` here, and it seems unlikely that a `uint256` will overflow when incrementing by `1` each time (2^256 is a really big number), it's still good to put protections in our contract so that our DApp never has unexpected behavior in the future.

### Using SafeMath

To prevent this, OpenZeppelin has created a ***library*** called SafeMath that prevents these issues by default.

But before we get into that... What's a library?

A ***library*** is a special type of contract in Solidity. One of the things it is useful for is to attach functions to native data types.

For example, with the SafeMath library, we'll use the syntax `using SafeMath for uint256`. The SafeMath library has 4 functions — `add`, `sub`, `mul`, and `div`. And now we can access these functions from `uint256` as follows:

    using SafeMath for uint256;
    
    uint256 a = 5;
    uint256 b = a.add(3); // 5 + 3 = 8
    uint256 c = a.mul(2); // 5 * 2 = 10
    

We'll look at what these functions do in the next chapter, but for now let's add the SafeMath library to our contract.

## Putting it to the Test

We've already included OpenZeppelin's `SafeMath` library for you in `safemath.sol`. You can take a quick peek at the code now if you want to, but we'll be looking at it in depth in the next chapter.

First let's tell our contract to use SafeMath. We'll do this in ZombieFactory, our very base contract — that way we can use it in any of the sub-contracts that inherit from this one.

1. Import `safemath.sol` into `zombiefactory.sol`.

2. Add the declaration `using SafeMath for uint256;`.