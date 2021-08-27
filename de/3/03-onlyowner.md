---
title: onlyOwner Function Modifier
actions:
  - 'checkAnswer'
  - 'hints'
requireLogin: true
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
        
        // Modify this function:
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
      function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(_species) == keccak256("kitty")) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---
Now that our base contract `ZombieFactory` inherits from `Ownable`, we can use the `onlyOwner` function modifier in `ZombieFeeding` as well.

This is because of how contract inheritance works. Remember:

    ZombieFeeding is ZombieFactory
    ZombieFactory is Ownable
    

Thus `ZombieFeeding` is also `Ownable`, and can access the functions / events / modifiers from the `Ownable` contract. This applies to any contracts that inherit from `ZombieFeeding` in the future as well.

## Function Modifiers

A function modifier looks just like a function, but uses the keyword `modifier` instead of the keyword `function`. And it can't be called directly like a function can — instead we can attach the modifier's name at the end of a function definition to change that function's behavior.

Let's take a closer look by examining `onlyOwner`:

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
    

We would use this modifier as follows:

    contract MyContract is Ownable {
      event LaughManiacally(string laughter);
    
      // Note the usage of `onlyOwner` below:
      function likeABoss() external onlyOwner {
        LaughManiacally("Muahahahaha");
      }
    }
    

Notice the `onlyOwner` modifier on the `likeABoss` function. When you call `likeABoss`, the code inside `onlyOwner` executes **first**. Then when it hits the `_;` statement in `onlyOwner`, it goes back and executes the code inside `likeABoss`.

So while there are other ways you can use modifiers, one of the most common use-cases is to add quick `require` check before a function executes.

In the case of `onlyOwner`, adding this modifier to a function makes it so **only** the **owner** of the contract (you, if you deployed it) can call that function.

> Note: Giving the owner special powers over the contract like this is often necessary, but it could also be used maliciously. For example, the owner could add a backdoor function that would allow him to transfer anyone's zombies to himself!
> 
> So it's important to remember that just because a DApp is on Ethereum does not automatically mean it's decentralized — you have to actually read the full source code to make sure it's free of special controls by the owner that you need to potentially worry about. There's a careful balance as a developer between maintaining control over a DApp such that you can fix potential bugs, and building an owner-less platform that your users can trust to secure their data.

## Put it to the test

Now we can restrict access to `setKittyContractAddress` so that no one but us can modify it in the future.

1. Add the `onlyOwner` modifier to `setKittyContractAddress`.
