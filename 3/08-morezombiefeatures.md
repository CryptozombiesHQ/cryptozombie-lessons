---
title: More Zombie Features
actions: ['checkAnswer', 'hints']
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
            // 1. Define cooldownTime here

            // 2. Modify Zombie struct here:
            struct Zombie {
              string name;
              uint dna;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                // 3. Modify the creation of new zombies here:
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
      "zombiehelper.sol": |
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

          function setKittyContractAddress(address _address) onlyOwner external {
            kittyContract = KittyInterface(_address);
          }

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

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;
          uint cooldownTime = 1 days;

          struct Zombie {
            string name;
            uint dna;
            uint32 level;
            uint32 readyTime;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) internal {
              uint id = zombies.push(Zombie(_name, _dna, 0, uint32(now + cooldownTime))) - 1;
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
---

We'll talk more about function modifiers in a minute. But first we need to add a couple features to our zombies.

In a later lesson, we're going to introduce a battle system. So we're going to need some extra features on our zombies:

1. Let's add a "cooldown period", an amount of time a zombie has to wait before it's allowed to feed / attack again. Otherwise the zombie could attack and multiply 1000 times per day, which isn't very fair.

2. Let's also give our zombies a level — this way zombies who win more battles can level up over time.

In order to implement these features, we're going to have to make some changes to our zombie `struct`. But first let's talk about a couple more features of Solidity.

## Time units

Solidity provides some native units for dealing with time. 

The variable `now` refers to the current unix timestamp. (The number of seconds since unix epoch, January 1st 1970. This is a date-time standard used across many programming languages). The unix time as I write this is `1515527488`.

Solidity also contains the time units `seconds`, `minutes`, `hours`, `days`, `weeks` and `years`. These will convert to a `uint` of the number of seconds in that length of time. So `1 minute` is `60`, `1 hour` is `3600` (60 seconds x 60 minutes), `1 day` is `86400` (24 hours x 60 minutes x 60 seconds), etc.

Here's an example of how these time units can be useful:

```
uint lastUpdated;

// Set `lastUpdated` to `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Will return `true` if 30 seconds have passed since `updateTimestamp` was 
// called, `false` if 30 seconds have not passed
function thirtySecondsHavePassed() public view returns (bool) {
  return (now > (lastUpdated + 30 seconds));
}
```

We can use these time methods for our `cooldown` feature on our zombies.

## Struct packing to save gas

In Lesson 1, we mentioned that there are other types of `uint`s: `uint8`, `uint16`, `uint32`, etc.

Normally there's no benefit to using these, since Solidity reserves 256 bits in storage when we declare a variable anyway, so using a smaller `uint` doesn't save on gas.

But there's an exception to this: inside `struct`s.

If you have multiple `uint`s inside a struct, using smaller-sized `uint` when possible will allow Solidity to pack these variables together to take up less storage. For example:

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint8 c;
}

// `one` will cost less gas than `two`
MiniMe one = MiniMe(10, 20, 30); 
NormalStruct two = NormalStruct(10, 20, 30);
```

For this reason, inside a struct you want to use the smallest size of integers you can get away with for that type of data. E.g. If you're using a unix timestamp like `now`, you can use a `uint32`, since unix timestamps are only 32 bits.

You also want to cluster the same data types together (put them next to each other in the struct), since this will allow Solidity to optimize storage. For example, a struct with the order `uint32 a; uint32 b; uint c;` will cost less gas than a struct with `uint32 a; uint c; uint 32 b;`, since we're clustering the `uint32` data types next to each other.

## Put it to the test 

Let's go back to `ZombieFactory` and add a cooldown time and level to our zombies.

1. Declare a `uint` called `cooldownTime`, and set it equal to `1 days`.

2. Add 2 more fields to our `Zombie` struct: `level` (a `uint32`), and `readyTime` (also a `uint32`). 32 bits is more than enough to hold a unix timestamp and the zombie's level, so this will save us some gas costs by packing the data more tightly than using a regular `uint` (256-bits).

3. Now that we have 2 more fields in our `Zombie` struct, we need to update `_createZombie()` to give these fields values when we create a zombie. Update the `zombies.push` line of code to add 2 more arguments: `0` (for `level`), and `uint32(now + cooldownTime)` (for `readyTime`).

>Note: The `uint32(...)` is necessary because `now` returns a `uint256` by default. So we need to explicitly convert it to a `uint32`.

Setting the new zombie's `readyTime` to `now + cooldownTime` means it won't be usable until 1 day after it's created, so the user can't just create zombies infinitely. 

We'll implement the functionality to limit actions based on `readyTime` in the next chapter.
