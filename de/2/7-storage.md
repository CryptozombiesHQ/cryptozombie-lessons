---
title: Storage vs Memory
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
        
        contract ZombieFeeding is ZombieFactory {
        
        // Start here
        
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
        
        function _createZombie(string _name, uint _dna) private {
        uint id = zombies.push(Zombie(_name, _dna)) - 1;
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender]++;
        NewZombie(id, _name, _dna);
        }
        
        function _generatePseudoPseudoRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
        }
        
        function createPseudoPseudoRandomZombie(string _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generatePseudoPseudoRandomDna(_name);
        _createZombie(_name, randDna);
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefactory.sol";
      contract ZombieFeeding is ZombieFactory {
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; }
      }
---
In Solidity, there are two places you can store variables — in `storage` and in `memory`.

***Storage*** refers to variables stored permanently on the blockchain. ***Memory*** variables are temporary, and are erased between external function calls to your contract. Think of it like your computer's hard disk vs RAM.

Most of the time you don't need to use these keywords because Solidity handles them by default. State variables (variables declared outside of functions) are by default `storage` and written permanently to the blockchain, while variables declared inside functions are `memory` and will disappear when the function call ends.

However, there are times when you do need to use these keywords, namely when dealing with ***structs*** and ***arrays*** within functions:

    contract SandwichFactory {
      struct Sandwich {
        string name;
        string status;
      }
    
      Sandwich[] sandwiches;
    
      function eatSandwich(uint _index) public {
        // Sandwich mySandwich = sandwiches[_index];
    
        // ^ Seems pretty straightforward, but solidity will give you a warning
        // telling you that you should explicitly declare `storage` or `memory` here.
    
        // So instead, you should declare with the `storage` keyword, like:
        Sandwich storage mySandwich = sandwiches[_index];
        // ...in which case `mySandwich` is a pointer to `sandwiches[_index]`
        // in storage, and...
        mySandwich.status = "Eaten!";
        // ...this will permanently change `sandwiches[_index]` on the blockchain.
    
        // If you just want a copy, you can use `memory`:
        Sandwich memory anotherSandwich = sandwiches[_index + 1];
        // ...in which case `anotherSandwich` will simply be a copy of the 
        // data in memory, and...
        anotherSandwich.status = "Eaten!";
        // ...will just modify the temporary variable and have no effect 
        // on `sandwiches[_index + 1]`. But you can do this:
        sandwiches[_index + 1] = anotherSandwich;
        // ...if you want to copy the changes back into blockchain storage.
      }
    }
    

Don't worry if you don't fully understand when to use which one yet — throughout this tutorial we'll tell you when to use `storage` and when to use `memory`, and the Solidity compiler will also give you warnings to let you know when you should be using one of these keywords.

For now, it's enough to understand that there are cases where you'll need to explicitly declare `storage` or `memory`!

# Put it to the test

It's time to give our zombies the ability to feed and multiply!

When a zombie feeds on some other lifeform, its DNA will combine with the other lifeform's DNA to create a new zombie.

1. Create a function called `feedAndMultiply`. It will take two parameters: `_zombieId` (a `uint`) and `_targetDna` (also a `uint`). This function should be `public`.

2. We don't want to let someone else feed using our zombie! So first, let's make sure we own this zombie. Add a `require` statement to make sure `msg.sender` is equal to this zombie's owner (similar to how we did in the `createPseudoRandomZombie` function).
    
    > Note: Again, because our answer-checker is primitive, it's expecting `msg.sender` to come first and will mark it wrong if you switch the order. But normally when you're coding, you can use whichever order you prefer — both are correct.

3. We're going to need to get this zombie's DNA. So the next thing our function should do is declare a local `Zombie` named `myZombie` (which will be a `storage` pointer). Set this variable to be equal to index `_zombieId` in our `zombies` array.

You should have 4 lines of code so far, including the line with the closing `}`.

We'll continue fleshing out this function in the next chapter!
