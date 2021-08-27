---
title: Handling Multiple Return Values
actions:
  - 'checkAnswer'
  - 'hints'
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
        
        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);
        
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        _createZombie("NoName", newDna);
        }
        
        // define function here
        
        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;
        
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
        
        function _generatePseudoRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
        }
        
        function createPseudoRandomZombie(string _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generatePseudoRandomDna(_name);
        _createZombie(_name, randDna);
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d; KittyInterface kittyContract = KittyInterface(ckAddress);
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna); }
      }
---
This `getKitty` function is the first example we've seen that returns multiple values. Let's look at how to handle them:

    function multipleReturns() internal returns(uint a, uint b, uint c) {
      return (1, 2, 3);
    }
    
    function processMultipleReturns() external {
      uint a;
      uint b;
      uint c;
      // This is how you do multiple assignment:
      (a, b, c) = multipleReturns();
    }
    
    // Or if we only cared about one of the values:
    function getLastReturnValue() external {
      uint c;
      // We can just leave the other fields blank:
      (,,c) = multipleReturns();
    }
    

# Put it to the test

Time to interact with the CryptoKitties contract!

Let's make a function that gets the kitty genes from the contract:

1. Make a function called `feedOnKitty`. It will take 2 `uint` parameters, `_zombieId` and `_kittyId`, and should be a `public` function.

2. The function should first declare a `uint` named `kittyDna`.
    
    > Note: In our `KittyInterface`, `genes` is a `uint256` — but if you remember back to lesson 1, `uint` is an alias for `uint256` — they're the same thing.

3. The function should then call the `kittyContract.getKitty` function with `_kittyId` and store `genes` in `kittyDna`. Remember — `getKitty` returns a ton of variables. (10 to be exact — I'm nice, I counted them for you!). But all we care about is the last one, `genes`. Count your commas carefully!

4. Finally, the function should call `feedAndMultiply`, and pass it both `_zombieId` and `kittyDna`.
