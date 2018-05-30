---
title: SafeMath Parte 3
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
        import "./safemath.sol";
        
        contract ZombieFactory is Ownable {
        
        using SafeMath for uint256;
        // 1. Declara que estamos usando SafeMath32 para uint32
        // 2. Declara que estamos usando SafeMath16 para uint16
        
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
        // Note: Elegimos no evitar el problema del año 2038 ... Así que no necesitamos
        // preocuparnos de los desbordamientos en readyTime. Nuestra aplicación está atornillada en el 2038 de todos modos ;)
        uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
        zombieToOwner[id] = msg.sender;
        // 3. Vamos a utilizar `add` de SafeMath aquí:
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
        import "./safemath.sol";
        
        contract ZombieOwnership is ZombieAttack, ERC721 {
        
        using SafeMath for uint256;
        
        mapping (uint => address) zombieApprovals;
        
        function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerZombieCount[_owner];
        }
        
        function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return zombieToOwner[_tokenId];
        }
        
        function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
        ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
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
        * @dev La división entera de dos números, omiten al cociente.
        */
        function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
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
        
        /**
        * @title SafeMath32
        * @dev Librería SafeMath implementada para uint32
        */
        library SafeMath32 {
        
        function mul(uint32 a, uint32 b) internal pure returns (uint32) {
        if (a == 0) {
        return 0;
        }
        uint32 c = a * b;
        assert(c / a == b);
        return c;
        }
        
        function div(uint32 a, uint32 b) internal pure returns (uint32) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint32 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
        }
        
        function sub(uint32 a, uint32 b) internal pure returns (uint32) {
        assert(b <= a);
        return a - b;
        }
        
        function add(uint32 a, uint32 b) internal pure returns (uint32) {
        uint32 c = a + b;
        assert(c >= a);
        return c;
        }
        }
        
        /**
        * @title SafeMath16
        * @dev Librería SafeMath implementada para uint16
        */
        library SafeMath16 {
        
        function mul(uint16 a, uint16 b) internal pure returns (uint16) {
        if (a == 0) {
        return 0;
        }
        uint16 c = a * b;
        assert(c / a == b);
        return c;
        }
        
        function div(uint16 a, uint16 b) internal pure returns (uint16) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint16 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
        }
        
        function sub(uint16 a, uint16 b) internal pure returns (uint16) {
        assert(b <= a);
        return a - b;
        }
        
        function add(uint16 a, uint16 b) internal pure returns (uint16) {
        uint16 c = a + b;
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
      using SafeMath32 for uint32;
      using SafeMath16 for uint16;
      
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
      ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
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
¡Genial, ahora nuestra implementación de ERC721 está a salvo de desbordamientos!

Volviendo al código que escribimos en lecciones anteriores, hay algunos otros lugares donde nuestro código podría ser vulnerables a desbordamientos.

Por ejemplo, en ZombieAttack tenemos:

    myZombie.winCount++;
    myZombie.level++;
    enemyZombie.lossCount++;
    

También deberíamos prevenir los desbordamientos aquí, solo para estar seguros. (En general, es una buena idea usar SafeMath en lugar de las operaciones matemáticas básicas. Tal vez en una versión futura de Solidity estas se implementarán de manera predeterminada, pero por ahora debemos tomar precauciones de seguridad adicionales en nuestro código).

Sin embargo, tenemos un pequeño problema — `winCount` y `lossCount` son de tipo `uint16`, y `level` es de tipo `uint32`. Entonces, si usamos el método `add` de SafeMath con estos parámetros de entrada, en realidad no nos protegerá del desbordamiento ya que convertirá estos tipos en `uint256`:

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
    
    // Si llamamos `.add` en un `uint8`, se convierte en `uint256`.
    // Entonces no se desbordará en 2^8, ya que 256 es un `uint256` válido.
    

Esto significa que vamos a tener que implementar 2 librerías más para evitar los casos de desbordamientos con `uint16` y `uint32`. Podemos llamarlos `SafeMath16` y `SafeMath32`.

El código será exactamente igual al de SafeMath, excepto que todas las instancias de `uint256` serán reemplazadas por `uint32` o `uint16`.

Hemos avanzado esta parte e implementado el código por ti — ve a `safemath.sol` para ver el código.

Ahora tenemos que implementarlo en ZombieFactory.

## Vamos a probarlo

Tareas:

1. Declara que estamos usando `SafeMath32` para `uint32`.

2. Declara que estamos usando `SafeMath16` para `uint16`.

3. Hay una línea más de código en ZombieFactory donde deberíamos usar un método de SafeMath. Hemos dejado un comentario para indicar dónde.