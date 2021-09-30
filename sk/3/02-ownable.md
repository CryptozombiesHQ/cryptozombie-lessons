---
title: Ownable Kontrakty s vlastníctvom 
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
---

Všimol si si bezpečnostný problém ktorý sme dopustili v predchádzajúcej lekcii?

`setKittyContractAddress` je `external`, to znamená že ktokoľvek ju môže zavolať! Ktokoľvek zavolá túto funkciu môže zmeniť adresu CryptoKitties kontraktu a pokaziť tak našu DApp.

Stále chceme mať možnosť túto adresu aktualizovať, no nechceme aby to mohol robiť ktokoľvek.

Na zabezpečenie takýchto situácií sa stalo bežnou praktikou urobiť kontrakty `Ownable` ("vlastniteľné"). To znamená že majú vlastníka, ktorý na nich má právo vykonávať určité špeciálne operácie.

## `Ownable` kontrakty od OpenZeppelin

V bloku kódu nižšie je `Ownable` kontrakt z  **_OpenZeppelin_**  Solidity knižnice. OpenZeppelin je knižnica bezpečných, komunitou schválených smart kontraktov, ktoré môžeš použiť vo svojich aplikáciách. Keď dokončíš túto lekciu, doporučujeme sa pozrieť na webové stránky OpenZeppelinu pre ďalšie informácie.

Pozri si tento kontrakt. Uvidíš niekoľko vecí, ktoré sme zatiaľ ešte neprebrali. Dostaneme sa k nim za chvíľu.

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

- Konštruktory. `function Ownable()` je **_konštruktor_** (**_constructor_**). To je funkcia, ktorú môžeš ale nemusíš definovať, má rovnaký názov ako kontrakt. Bude vykonaná iba raz, a to v čase ked je kontrakt vytvorený.
- Funkčné modifikátory: `modifier onlyOwner()`. Modifikátory sú také polovičaté funkcie, použité na modifikáciu chovania iných funkcií. Obvykle na skontrolovanie určitých požiadavok pred vykonaním funkcie. V tomto prípade `onlyOwner` je modifikátor ktorý limituje právo spúštať funkciu iba (only) vlastníkom (owner). Pozrieme sa na ne z blízka v ďalšej kapitole, kde si taktiež vysvetlíme, čo znamená ten podivný kód `_;`.
- Kľučové slovo `indexed`: toto zatiaľ riešit nebudeme, zatiaľ ho nepotrebujeme.

`Ownable` kontrakty teda majú nasledovné vlasnosti:

1. Keď je kontrakt vytvorený, v konštruktor nastavia vlastníka kontraktu `owner` na `msg.sender` (adresa, z ktorej bol kontrakt nasadený).

2. `Ownable` nám dodá k dispozícií modifikátor `onlyOwner`. Ten môžeme používať v našich funkciách na to, aby jediná adresa z ktorej túto funkciu bolo možné zavolať, bola adresa uložená v premennej `owner`.

3. Umožňuje preniesť kontrakt novému vlastníkovi - umožnuje zmenu hodnoty `owner`.

`onlyOwner` je  pre kontrakty tak bežnou požiadavkou, že väčšina Solidity DApps sa začína písať tak, že si najprv skopírujeme do projektu `Ownable` kontrakt. Až potom začneme písať naše kontrakty, ktoré dedia od `Ownable`.

Nakoľko chceme limitovať prístup k volaniu `setKittyContractAddress` len pre vlastníka našej DApp (nás), použijeme `onlyOwner` modifikátor.


## Vyskúšaj si to sám

Trochu sme ti pomohli a skopírovali sme `Ownable` kontrakt do nového súboru v tvojom projekte `ownable.sol`. Poďme upraviť náš kontrakt `ZombieFactory` tak, aby dedil od `Ownable`.

1. Modifikuj kód tak, aby importoval (`import`) obsah súboru `ownable.sol`. Ak si nespomínaš ako na to, pozri sa na `zombiefeeding.sol`.

2. Modifikuj  `ZombieFactory` kontrakt tak, aby dedil od `Ownable`. Môžeš sa pozrieť na súbor `zombiefeeding.sol` ak si nespomínaš ako na to.
