---
title: Šetrenie Gasu pomocou 'View' Funkcií
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          // Dopíš funkciu tu

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

          function setKittyContractAddress(address _address) external onlyOwner {
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

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[]) {

        }

      }
---

Úžasné! Teraz sme pridali nové špeciálne schopnosti pre zombie s vyžším levelom. To dá úžívateľom určitý stimul svojich zombie levelovať. Neskôr môžme pridať ďalšie špeciálne schopnosti. 
Awesome! Now we have some special abilities for higher-level zombies, to give our owners an incentive to level them up. We can add more of these later if we want to.

Poďme pridať ešte jednu špeciálnu funkciu: naša DApp potrebuje mať možnosť prístupu ku celej armáde úžívateľa - poďme ju nazvať `getZombiesByOwner`.
Let's add one more function: our DApp needs a method to view a user's entire zombie army — let's call it `getZombiesByOwner`.

Táto funkcia bude dáta z blockchain iba čítať, preto z nej môžme spraviž `view` funkciu. To nás privádza späť k dôležitej téme optimalizácie utrateného gasu:
This function will only need to read data from the blockchain, so we can make it a `view` function. Which brings us to an important topic when talking about gas optimization:

## View funkcie nestoja gas
## View functions don't cost gas

`view` funkcie nestoja žiaden gas, v prípade že su volané externe užívateľom.
`view` functions don't cost any gas when they're called externally by a user.

To preto, lebo  `view` funkcie nemodifikujú žiadne dáta v blockchain - iba dáta čítajú. Tým že označíme funkciu s `view` povieme `web3.js`, že jediné čo treba spraviť je požiadať Ethereum server spustiť túto funkciu. No nakoľko sa nevykoná žiadna transakcia na blockchaine ako taká, cena takéhoto dotazu je nulová (keby to bola transakcia, musela by prebehnúť na všetkých Serveroch zapojených do Ethereum siete).
This is because `view` functions don't actually change anything on the blockchain – they only read the data. So marking a function with `view` tells `web3.js` that it only needs to query your local Ethereum node to run the function, and it doesn't actually have to create a transaction on the blockchain (which would need to be run on every single node, and cost gas).

Čo sa týka nastavenia web3.js v tvjom kóde, to je téma ktoru pokryjeme neskôr. To podstatné čo si z tejto lekcie treba odniesť je to, že môžme optimalizovať útratu gasu užívateľmi v tvojej DAppke tým, že budeš používať `external view`  funkcie všade kde je to možné.
We'll cover setting up web3.js with your own node later. But for now the big takeaway is that you can optimize your DApp's gas usage for your users by using read-only `external view` functions wherever possible.

> Poznámka: Ak je funkcia `view` zavolaná interne z inej funkcie rovnakého kontraktu, potom to **nie je** `view` funkcia, a takéto volanie bude spotrebovávať gas. To preto, lebo tá iná funkcia reprezentuje transakciu na Ethereum sieti a teda prístup k dátam sa bude musieť odohrať na každom Etheruem servri ktorý túto transakciu verifikuje. Preto sú `view` funkcie zadarmo len vtedy, keď su volané externe. 
> Note: If a `view` function is called internally from another function in the same contract that is **not** a `view` function, it will still cost gas. This is because the other function creates a transaction on Ethereum, and will still need to be verified from every node. So `view` functions are only free when they're called externally.

## Vyskúšaj si to sám
## Put it to the test

Teraz ideme implementovať funkciu, ktorá vráti celú armádu zombie patriaca jednému užívateľovi. Neskôr budeme túto funkciu volať z `web3.js` na to, aby sme zobrazili profil užívateľa a ich kompletné armády.
We're going to implement a function that will return a user's entire zombie army. We can later call this function from `web3.js` if we want to display a user profile page with their entire army.

Logika tejto funkcie je trochu komplikovanejšia a preto nám jej implementácia zaberie niekoľko kapitol.
This function's logic is a bit complicated so it will take a few chapters to implement.

1. Vytvor novú funkciu nazvanú `getZombiesByOwner`. Bude príjmať jeden argument `_owner` typu `address`. 
1. Create a new function named `getZombiesByOwner`. It will take one argument, an `address` named `_owner`.

2. Poďme túto funkciu spraviť `external view`, tak aby sme ju mohli zavolať z `web3.js` bez toho aby sme užívateľom míňali gas.
2. Let's make it an `external view` function, so we can call it from `web3.js` without needing any gas.

3. Táto funkcia by mala vracať  `uint[]` (pole `uint`ov).
3. The function should return a `uint[]` (an array of `uint`).

Zatiaľ nechaj telo funkcie prázdne, doplníme ho v ďalšej kapitole.
Leave the function body empty for now, we'll fill it in in the next chapter.
