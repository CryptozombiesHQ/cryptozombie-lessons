---
title: For Loops
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // Start here
            return result;
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          function feedAndMultiply(uint _zombieId, uint _targetDna, string species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(species) == keccak256("kitty")) {
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
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);
          uint counter = 0;
          for (uint i = 1; i <= zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

In the previous chapter, we mentioned that sometimes you'll want to use a `for` loop to rebuild the contents of an array in a function rather than saving that array to storage. Let's see why.

For our `getZombiesByOwner` function, a naive implementation would be to store a `mapping` `ZombieFactory` contract with an array every owner's zombie army:

```
mapping (address =>uint[]) public ownerToZombies
```

Every time we created a new zombie, we would simply use `ownerToZombies[owner].push(zombieId)` to add it to that owner's array. Then `getZombiesByOwner` would be a very straightforward function:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### The problem with this approach

This approach is tempting for its simplicity. But let's look at what happens if we later add a function to transfer a zombie from one owner to another.

That transfer function would need to: a) push the zombie to the new owner's `ownerToZombies` array, b) remove the zombie from the old owner's `ownerToZombies` array, c) shift every zombie up one place to fill the hole, and then d) reduce the array length by 1.

Step c) would be extremely expensive gas-wise, since we'd have to do a write for every zombie after the one we transfered. If an owner has 20 zombies and trades away the first one, we would have to do 19 writes to maintain the order of the array. 

So every call to this transfer function would be very expensive gas-wise. And worse, it would cost a different amount of gas depending on how many zombies the user has in his/her army, so the user wouldn't know how much gas to send.

> Note: Of course, we could just move the last zombie in the array to fill the missing slot and reduce the array length by one. But then we would change the ordering of our zombie army every time we made a trade. This approach would be much cheaper in cases where we don't care about order.

But since `view` functions don't cost gas when called externally, we can simply use a for-loop to iterate the entire zombies array and build an array of the zombies that belong to this specific owner every time we call it. Then our `transfer` function will be much cheaper, since we don't need to reorder any arrays.

## Using `for` loops

The syntax for `for` loops is the same as JavaScript. 

Let's look at an example where we want to make an array of even numbers:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // Keep track of the index in the new array:
  uint counter = 0;
  // Iterate 1 through 10 with a for loop:
  for (uint i = 1; i <= 10; i++) {
    // If `i` is even...
    if (i % 2 == 0) {
      // Add it to our array
      evens[counter] = i;
      // Increment counter to the next empty index in `evens`:
      counter++;
    }
  }
  return evens;
}
```

This function will return an array with the contents `[2, 4, 6, 8, 10]`.

## Put it to the test

Let's finish our `getZombiesByOwner` function by writing a `for` loop that iterates through all the zombies in our DApp, compares their owner to see if we have a match, and pushes them to our `result` array before returning it.

1. Declare a `uint` called `counter` and set it equal to `0`. We'll use this variable to keep track of the index in our `result` array.

2. Declare a `for` loop that starts from `uint i = 1` and goes up through `i <= zombies.length`. This will iterate every zombie in our array.

3. Make an `if` statement that checks if `zombieToOwner[i]` is equal to `_owner`. This will compare the two addresses to see if we have a match.

4. Inside the if statement, a) add the zombie's ID to our `result` array by setting `result[counter]` equal to `i`. And b) increment `counter` by 1 (see the `for` loop example above).

That's it — then your function should return `result`, which we already have from the previous chapter.
