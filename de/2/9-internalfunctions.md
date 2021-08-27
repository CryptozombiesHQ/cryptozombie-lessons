---
title: More on Function Visibility
actions:
  - 'checkAnswer'
  - 'hints'
material:
  editor:
    language: sol
    startingCode:
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
        
        // edit function definition below
        function _createZombie(string _name, uint _dna) private {
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
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefactory.sol";
        
        contract ZombieFeeding is ZombieFactory {
        
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        _createZombie("NoName", newDna);
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generatePseudoRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createPseudoRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generatePseudoRandomDna(_name); _createZombie(_name, randDna); }
      }
---
**The code in our previous lesson has a mistake!**

If you try compiling it, the compiler will throw an error.

The issue is we tried calling the `_createZombie` function from within `ZombieFeeding`, but `_createZombie` is a `private` function inside `ZombieFactory`. This means none of the contracts that inherit from `ZombieFactory` can access it.

## Internal and External

In addition to `public` and `private`, Solidity has two more types of visibility for functions: `internal` and `external`.

`internal` is the same as `private`, except that it's also accessible to contracts that inherit from this contract. **(Hey, that sounds like what we want here!)**.

`external` is similar to `public`, except that these functions can ONLY be called outside the contract — they can't be called by other functions inside that contract. We'll talk about why you might want to use `external` vs `public` later.

For declaring `internal` or `external` functions, the syntax is the same as `private` and `public`:

    contract Sandwich {
      uint private sandwichesEaten = 0;
    
      function eat() internal {
        sandwichesEaten++;
      }
    }
    
    contract BLT is Sandwich {
      uint private baconSandwichesEaten = 0;
    
      function eatWithBacon() public returns (string) {
        baconSandwichesEaten++;
        // We can call this here because it's internal
        eat();
      }
    }
    

# Put it to the test

1. Change `_createZombie()` from `private` to `internal` so our other contract can access it.
    
    We've already focused you back to the proper tab, `zombiefactory.sol`.
