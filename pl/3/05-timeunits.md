---
title: Jednostki czasu
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
requireLogin: prawda
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

        event NewZombie(uint zombieId, string name, uint dna);

        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        // 1. Define `cooldownTime` here

        struct Zombie {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        }

        Zombie[] public zombies;

        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;

        function _createZombie(string memory _name, uint _dna) internal {
        // 2. Update the following line:
        uint id = zombies.push(Zombie(_name, _dna)) - 1;
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender]++;
        emit NewZombie(id, _name, _dna);
        }

        function _generateRandomDna(string memory _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
        }

        function createRandomZombie(string memory _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
        }

        }
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

        function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
      "ownable.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        /**
        * @title Ownable
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
        address private _owner;

        event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
        );

        /**
        * @dev The Ownable constructor sets the original `owner` of the contract to the sender
        * account.
        */
        constructor() internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
        }

        /**
        * @return the address of the owner.
        */
        function owner() public view returns(address) {
        return _owner;
        }

        /**
        * @dev Throws if called by any account other than the owner.
        */
        modifier onlyOwner() {
        require(isOwner());
        _;
        }

        /**
        * @return true if `msg.sender` is the owner of the contract.
        */
        function isOwner() public view returns(bool) {
        return msg.sender == _owner;
        }

        /**
        * @dev Allows the current owner to relinquish control of the contract.
        * @notice Renouncing to ownership will leave the contract without an owner.
        * It will not be possible to call the functions with the `onlyOwner`
        * modifier anymore.
        */
        function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
        }

        /**
        * @dev Allows the current owner to transfer control of the contract to a newOwner.
        * @param newOwner The address to transfer ownership to.
        */
        function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
        }

        /**
        * @dev Transfers control of the contract to a newOwner.
        * @param newOwner The address to transfer ownership to.
        */
        function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
        }
        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./ownable.sol";
      contract ZombieFactory is Ownable {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits; uint cooldownTime = 1 days;
      struct Zombie { string name; uint dna; uint32 level; uint32 readyTime; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); randDna = randDna - randDna % 100; _createZombie(_name, randDna); }
      }
---

Właściwość `level` raczej nie wymaga komentarza. Poźniej, gdy stworzymy system walki, Zombiaki, które wygrają więcej bitew będą zwiększały z czasem swój poziom i zyskiwały więcej umiejętności.

Właściwość `readyTime` wymaga nieco więcej wyjaśnień. Celem jest, aby dodać "czas odnowienia", czyli czas, kiedy Zombi musi czekać po nakarmieniu lub zaatakowaniu zanim nastąpi możliwość ponownego karmienia / ataku. Bez tego Zombiaki mogłyby atakować i mnożyć się 1000 razy na dobę, co czyniłoby grę zbyt łatwą.

Aby śledzić, ile czasu Zombi musi czekać do ponownego zaatakowania, możemy użyć jednostek czasu Solidity.

## Jednostki czasu

Solidity zapewnia wbudowane jednostki do radzenia sobie z czasem.

Zmienna `now` zwróci aktualny uniksowy znacznik czasu ostatniego bloku (ilość sekund która upłynęła od 1go stycznia 1970 roku). Czas uniksowy w chwili pisania tego tekstu to `1515527488`.

> Uwaga: Czas uniksowy tradycyjnie jest przechowywany w liczbach 32-bitowych. Prowadzi to do problemu "Roku 2038", kiedy to 32-bitowe znaczniki systemu unix będą przepełnione i złamią stare systemy. Więc jeśli chcieliśmy, aby nasza DApp została utrzymana przez 20 lat od teraz, powinniśmy użyć zamiast tego numeru 64-bitowego — ale nasi użytkownicy musieliby zapłacić za to więcej gazu. Decyzje projektowe!

Solidity zawiera również jednostki takie jak `sekundy`, `minuty`, `godziny`, `dni`, `tygodnie` i `lata`. Będzie to konwertowane do `uint`, liczby sekund tego okresu. Więc `1 minuta` to `60`, `1 godzina`, to</code> `3600` (60 sekund x 60 minut), `1 dzień` to `86400` (24 godziny x 60 minut x 60 sekund), itd.

Oto przykład jak możemy wykorzystać te jednostki czasu:

    uint lastUpdated;
    
    // Ustaw`lastUpdated` jako`now`
    function updateTimestamp() public {
      lastUpdated = now;
    }
    
    // Zwróci `true` jeśli upłynie 5 minut od momentu wywołania `updateTimestamp`,
    // `false` jeśli nie upłynie 5 minut
    function fiveMinutesHavePassed() public view returns (bool) {
      return (now >= (lastUpdated + 5 minutes));
    }
    

Możemy użyć tych jednostek czasu dla naszego Zombi. Właściwość `czas oczekiwania`.

## Wypróbujmy zatem

Dodaj czas oczekiwania do naszej DApp i spraw, aby Zombiaki musiały odczekać **1 dzień** po ataku lub nakarmieniu się.

1. Zadeklaruj `uint` o nazwie `cooldownTime`, ustaw równe `1 dzień`. (Wybacz niepoprawną gramatykę — jeśli ustawisz ją na "1 dzień", to się nie skompiluje!)

2. Odkąd dodaliśmy `level` i `readyTime` do naszej struktury `Zombie` w poprzednim rozdziale, potrzebujemy zaktualizować `_createZombie()`, aby używała poprawnej liczby argumentów kiedy utworzymy nową strukturę `Zombie`.
    
    Zaktualizuj linijkę `zombies.push` poprzez dodanie dwóch argumentów `1` (dla `level`) i `uint32(now + cooldownTime)` (dla `readyTime`).

> Uwaga: `uint32(...)` jest niezbędny, ponieważ `now` zwraca domyślnie `uint256`. Więc musimy jawnie przekonwertować go do `uint32`.

`now + cooldownTime` będzie równe aktualnemu uniksowemu znacznikowi czasu (w sekundach) plus liczba sekund z jednego dnia — która będzie równa uniksowemu znacznikowi czasu 1 dzień od teraz. Potem możemy porównać czy `readyTime` Zombiaka jest większy od `now`, w celu sprawdzenia upłynięcia czasu i możliwości ponownego użycia Zombi.

W następnym rozdziale zaimplementujemy funkcjonalność ograniczającą operacje oparte na `readyTime`.