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
        pragma solidity >=0.5.0 <0.6.0;

        // 1. Zaimportuj tutaj

        // 2. Inherit here:
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

        function _createZombie(string memory _name, uint _dna) internal {
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

        function setKittyContractAddress(address _address) external {
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
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); randDna = randDna - randDna % 100; _createZombie(_name, randDna); }
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
    

Kilka nowych rzeczy, których nie widzieliśmy wcześniej:

- Constructors: `function Ownable()` is a ***constructor***, which is an optional special function that has the same name as the contract. It will get executed only one time, when the contract is first created.
- Modyfikatory funkcji: `modifier onlyOwner()`. Modyfikatory to rodzaj półfunkcji, które służą do modyfikowania innych funkcji, zwykle w celu sprawdzenia niektórych wymagań przed wykonaniem. W tym przypadku `onlyOwner` może zostać użyty do ograniczenia dostępu, więc **tylko**** właściciel ** umowy może uruchomić tę funkcję. Porozmawiamy więcej o modyfikatorach funkcji w kolejnym rozdziale oraz o tym, co robi ten dziwny znak `_;`.
- Słowo kluczowe `indexed`: nie przejmujmy sie tym, narazie nie będziemy tego potrzebować.

Więc kontrakty `Ownable` zasadniczo powodują następujące rzeczy:

1. Kiedy kontrakt jest utworzony, jego konstruktor ustawia `owner(właściciela)` dla `msg.sender`

2. Dodaje modyfikator `onlyOwner`, który może ograniczyć dostęp do wybranych funkcji tylko dla `owner`

3. Umożliwia przeniesienie umowy do nowego właściciela (`owner</ code>)</p></li>
</ol>

<p><code>onlyOwner` jest tak powszechnym wymogiem dla kontraktów, że większość aplikacji Solidity zaczyna się od kopiuj/wklej kontraktu `Ownable`, a następnie pierwszy kontrakt dziedziczy z niego.
    
    Ponieważ chcemy ograniczyć `setKittyContractAddress` do `onlyOwner`, zrobimy to samo dla naszej umowy.
    
    ## Wypróbujmy zatem
    
    Poszliśmy dalej i skopiowaliśmy kod kontraktu `Ownable` do nowego pliku o nazwie `ownable.sol`. Zacznijmy od tego, aby `ZombieFactory` dziedziczył po nim.
    
    1. Zmodyfikuj nasz kod aby `importował` zawartość `ownable.sol`. Jeśli nie pamiętasz, jak to zrobić, zajrzyj do `zombiefeeding.sol`.
    
    2. Zmodyfikuj umowę `ZombieFactory`, tak aby dziedziczyć po `Ownable`. Znowu możesz rzucić okiem na `zombiefeeding.sol`, jeśli nie pamiętasz, jak się to robi.