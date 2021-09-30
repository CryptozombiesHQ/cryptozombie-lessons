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

Úžasné! Pridali sme nové špeciálne schopnosti pre zombie s vyšším levelom. To dá úžívateľom určitý stimul svojich zombie levelovať. Neskôr môžme pridať ďalšie špeciálne schopnosti. 

Poďme pridať ešte jednu špeciálnu funkciu. Naša DApp potrebuje mať možnosť prístupu ku celej armáde úžívateľa. Poďme vytvoriť funkciu ktorá nám ho zabezpečí, nazveme ju `getZombiesByOwner`.

Táto funkcia bude dáta z blockchain iba čítať, preto z nej môžme spraviť `view` funkciu. To nás privádza späť k dôležitej téme optimalizácie utrateného gasu.

## View funkcie nestoja žiaden gas

`view` funkcie nestoja žiaden gas, v prípade že su volané **externe** užívateľom.

To preto, lebo `view` funkcie nemodifikujú žiadne dáta v blockchain - iba dáta čítajú. Tým že označíme funkciu s `view` vlastne povieme `web3.js`, že jediné čo treba spraviť je požiadať jediný Ethereum server o spustinie tejto funkciu. Nakoľko sa ale nevykoná žiadna transakcia na blockchaine, cena takéhoto dotazu je nulová (keby to bola transakcia, musela by prebehnúť na všetkých serveroch zapojených do Ethereum siete).

Čo sa týka nastavenia web3.js v tvojom kóde, to je téma ktorú pokryjeme neskôr. Podstatné čo si z tejto lekcie treba odniesť je to, že môžme optimalizovať útratu gasu užívateľmi v tvojej DAppke tým, že budeš používať `external view`  funkcie všade kde je to možné.

> Poznámka: Ak je funkcia `view` zavolaná interne z inej funkcie rovnakého kontraktu ktorá **nie je** `view` funkcia, potom aj táto funkcia bude spotrebovávať gas. To preto, lebo vykonávanie tej druhej funkcie nutne reprezentuje transakciu na Ethereum sieti. Vy výsledku sa potom prístup k dátam sa bude musieť odohrať na každom Etheruem servri, ktorý túto transakciu verifikuje. Preto sú `view` funkcie zadarmo len vtedy, keď su volané externe. 

## Vyskúšaj si to sám

Teraz implementuješ funkciu ktorá vráti celú armádu zombie patriaca jednému užívateľovi. Neskôr budeš túto funkciu volať z `web3.js` na to, aby si zobrazil profil užívateľa a jeho kompletnú armádu.

Logika tejto funkcie je trochu komplikovanejšia a preto nám jej implementácia zaberie niekoľko kapitol.

1. Vytvor novú funkciu nazvanú `getZombiesByOwner`. Bude príjmať jeden argument `_owner` typu `address`. 

2. Poďme túto funkciu spraviť `external view`, tak aby sme ju mohli zavolať z `web3.js` bez toho aby sme užívateľom míňali gas.

3. Táto funkcia by mala vracať  `uint[]` (pole `uint`ov).

Zatiaľ nechaj telo funkcie prázdne, doplníme ho v ďalšej kapitole.
