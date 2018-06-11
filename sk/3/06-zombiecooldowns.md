---
title: Zombie coldown odpočinok
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

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          // 1. Tu definuj funkciu `_triggerCooldown`

          // 2. Tu definuj funkciu `_isReady`

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
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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

        function setKittyContractAddress(address _address) external onlyOwner {
          kittyContract = KittyInterface(_address);
        }

        function _triggerCooldown(Zombie storage _zombie) internal {
          _zombie.readyTime = uint32(now + cooldownTime);
        }

        function _isReady(Zombie storage _zombie) internal view returns (bool) {
            return (_zombie.readyTime <= now);
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

Teraz ked už máme atribút `readyTime` na našej `Zombie` štruktúre, poďme preskočit do `zombiefeeding.sol` a implementovať cooldown stopky.  
Now that we have a `readyTime` property on our `Zombie` struct, let's jump to `zombiefeeding.sol` and implement a cooldown timer.

Ideme modifikovať našu funkciu `feedAndMultiply` tak, že:
We're going to modify our `feedAndMultiply` such that:

1. Kŕmenie vyvolá obdobie cooldown odpočinku zombie, a
1. Feeding triggers a zombie's cooldown, and

2. Zombie sa nemôžu kŕmiť na mačkách až kým neskončí ich odpočinkové cooldown obdobie. 
2. Zombies can't feed on kitties until their cooldown period has passed

Toto zabezpečí že zombies sa nemôžu stále kŕmiť na mačičkách a nekonečna sa rozmnožovať. V budúcnosti, až pridáme funkcionalitu zápasov, obmedzíme taktiež zápasy medzi zombies cooldown obdobím.  
This will make it so zombies can't just feed on unlimited kitties and multiply all day. In the future when we add battle functionality, we'll make it so attacking other zombies also relies on the cooldown.

Za prvé, poďme si definovať pár pomocných funkcií, ktore nám pomôžu skontrolovať `readyTime` zombie.
First, we're going to define some helper functions that let us set and check a zombie's `readyTime`.

## Predávanie štruktúr cez argumenty
## Passing structs as arguments

Funkciám ktoré su `private` alebo `internal` je možné predávať ako argumenty ukazatele na štruktúry v trvalom dátavom úložisku. To je pre nás užitočné, možme si takto posúvať ukazatěl na nejakého `Zombie` medzi našimi funkciami.
You can pass a storage pointer to a struct as an argument to a `private` or `internal` function. This is useful, for example, for passing around our `Zombie` structs between functions.

Syntax je takáto:
The syntax looks like this:

```
function _doStuff(Zombie storage _zombie) internal {
  // sprav niečo so _zombie
}
```

Týmto spôsobom môžme priamo predávať referenciu na zombie v trvalom dátovom úložisku. Keby sme to takto nespravili, museli by sme funkciám podśuvať ID zombie a potom daného zombie nájsť v poli `zombies` podľa ID.
This way we can pass a reference to our zombie into a function instead of passing in a zombie ID and looking it up.

# Vyskúšaj si to sám
## Put it to the test 

1. Začni tým že definuješ funkciu `_triggerCooldown`. Tá bude príjmať 1 argument, `_zombie` typu `Zombie storage`. Funkcia by mala byť  `internal`.
1. Start by defining a `_triggerCooldown` function. It will take 1 argument, `_zombie`, a `Zombie storage` pointer. The function should be `internal`.

2. Telo funkcie by malo nastaviť `_zombie.readyTime` na hodnotu `uint32(now + cooldownTime)`. 
2. The function body should set `_zombie.readyTime` to `uint32(now + cooldownTime)`.

3. Ďalej, vytvor funkciu s naźvom `_isReady`. Táto funkcia bude taktiež príjmať argument typu `Zombie storage` s názvom `_zombie`. Bude to `internal view`  funkcia a vracať bude hodnotu typu `bool`.
3. Next, create a function called `_isReady`. This function will also take a `Zombie storage` argument named `_zombie`. It will be an `internal view` function, and return a `bool`.

4. Telo funkcie by malo vracať `(_zombie.readyTime <= now)`. Tento výraz bude vyhodnotený buď na hodnotu `true` alebo `false`. Táto funkcia nám povie, či už ubehlo dostatočné množstvo času od posledného kŕmenia.
4. The function body should return `(_zombie.readyTime <= now)`, which will evaluate to either `true` or `false`. This function will tell us if enough time has passed since the last time the zombie fed.
