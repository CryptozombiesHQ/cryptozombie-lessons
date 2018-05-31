---
title: Enfriamiento de los Zombis
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
        
        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }
        
        // 1. Define la función `_triggerCooldown`aquí
        
        // 2. Define la función`_isReady`aquí
        
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
        * @title Ownable
        * @dev El Contrato Ownable tiene una dirección de propietario, y ofrece funciones de control
        * permisos básicos, esto simplifica la implementación de "permisos de usuario".
        */
        contract Ownable {
        address public owner;
        
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        
        /**
        * @dev El constructor del Ownable establece al `owner` (propietario) original del contrato.
        * a la dirección de la cuenta del remitente.
        */
        function Ownable() public {
        owner = msg.sender;
        }
        
        
        
        /**
        * @dev Abandonar si es llamado por una cuenta que no sea el `owner`.
        */
        modifier onlyOwner() {
        require(msg.sender == owner);
        _;
        }
        
        
        /**
        * @dev Permite al propietario actual transferir el control del contrato a un newOwner (nuevo propietario).
        * @param newOwner La dirección del nuevo propietario.
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
      function setKittyContractAddress(address _address) external onlyOwner { kittyContract = KittyInterface(_address); }
      function _triggerCooldown(Zombie storage _zombie) internal { _zombie.readyTime = uint32(now + cooldownTime); }
      function _isReady(Zombie storage _zombie) internal view returns (bool) { return (_zombie.readyTime <= now); }
      function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(_species) == keccak256("kitty")) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---
Ahora que tenemos la propiedad `readyTime` en nuestra estructura `Zombie`, vamos a pasar a `zombiefeeding.sol` e implementar el contador de enfriamiento.

Vamos a modificar nuestro `feedAndMultiply` de tal manera que:

1. Alimentarse activa el enfriamiento del zombi, y

2. Los zombis no podrán alimentarse de gatitos hasta que su periodo de enfriamiento haya concluido

Esto hará que los zombis no se alimenten de gatitos ilimitados y se multipliquen durante todo el día. En el futuro, cuando añadamos la funcionalidad de batalla, haremos que el atacar a otros zombis también tenga su enfriamiento.

Primero, vamos a definir alguna función auxiliar que nos ajuste y verifique el `readyTime` del zombi.

## Pasando estructuras como argumentos

Puedes pasar un puntero storage a una estructura como argumento a una función `private` o `internal`. Esto es práctico, por ejemplo, para pasar entre funciones la estructura de nuestro `Zombie`.

La sintaxis sería algo así:

    function _doStuff(Zombie storage _zombie) internal {
      // haz cosas con _zombie
    }
    

De esta manera podemos pasar una referencia a nuestro zombi en una función en vez de pasar la ID del zombi y comprobar cual es.

## Vamos a probarlo

1. Empieza definiendo una función `_triggerCooldown`. Esta tomará 1 argumento, `_zombie`, un puntero a `Zombie storage`. La función deberá ser `internal`.

2. El cuerpo de la función deberá ajustar `_zombie.readyTime` a `uint32(now + cooldownTime)`.

3. Luego, crea una función llamada `_isReady`. Esta función también recibirá un argumento `Zombie storage` llamado `_zombie`. Esta será una función `internal view`, y devolverá un `bool`.

4. El cuerpo de la función deberá devolver `(_zombie.readyTime <= now)`, que evaluará si es `true` o `false`. Esta función nos dirá si ha pasado el suficiente tiempo desde la última vez que un zombi se alimentó.