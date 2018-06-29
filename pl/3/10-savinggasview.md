---
title: Saving Gas With 'View' Functions
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
        
        // Utwórz tutaj Twoją funkcję
        
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
      function getZombiesByOwner(address _owner) external view returns(uint[]) {
      }
      }
---
Imponujące! Teraz mamy już specjalne umiejętności dla Zombiaków o wyższym poziomie, aby zachęcić ich właścicieli do podnoszenia tego poziomu. Jeśli będziemy chcieli, możemy później dodać ich więcej.

Dodajmy jeszcze jedną funkcję: nasza DApp potrzebuje metody do wyświetlania całej armii Zombiaków, którą posiada user — nazwijmy ją `getZombiesByOwner`.

Funkcja ta będzie potrzebowała jedynie odczytać dane z blockchain'a, więc możemy oznaczyć ją `view`. Pokazuje nam to ważny aspekt jeżeli chodzi o optymalizację zużycia gazu:

## Funkcje "view" nie generują kosztów gazu

Funkcje `view` nie kosztują gazu, gdy są wywoływane zewnętrznie przez użytkownika.

A to z tego powodu, że funkcje `view` tak właściwie nie zmieniają niczego w blockchain'ie - one tylko odczytują dane. Więc oznaczenie funkcji jako `view` mówi `web3.js`, że potrzebuje tylko zapytać lokalny węzeł Ethereum o uruchomienie funkcji i tak właściwie nie tworzy transakcji w blockchain'ie (która musi być uruchomiona na każdym pojedynczym węźle i kosztuje gaz).

Ustawianiem web3.js i tworzeniem własnego węzła zajmiemy się później. A na tą chwilę, sporą nauką jest dla nas fakt, że możemy optymalizować zużycie gazu przez użytkowników dzięki stosowaniu funkcji `external view` tam, gdzie jest to możliwe.

> Uwaga: Jeśli funkcja `view` jest wywołana wewnętrznie poprzez inną funkcję w tym samym kontrakcie to **nie** jest to funkcja `view` i będzie ona nadal generowała koszty gazu. Jest tak ponieważ ta inna funkcja tworzy transakcje na Ethereum i stale musi być weryfikowana poprzez każdy węzeł w sieci. Więc funkcje `view` są "wolne" tylko wtedy, gdy są one wywoływane zewnętrznie.

## Wypróbujmy zatem

Zamierzamy zaimplementować funkcję, która zwróci nam całą armię Zombi użytkownika. Możemy tę funkcję później wywołać z `web3.js` jeśli chcemy wyświetlić profil usera z jego całą armią.

Logika funkcji jest troszkę skomplikowana, więc zajmie nam to kilka rozdziałów zanim ją zaimplementujemy.

1. Stwórz nową funkcję o nazwie `getZombiesByOwner`. Ma ona odbierać jeden argument typu `address` o nazwie `_owner`.

2. Oznaczmy ją jako `external view`, więc będziemy mogli ją wywołać z `web3.js` bez zużycia gazu.

3. Funkcja ta powinna zwracać `uint[]` (tablicę `uint`).

Ciało funkcji pozostawmy puste, wypełnimy ją w następnym rozdziale.