---
title: Interacting With Other Contracts
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // Create KittyInterface here

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            Zombie storage myZombie = zombies[_zombieId];
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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
                uint id = zombies.push(Zombie(_name, _dna));
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
                _createZombie(_name, randDna);
            }

        }
    answer: >
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          Zombie storage myZombie = zombies[_zombieId];
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

It's time to feed our zombies! And what do zombies like to eat most?

Well it just so happens that CryptoZombies love to eat...

CryptoKitties! 😱😱😱

In order to do this, we'll need to read the the kittyDna from the CryptoKitties smart contract. (And we can do that because the CryptoKitties data is stored openly on the blockchain. Isn't blockchain cool?!)

For our contract to talk to another contract on the blockchain that we don't own, first we need to define an **_interface_**.

Let's look at a simple example. Say there was a contract on the blockchain that looked like this:

```
contract FavoriteNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

This would be a simple contract where anyone could store their favorite number, and it will be associated with their Ethereum address. Then anyone else could look up that person's favorite number using their address.

Now let's say we had an external contract that wanted to read the data in this contract using the `getNum` function. 

First we'd have to define an **_interface_** of the `FavoriteNumber` contract with with `getNum` function, which would look like this:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Notice that this looks like defining a contract, with a few differences. For one, we're only declaring the functions we want to interact with — we don't have to define all the functions, and we don't need state variables. And secondly, we're not defining the functions — instead of curly braces (`{` and `}`), we're simply ending the function definition with a semi-colon (`;`).

This is how the compiler knows it's an interface. By including this interface in our dapp's code, our contract knows what the other contract's function signature will look like, and so it knows how to interact with it. We'll get into interacting with it in the next lesson.

# Put it to the test

I've looked up the CryptoKitties source code for you, and found a function called `getKitty` that returns all the kitty's data, including its "genes" (which is what our zombie game needs to form a new zombie!).

The function looks like this:

```
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
) {
    Kitty storage kit = kitties[_id];

    // if this variable is 0 then it's not gestating
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

The function looks a bit different than we're used to. You can see it returns... A bunch of different values. If you're coming from a programming language like javascript, this is different — in Solidity you can return more than one value from a function.

1. Define an interface called `KittyInterface`. (Remember, this looks just like creating a new contract).

2. Inside the interface, define the function `getKitty` (which should be a copy/paste of the function above, but with a semi-colon after the `return` statement, instead of all the part inside the curly braces.
