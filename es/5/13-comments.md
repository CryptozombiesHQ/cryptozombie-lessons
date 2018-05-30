---
title: Comentarios
actions:
  - 'comprobarRespuesta'
  - 'pistas'
requireLogin: verdadero
material:
  editor:
    language: sol
    startingCode:
      "zombieownership.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombieattack.sol";
        import "./erc721.sol";
        import "./safemath.sol";
        
        /// TODO: Reemplaza esto con descripciones natspec
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
        randNonce = randNonce.add(1);
        return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
        
        function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
        Zombie storage myZombie = zombies[_zombieId];
        Zombie storage enemyZombie = zombies[_targetId];
        uint rand = randMod(100);
        if (rand <= attackVictoryProbability) {
        myZombie.winCount = myZombie.winCount.add(1);
        myZombie.level = myZombie.level.add(1);
        enemyZombie.lossCount = enemyZombie.lossCount.add(1);
        feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
        } else {
        myZombie.lossCount = myZombie.lossCount.add(1);
        enemyZombie.winCount = enemyZombie.winCount.add(1);
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
        zombies[_zombieId].level = zombies[_zombieId].level.add(1);
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
      "zombiefactory.sol": |
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
---
¡El código de Solidity para nuestro juego zombi finalmente ha terminado!

En las próximas lecciones, veremos cómo desplegar el código en Ethereum y cómo interactuar con él utilizando Web3.js.

Pero una última cosa antes de que te dejemos ir de la Lección 5. Hablemos de **comentar tu código**.

## Sintaxis para los comentarios

Comentar en Solidity es como JavaScript. Ya has visto algunos ejemplos de comentarios de una sola línea a lo largo de las lecciones de CryptoZombies:

    // Este es un comentario de una sola línea. Es como una nota para uno mismo (o para otros)
    

Simplemente añade `//` en cualquier lugar y estarás comentando. Es tan fácil que deberías hacerlo todo el tiempo.

Pero te entiendo— a veces una sola línea no es suficiente. ¡Eres escritor, después de todo!

Por lo tanto, también tenemos comentarios de varias líneas:

    contract CryptoZombies {
      /* Este es un comentario de múltiples líneas. Me gustaría agradecerles a todos
        los que se han tomado su tiempo para probar este curso de programación.
        Sé que es gratis para todos ustedes, y se mantendrá libre
        para siempre, pero aún ponemos nuestro corazón y nuestra alma en hacer
        esto tan bueno como puede ser.
    
        Sepa que este es todavía el comienzo del desarrollo de Blockchain.
        We've come very far but there are so many ways to make this
        community better. If we made a mistake somewhere, you can
        help us out and open a pull request here:
        https://github.com/loomnetwork/cryptozombie-lessons
    
        Or if you have some ideas, comments, or just want to say
        hi - drop by our Telegram community at https://t.me/loomnetwork
      */
    }
    

In particular, it's good practice to comment your code to explain the expected behavior of every function in your contract. This way another developer (or you, after a 6 month hiatus from a project!) can quickly skim and understand at a high level what your code does without having to read the code itself.

The standard in the Solidity community is to use a format called ***natspec***, which looks like this:

    /// @title A contract for basic math operations
    /// @author H4XF13LD MORRIS 
      /// @param y the second uint.
      /// @return z the product of (x * y)
      /// @dev This function does not currently check for overflows
      function multiply(uint x, uint y) returns (uint z) {
        // This is just a normal comment, and won't get picked up by natspec
        z = x * y;
      }
    }
    

`@title` and `@author` are straightforward.

`@notice` explains to a **user** what the contract / function does. `@dev` is for explaining extra details to developers.

`@param` and `@return` are for describing what each parameter and return value of a function are for.

Note that you don't always have to use all of these tags for every function — all tags are optional. But at the very least, leave a `@dev` note explaining what each function does.

# Put it to the test

If you haven't noticed by now, the CryptoZombies answer-checker ignores comments when it checks your answers. So we can't actually check your natspec code for this chapter ;)

However, by now you're a Solidity whiz — we're just going to assume you've got this!

Give it a try anyway, and try adding some natspec tags to `ZombieOwnership`:

1. `@title` — E.g. A contract that manages transfering zombie ownership

2. `@author` — Your name!

3. `@dev` — E.g. Compliant with OpenZeppelin's implementation of the ERC721 spec draft