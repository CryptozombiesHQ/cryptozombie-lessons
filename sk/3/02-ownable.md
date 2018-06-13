---
title: Vlastnené "Ownable" Kontrakty
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Import tu

        // 2. Dedičnosť tu:
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

Všimol si si bezpečnostný problém ktorý sme vytvorili v predchádzajúcej lekcii?
Did you spot the security hole in the previous chapter?

`setKittyContractAddress` je `external`, to znamená že ktokoľvek ju môže zavolať! Takže ktokoľvek by zavolal túto funkciu môže zmeniť adresu CryptoKitties kontraktu a pokaziť tak našu DApp.
`setKittyContractAddress` is `external`, so anyone can call it! That means anyone who called the function could change the address of the CryptoKitties contract, and break our app for all its users.

Stále chceme mať možnosť túto adresu aktualizovať, no nechceme aby to mohol robiť ktokoľvek.
We do want the ability to update this address in our contract, but we don't want everyone to be able to update it.

Na zabezpečenie takýchto situácií sa stalo bežnou praktikou urobiť kontrakty `Ownable` (vlastnené) - čo znamená že majú vlastníka ktorý má špeciálne práva.
To handle cases like this, one common practice that has emerged is to make contracts `Ownable` — meaning they have an owner (you) who has special privileges.

## `Ownable` kontrakty od OpenZeppelin
## OpenZeppelin's `Ownable` contract

V bloku kódu nižšie je `Ownable` kontrakt z  **_OpenZeppelin_**  Solidity knižnice. OpenZeppelin je knižnica bezpečných, komunitou schválených smart kontraktov, ktoré môžeš použit vo svojich aplikáciách. Keď dokončíš túto lekciu, doporučujeme sa pozrieť na webové stránky OpenZeppelinu pre ďalšie informácie.
Below is the `Ownable` contract taken from the **_OpenZeppelin_** Solidity library. OpenZeppelin is a library of secure and community-vetted smart contracts that you can use in your own DApps. After this lesson, we highly recommend you check out their site to further your learning!

Pozri si tento kontrakt. Uvidíš niekoľko vecí ktoré sme zatiaľ ešte neprebrali, no nemaj obavy. Dostaneme sa k nim za chvíľu.
Give the contract below a read-through. You're going to see a few things we haven't learned yet, but don't worry, we'll talk about them afterward.

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

Niekoľko vecí ktoré sme doposiaľ nevideli:
A few new things here we haven't seen before:

- Konštruktory: `function Ownable()` je **_konštruktor_** (**_constructor_**). To je funkcia ktorú môžeš ale nemusíš definovať, má rovnaký názov ako kontrakt. Bude vykonaná iba raz, a to v čase ked je kontrakt vytvorený.
- Funkčné modifikátory: `modifier onlyOwner()`. Modifikátory sú také polovičaté funkcie, ktoré su použité na modifikáciu iných funkcií, obvykle na skontrolovanie určitých požiadavok pred vykonaním funkcie.V tomto prípade `onlyOwner` je modifikátor ktorý limituje právo spúštať funkciu iba (only) vlastníkom (owner). Pozrieme sa na ne z blízka v ďalšej kapitole, vysvetlíme si taktiež čo znamená ten podivný kód `_;`.
- Kľučové slovo `indexed`: toto zatiaľ riešit nebudeme, nepotrebujeme to.

- Constructors: `function Ownable()` is a **_constructor_**, which is an optional special function that has the same name as the contract. It will get executed only one time, when the contract is first created.
- Function Modifiers: `modifier onlyOwner()`. Modifiers are kind of half-functions that are used to modify other functions, usually to check some requirements prior to execution. In this case, `onlyOwner` can be used to limit access so **only** the **owner** of the contract can run this function. We'll talk more about function modifiers in the next chapter, and what that weird `_;` does.
- `indexed` keyword: don't worry about this one, we don't need it yet.

Takže `Ownable` kontrakty majú v podstate nasledovné vlasnosti:
So the `Ownable` contract basically does the following:

1. Keď je kontrakt vytvorený, konštruktor nastaví `owner` na `msg.sender` (adresa, z ktorej bol kontrakt nasadený).
1. When a contract is created, its constructor sets the `owner` to `msg.sender` (the person who deployed it)

2. Ownable nám dodá k dispozícií modifikátor `onlyOwner`, ktorý môžme používať v našich funkciách na to, aby jediná adresa z ktore mohli byť zavolané, bola adresa uložená v `owner`.
2. It adds an `onlyOwner` modifier, which can restrict access to certain functions to only the `owner`

3. Umožňuje preniesť kontrakt novému vlastníkovi - umožnuje zmenu hodnoty `owner`.
3. It allows you to transfer the contract to a new `owner`

`onlyOwner` je tak bežná požiadavka pre kontrakty, že väčšina Solidity DApps sa začína písať tak, že si najprv skopírujeme do projektu `Ownable` kontrakt. Až potom začneme písať naše kontrakty, ktoré dedia od `Ownable`.
`onlyOwner` is such a common requirement for contracts that most Solidity DApps start with a copy/paste of this `Ownable` contract, and then their first contract inherits from it.

Nakoľko chceme limitovať prístup k volaniu `setKittyContractAddress` len pre vlastníka našej DApp (nás), použijeme `onlyOwner` modifikátor.
Since we want to limit `setKittyContractAddress` to `onlyOwner`, we're going to do the same for our contract.


# Vyskúšaj si to sám
## Put it to the test

Išli sme trochu napred a rovno sme skopírovali `Ownable` kontrakt do nového súboru v tvojom projekte `ownable.sol`. Poďme upraviť náš kontrakt `ZombieFactory` tak, aby dedil od `Ownable`.
We've gone ahead and copied the code of the `Ownable` contract into a new file, `ownable.sol`. Let's go ahead and make `ZombieFactory` inherit from it.

1. Modifikuj náš kód tak, aby importoval (`import`) obsah súboru `ownable.sol`. Ak si nespomínaš ako na to, pozri sa na `zombiefeeding.sol`.
1. Modify our code to `import` the contents of `ownable.sol`. If you don't remember how to do this take a look at `zombiefeeding.sol`.

2. Modifikuj  `ZombieFactory` kontrakt tak, aby dedil od `Ownable`. Môžeš sa pozrieť na súbor `zombiefeeding.sol` ak si nespomínaš ako na to.
2. Modify the `ZombieFactory` contract to inherit from `Ownable`. Again, you can take a look at `zombiefeeding.sol` if you don't remember how this is done.
