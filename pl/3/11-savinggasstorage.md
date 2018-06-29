---
title: '"storage" jest kosztowne'
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
requireLogin: prawda
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefeeding.sol";
        
        contract ZombieHelper is ZombieFeeding {
        
        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
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
        // Zacznij tutaj
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
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[]) { uint[] memory result = new uint[](ownerZombieCount[_owner]);
      return result; }
      }
---
Jedną z najbardziej kosztownych operacji w Solidity jest używanie `storage`.

Jest tak, ponieważ gdy za każdym razem zapisujesz lub zmieniasz trochę danych, trafia to na stałe do sieci blockchain. Na zawsze! Tysiące węzłów na świecie musi przechowywać te dane na swoich dyskach, a ilość tych danych ciągle wrasta wraz z powiększaniem się blockchain'a. Więc pojawiają się koszty.

Aby obniżyć koszty, nie należy zapisywać danych w pamięci, chyba że jest to absolutnie konieczne. Czasami wymaga to pozornie nieefektywnej logiki programistycznej — jak na przykład przebudowywanie tablicy w `pamięci` za każdym razem, gdy wywoływana jest funkcja, zamiast po prostu zapisywania tej tablicy w zmiennej w celu szybkiego wyszukiwania.

W większości języków programowania, stosowanie pętli wokół dużych zestawów danych jest kosztowne. Ale w Solidity, ten sposób jest oszczędniejszy niż użycie `storage` jeśli jest to funkcja `external view`, a funkcje `view` nie kosztują Twoich użytkowników żadnej ilości gazu. (a gaz kosztuje prawdziwe pieniądze!).

Do pętli `for` przejdziemy w następnym rozdziale, ale najpierw, zobaczmy jak deklarować tablice w pamięci.

## Deklarowanie tablic w pamięci

Możesz użyć słowa kluczowego `memory` z tablicami, aby stworzyć wewnątrz funkcji nową tablicę bez potrzeby pisania czegokolwiek do przechowywania. Tablica będzie istniała tylko do końca wywołania funkcji i jest to oszczędność gazu większa, niż aktualizowanie tablicy w `storage` — jeśli jest to funkcja `view` wywołana zewnętrznie.

Oto sposób deklarowania tablicy w pamięci:

    function getArray() external pure returns(uint[]) {
      // Utworzenie nowej tablicy w pamięci o długości 3
      uint[] memory values = new uint[](3);
      // Add some values to it
      values.push(1);
      values.push(2);
      values.push(3);
      // Return the array
      return values;
    }
    

Jest to trywialny przykład do pokazania składni, ale w następnym rozdziale zobaczymy jak połączyć to z pętlami `for` dla realnych przypadków.

> Uwaga: tablice w pamięci **muszą** być utworzone z argumentem określającym jej długość (w tym przypadku `3`). Obecnie nie można zmienić ich rozmiaru tak, jak można to robić z macierzami pamięci masowej poprzez `array.push()`, jednakże może się to zmienić w przyszłych wersjach języka Solidity.

## Wypróbujmy zatem

In our `getZombiesByOwner` function, we want to return a `uint[]` array with all the zombies a particular user owns.

1. Declare a `uint[] memory` variable called `result`

2. Set it equal to a new `uint` array. The length of the array should be however many zombies this `_owner` owns, which we can look up from our `mapping` with: `ownerZombieCount[_owner]`.

3. At the end of the function return `result`. It's just an empty array right now, but in the next chapter we'll fill it in.