---
title: Kontrakty Ownable
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
        
        // 1. Zaimportuj tutaj
        
        // 2. Odziedzicz tutaj:
        contract ZombieFactory {
        
        event NewZombie(uint zombieId, string name, uint dna);
        
        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        
        struct Zombie {
        string name;
        uint dna;
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
        
        function setKittyContractAddress(address _address) external {
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
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); randDna = randDna - randDna % 100; _createZombie(_name, randDna); }
      }
---
Zauważyłeś lukę w bezpieczeństwie w poprzednim rozdziale?

`setKittyContractAddress` jest `external`, więc każdy może to wywołać! Oznacza to, że każdy, kto wywołał tę funkcję, może zmienić adres umowy CryptoKitties i złamać naszą aplikację dla wszystkich jej użytkowników.

Chcemy mieć możliwość zaktualizowania tego adresu w naszej umowie, ale nie chcemy, aby wszyscy mogli go aktualizować.

Aby poradzić sobie z takimi przypadkami, jedną z powszechnych praktyk, która się pojawiła, jest zawarcie umów `Ownable` — co oznacza, że mają one właściciela (Ciebie), który ma specjalne uprawnienia.

## Kontrakt OpenZeppelin's `Ownable`

Poniższy kontrakt `Ownable` wzięty jest z biblioteki Solidity ***OpenZeppelin***. OpenZeppelin to biblioteka bezpiecznych i sprawdzonych przez społeczność inteligentnych kontraktów, z których możesz korzystać we własnych zdecentralizowanych aplikacjach. Po tej lekcji zdecydowanie zalecamy zapoznanie się z ich witryną w celu dalszej nauki!

Prześledź poniższy kontrakt. Zobaczysz kilka rzeczy, których jeszcze się nie nauczyłeś, ale nie martw się, porozmawiamy o nich później.

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
    

Kilka nowych rzeczy, których nie widzieliśmy wcześniej:

- Konstruktory: `function Ownable()` jest ***konstruktorem***, który jest opcjonalną, specjalną funkcją i ma taką samą nazwę jak kontrakt. Zostanie wykonany tylko jeden raz, kiedy umowa zostanie po raz pierwszy utworzona.
- Modyfikatory funkcji: `modifier onlyOwner()`. Modyfikatory to rodzaj półfunkcji, które służą do modyfikowania innych funkcji, zwykle w celu sprawdzenia niektórych wymagań przed wykonaniem. W tym przypadku `onlyOwner` może zostać użyty do ograniczenia dostępu, więc **tylko**** właściciel ** umowy może uruchomić tę funkcję. Porozmawiamy więcej o modyfikatorach funkcji w kolejnym rozdziale oraz o tym, co robi ten dziwny znak `_;`.
- Słowo kluczowe `indexed`: nie przejmujmy sie tym, narazie tego nie będziemy potrzebować.

Więc kontrakty `Ownable` zasadniczo powodują następujące rzeczy:

1. Kiedy kontrakt jest utworzony, jego konstruktor ustawia `owner(właściciela)` dla `msg.sender`

2. Dodaje modyfikator `onlyOwner`, który może ograniczyć dostęp do wybranych funkcji tylko dla `owner`

3. Umożliwia przeniesienie umowy do nowego właściciela (`owner</ code>)</p></li>
</ol>

<p><code>onlyOwner<code> jest tak powszechnym wymogiem dla kontraktów, że większość aplikacji Solidity zaczyna się od kopiuj/wklej kontraktu <code>Ownable`, a następnie pierwszy kontrakt dziedziczy z niego.
    
    Since we want to limit `setKittyContractAddress` to `onlyOwner`, we're going to do the same for our contract.
    
    ## Put it to the test
    
    We've gone ahead and copied the code of the `Ownable` contract into a new file, `ownable.sol`. Let's go ahead and make `ZombieFactory` inherit from it.
    
    1. Modify our code to `import` the contents of `ownable.sol`. If you don't remember how to do this take a look at `zombiefeeding.sol`.
    
    2. Modify the `ZombieFactory` contract to inherit from `Ownable`. Again, you can take a look at `zombiefeeding.sol` if you don't remember how this is done.