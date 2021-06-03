---
title: Modyfikator funkcji onlyOwner
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
requireLogin: prawda
material:
  editor:
    language: sol
    startingCode:
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

        // Modify this function:
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
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

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
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      KittyInterface kittyContract;
      function setKittyContractAddress(address _address) external onlyOwner { kittyContract = KittyInterface(_address); }
      function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---

Nasz bazowy kontrakt `ZombieFactory` dziedziczy z `Ownable`, więc możemy użyć modyfikatora funkcji `onlyOwner` w `ZombieFeeding`.

Zawdzięczamy to działaniu dziedziczenia. Zapamiętaj:

    ZombieFeeding is ZombieFactory
    ZombieFactory is Ownable
    

Więc `ZombieFeeding` jest również `Ownable` i może mieć dostęp do funkcji / eventów / modyfikatorów z kontraktu `Ownable`. Dotyczy to wszelkich umów, które dziedziczą z `ZombieFeeding` w przyszłości również.

## Modyfikatory funkcji

Modyfikator funkcji wygląda podobnie jak funkcja, ale używa słowa kluczowego `modifier` zamiast słowa `function`. I nie może być wywoływany bezpośrednio jak funkcja — zamiast tego możemy dołączyć nazwę modyfikatora na końcu definicji funkcji, aby zmienić zachowanie tej funkcji.

Przyjrzyjmy się bliżej aby przebadać `onlyOwner`:

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
    

Notice the `onlyOwner` modifier on the `renounceOwnership` function. When you call `renounceOwnership`, the code inside `onlyOwner` executes **first**. Then when it hits the `_;` statement in `onlyOwner`, it goes back and executes the code inside `renounceOwnership`.

So while there are other ways you can use modifiers, one of the most common use-cases is to add a quick `require` check before a function executes.

In the case of `onlyOwner`, adding this modifier to a function makes it so **only** the **owner** of the contract (you, if you deployed it) can call that function.

> Uwaga: Nadawanie właścicielowi specjalnych uprawnień nad kontraktem, często jest konieczne, ale może też zostać użyte złosliwie. Na przykład właściciel może dodać funkcję backdoor, która pozwoli mu przekazać sobie czyjeś Zombiaki!
> 
> Ważnym więc jest, aby pamiętać, że aplikacja zdecentralizowana na Ethereum nie oznacza automatycznie decentralizacji — trzeba tak właściwie przeczytać pełny kod źródłowy, aby upewnić się czy jest wolna od specjalnych kontroli przez właściciela, które mogą Cię potencjalnie martwić. Istnieje równowaga między deweloperem utrzymującym kontrolę nad DApp, taką, że może naprawiać potencjalne błędy, a stworzeniem platformy nie posiadającej właściciela, której użytkownicy mogą zaufać i zabezpieczyć swoje dane.

## Wypróbujmy zatem

Now we can restrict access to `setKittyContractAddress` so that no one but us can modify it in the future.

1. Dodaj modyfikator `onlyOwner` do `setKittyContractAddress`.