---
title: Czas oczekiwania Zombi
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
requireLogin: prawda
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
        
        // 1. Zdefiniuj tutaj funkcję `_triggerCooldown`
        
        // 2. Tutaj funkcję `_isReady`
        
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
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
        address public owner;
        
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        
        /**
        * @dev The Ownable constructor sets the original `owner` of the contract to the sender
        * account.
        */
        function Ownable() public {
        owner = msg.sender;
        }
        
        
        /**
        * @dev Throws if called by any account other than the owner.
        */
        modifier onlyOwner() {
        require(msg.sender == owner);
        _;
        }
        
        
        /**
        * @dev Allows the current owner to transfer control of the contract to a newOwner.
        * @param newOwner The address to transfer ownership to.
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
Kiedy mamy już właściwość `readyTime` w naszej strukturze `Zombie`, zajrzyjmy do `zombiefeeding.sol` i zaimplementujmy timer.

Zmodyfikujemy `feedAndMultiply` w taki oto sposób:

1. Karmienie włącza czas oczekiwania Zombiaka i

2. Zombiaki nie mogą karmić się kotkami do momentu upłynięcia czasu oczekiwania

Będzie to zapobiegało możliwości nieskończonego karmienia się i mnożenia. W przyszłości, kiedy dodamy system walki, zrobimy tak, aby atakowanie innych Zombi również opierało się na czasie oczekiwania.

Najpierw, zdefiniujmy funkcje pomocnicze, które pozwolą nam ustawić i sprawdzić `readyTime` Zombiaka.

## Przekazywanie struktur jako argumenty

Możesz ustawić wskaźnik pamięci do struktury jako argument funkcji `private` lub `internal`. Jest to przydatne, na przykład, przekazanie struktur `Zombie` pomiędzy funkcjami.

Składnia wygląda tak:

    function _doStuff(Zombie storage _zombie) internal {
      // rób coś z _zombie
    }
    

W ten sposób możemy przekazać odwołanie do naszych Zombi wewnątrz funkcji, zamiast przekazując identyfikator Zombi i sprawdzać go.

## Wypróbujmy zatem

1. Zacznij od zdefiniowania funkcji `_triggerCooldown`. Będzie ona miała 1 argument, `_zombie`, typu wskaźnikowego `Zombie storage`. Funkcja powinna być `internal`.

2. W ciele funkcji ustawmy `_zombie.readyTime` równe `uint32(now + cooldownTime)`.

3. Następnie należy utworzyć funkcję o nazwie `_isReady`. Funkcja ta również przyjmie argument `Zombie storage` z nazwą `_zombie`. Będzie to funkcja `internal view` zwracająca rezultat typu `bool`.

4. W ciele funkcji powinniśmy zwrócić `(_zombie.readyTime <= now)`, które wynik oceni jako `true` lub `false`. This function will tell us if enough time has passed since the last time the zombie fed.