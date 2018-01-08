---
title: Ownable
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Import here

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
    answer: >
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

One issue with our `setKittyContractAddress` function is that because it's `external`, anyone can call it.

This is a security hole, because that means anyone could change the address of the CryptoKitties contract and break our app.

To handle cases like this, one common practice that has emerged is to make contracts `Ownable` — meaning they have an owner who has special priveleges (you).

Below is an example `Ownable` contract that you can use in your DApps, taken from **_OpenZeppelin_**'s Solidity library. You're going to see a few things we haven't learned yet, but don't worry, we'll talk about them below.

Go ahead and give the `Ownable` contract a read-through, then we'll break it down below:

```
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
```

A few new things here we haven't seen before:

1. **The `indexed` keyword.** This is only for `event`s, and it's basically a way to make those parameters searchable or filterable in the event logs. So because `newOwner` is `indexed`, you could have your DApp's front-end listen only for the `OwnershipTransferred` event when the new owner is a specific address. Or you could search the `OwnershipTransferred` logs to see if it was ever transfered to that address historically.

2. **Constructors.** The constructor here is the function `function Ownable() public` — a constructor is a function with the same name as the contract name. This function will only execute once, when the contract is first created. In the case of `Ownable()`, it sets the owner of the contract to `msg.sender`, the person who deployed it. Constructors are optional in contracts.

3. **Function Modifiers.** Notice `modifier onlyOwner()`. This looks kind of like a function, but it's not a full function by itself — it's used as its name implies, to modify other functions. We're going to look more at how to use function modifiers in the next chapter, and what that weird line of code `_;` does. But basically you can use this to limit function access so that only the owner of a contract can call certain functions.

So the `Ownable` contract basically adds an owner to a contract, provides a function modifier called `onlyOwner` that can restrict access to certain functions to only the owner, and a function called `transferOwnership` that lets you transfer ownership of the contract to someone else.

`onlyOwner` is such a common pattern that most Solidity DApps start with this contract copy and pasted, and then their contract inherits from it. We're going to add this functionality to our DApp.

## Put it to the test

We've gone ahead and copied the code of the `Ownable` contract into a new file, `ownable.sol`. Let's go ahead and make `ZombieFactory` inherit from it.

1. Set our code to `import` the contents of `ownable.sol`. If you don't remember how to do this, look back at `zombiefeeding.sol`.

2. Set the `ZombieFactory` contract to inherit from `Ownable`. Again, you can reference `ZombieFeeding if you don't remember how this is done.

Normally this is the very first thing you would do when creating a new contract, since `onlyOwner` is such a common requirement. But in CryptoZombies we wanted to start off with the fun and easy stuff, so we saved this for later ;)

When you're finished, check your answer and move on to the next chapter.
