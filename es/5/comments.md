---
title: Comments
actions: ['checkAnswer', 'hints']
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

          // 1. Remove this:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Change this to just a declaration:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Add setKittyContractAddress method here

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
---

Solidity, or BlockChain programming in general, has alot in common with the kind of programming done for the aerospace industry. That is, if you make a mistake, the plane falls from the sky, the rockets can't reach the moon, and [all your money gets stuck forever](https://medium.com/chain-cloud-company-blog/parity-multisig-hack-again-b46771eaa838).

So it becomes really really important that you double, triple check everything and make every effort to clarify the meaning and the intention behind each line of code.

This is why we are taking time to go over `comments` and their importance in Solidity programming. 

## Commenting with Style:

```
// This is a single-line comment. It's kind of like a note to self (or to others)
```

Just add double `//` anywhere and you're commenting. It's so easy that you should do it all the time. But I hear you, sometimes a single line is not enough, you are born a writer:

```
contract CryptoZombies {
  /*
    This is a multi-lined comment. I'd like to thank all of you who have taken your time to try this programming course. I know it's free to all of you, and it will stay free forever, but we still put our heart and soul into making this as good as it can be. 

    Know that this is still the beginning of Blockchain development. We've come very far but there are so many ways to make this community better. If we made a mistake somewhere, you can make a pull request here: https://github.com/loomnetwork/cryptozombie-lessons

    Or if you have some ideas, comments, or just want to say hi - drop by our Telegram. 
  */
}
```

But sometimes the written language is not precise enough, or you want to make it really easy for others to read, then it's time to add real documentation. 

In this community, the general trend is to use `Doxygen` style tags. These tags are just a special way of writting comments that are clearer and machine readable. It makes it easier to generate documentation for others.

```
/** @title A basic math operation. */
contract multiply {
    /** 
      * @param x the first variable.
      * @param y the second variable.
      * @return z The answer.
      */
    function multiply(uint x, uint y) returns (uint z) {
        z = x * y;
    }
}
```