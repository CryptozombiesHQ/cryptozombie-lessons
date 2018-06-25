---
title: Gaz
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
requireLogin: prawda
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;
        
        import "./ownable.sol";
        
        contract ZombieFactory is Ownable {
        
        event NewZombie(uint zombieId, string name, uint dna);
        
        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        
        struct Zombie {
        string name;
        uint dna;
        // Dodaj tutaj nowe dane
        }
        
        Zombie[] public zombies;
        
        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;
        
        function _createZombie(string _name, uint _dna) internal {
        uint id = zombies.push(Zombie(_name, _dna)) - 1;
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
      import "./ownable.sol";
      contract ZombieFactory is Ownable {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; uint32 level; uint32 readyTime; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); randDna = randDna - randDna % 100; _createZombie(_name, randDna); }
      }
---
Wspaniale! Teraz już wiemy jak aktualizować kluczowe części zdecentralizowanej aplikacji, aby uniemożliwić innym użytkownikom manipulowanie naszymi umowami.

Spójrzmy jak Solidity różni się od innych języków programowania:

## Gaz — paliwo, które napędza zdecentralizowane aplikacje (DApps) na Ethereum

W Solidity, użytkownicy muszą płacić za każdym razem, gdy wywołują funkcję Twojej DApp, używając do tego waluty zwanej ***gazem***. Użytkownicy kupują gaz za Ether (waluta na Ethereum), więc muszą oni wydać ETH jeśli chcą wykonać jakieś funkcje zawarte w Twojej aplikacji.

Ile gazu jest wymagane do wykonania funkcji zależy od tego, jak skomplikowana jest logika tej funkcji. Każda operacja posiada swój ***koszt gazu***, który zależy od tego ile zasobów obliczeniowych komputera zaangażowane jest do wykonywania tej operacji (np. zapis do pamięci masowej jest znacznie bardziej kosztowny niż dodawanie dwóch liczb całkowitych). Sumaryczny ***koszt gazu*** Twojej funkcji jest sumą kosztów poszczególnych jej operacji.

Ponieważ wywoływanie funkcji kosztuje realne pieniądze, optymalizacja kodu w Ethereum jest bardziej istotna niż w innych aplikacjach czy językach programowania. Jeśli kod jest zaniedbany, Twoi użytkownicy będą musieli płacić więcej, aby wykonywać funkcje — a to może spowodować miliony dolarów dodatkowych, niepotrzebnych opłat dla tysięcy użytkowników.

## Dlaczego gaz jest konieczny?

Ethereum jest jak wielki, powolny, ale niezwykle bezpieczny komputer. Kiedy wywołujesz funkcję, każdy węzeł (node) sieci musi uruchomić tę samą funkcję w celu zweryfikowania danych wyjściowych — tysiące nodów, które sprawdzają każde wywołanie funkcji, sprawiają, że Ethereum jest zdecentralizowane, a dane tej sieci są niezmienne i odporne na cenzurę.

Twórcy Ethereum chcieli zapewnić, że nikt nie zapcha sieci nieskończona pętlą albo nie wykorzysta wszystkich zasobów sieci do bardzo intensywnych obliczeń. Więc uczynili transakcje płatnymi i użytkownicy muszą płacić za obliczenia oraz przechowywanie danych.

> Uwaga: To niekoniecznie musi być prawda w przypadku sidechain'ów, jak te, które autorzy CryptoZombies budują w Loom Network. Prawdopodobnie nigdy nie będzie miało sensu odpalenie gry takiej jak World of Warcraft bezpośrednio na głównej sieci Ethereum — koszt gazu byłby wtedy zaporą. Ale może ona działać na sidechain'ie z innym algorytmem konsensusu. Porozmawiamy o typach DApps, które możesz wdrożyć na sidechain'ie lub głównej sieci Ethereum w kolejnej lekcji.

## Użycie "struct" w celu oszczędzania gazu

In Lesson 1, we mentioned that there are other types of `uint`s: `uint8`, `uint16`, `uint32`, etc.

Normally there's no benefit to using these sub-types because Solidity reserves 256 bits of storage regardless of the `uint` size. For example, using `uint8` instead of `uint` (`uint256`) won't save you any gas.

But there's an exception to this: inside `struct`s.

If you have multiple `uint`s inside a struct, using a smaller-sized `uint` when possible will allow Solidity to pack these variables together to take up less storage. For example:

    struct NormalStruct {
      uint a;
      uint b;
      uint c;
    }
    
    struct MiniMe {
      uint32 a;
      uint32 b;
      uint c;
    }
    
    // `mini` will cost less gas than `normal` because of struct packing
    NormalStruct normal = NormalStruct(10, 20, 30);
    MiniMe mini = MiniMe(10, 20, 30); 
    

For this reason, inside a struct you'll want to use the smallest integer sub-types you can get away with.

You'll also want to cluster identical data types together (i.e. put them next to each other in the struct) so that Solidity can minimize the required storage space. For example, a struct with fields `uint c; uint32 a; uint32 b;` will cost less gas than a struct with fields `uint32 a; uint c; uint32 b;` because the `uint32` fields are clustered together.

## Put it to the test

In this lesson, we're going to add 2 new features to our zombies: `level` and `readyTime` — the latter will be used to implement a cooldown timer to limit how often a zombie can feed.

So let's jump back to `zombiefactory.sol`.

1. Add two more properties to our `Zombie` struct: `level` (a `uint32`), and `readyTime` (also a `uint32`). We want to pack these data types together, so let's put them at the end of the struct.

32 bits is more than enough to hold the zombie's level and timestamp, so this will save us some gas costs by packing the data more tightly than using a regular `uint` (256-bits).