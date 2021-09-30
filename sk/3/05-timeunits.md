---
title: Časové jednotky
actions: ['checkAnswer', 'hints']
requireLogin: true
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
            // 1. Tu definuj `cooldownTime`

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
                // 2. Uprav nasledujúci riadok
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
---

Atribút `level` by mal byť celkom jasný. Až neskôr vyvinieme systém útočenia a zápasov, víťazní zombie ktorí vyhrajú viac bytiek navýšia svoj level, a získajú prístup k novým schopnostiam.

Atribút `readyTime` si vysvetlíme podrobnejšie. Jeho cieľom je pridať "obdobie chladnutia". To bude predstavovať čas kedy musí zombie čakať, než mu bude znova dovolené útočiť po predchádzajúcom útoku. Bez tejto vlasnosti by zombie mohli útočiť a násobiť sa tisícky krát za deň. To by spravilo hru príliš ľahkú.

Na to aby sme si držali prehľad o tom, koľko času musí zombie čakať než bude môcť znova zaútočiť použijeme časové jednotky Solidity.

## Časové jednotky

Solidty nám pre prácu s časom natívne poskytuje isté časové jednotky.

Globálna premenná `now` vracia vždy aktuálnu unixovú časovú známku (počet sekúnd ktoré uplynuli od 1vého Januára 1970). V momente písania tohoto textu je aktuálny čas v týchto jednotkách `1515527488`.

>Poznámka: Unixový čas je typicky uložený v 32 bitovom čísle. To bude viesť k "Problému roku 2038". Vtedy totiž 32-bitové unixové časové známky pretečú a rozbijú mnoho zastaralých systémov. Ak by sme teda chceli, aby naša aplikáciu fungovala aj po roku 2038, museli by sme použit 64-bitové číslo. Na oplátku by ale naši používatelia našej DAppky by však museli utratiť viac gasu. Je to designové rozhodnutie.

Solidity taktiež obsahuje spomínané časové jednotky `seconds`, `minutes`, `hours`, `days`, `weeks` a `years`. Tieto skonvertujú časový interval do počtu sekúnd v ňom. Napríklad: `1 minutes` je `60`, `1 hours` je `3600` (60 sekúnd x 60 minút), `1 days` je `86400` (24 hodín x 60 minút x 60 sekúnd), atď.

Tu je príklad, ako môžu byť takéto časové jednotky užitočné:

```
uint lastUpdated;

// Nastav `lastUpdated` na `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Vráti `true` v prípade že od času zavolania funkcie  `updateTimestamp` 
// uplynulo aspoň 5 minút, inak vráti `false`
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Tieto jednotky môžeme podobným spôsobom použiť pre `cooldown` vychladzovacie obdobie našich zombie.


## Vyskúšaj si to sám

Poďme teraz pridať vychladzovacie obdobie do našej DApp. Nastavíme to tak, aby zombie museli čakať **1 deň** po útočení alebo kŕmení, než im bude dovolené útočiť znova.

1. Deklaruj `uint` nazvaný `cooldownTime` a nastav jeho hodnotu na `1 days` (odpusť nedokonalú anglickú gramatiku - ak sa pokúsiš nastaviť hodnotu na "1 day", kontrakt sa neskompiluje!)

2. Nakoľko sme pridali `level` a `readyTime` do našej `Zombie` štruktúry v predchádzajúcej kapitole, budeme musieť aktualizovať `_createZombie()`, aby používal správny počet argumentov pri vytváraní novej `Zombie` štruktúry.

Aktualizuj riadok kódu s `zombies.push` a pridaj 2 nové argumenty: `1` (pre `level`), a `uint32(now + cooldownTime)` (pre `readyTime`).

>Poznámka: `uint32(...)` je nevyhnutnosť, pretože `now` vracia `uint256`, preto ho musíme explicitne pretypovať na `uint32`.

`now + cooldownTime` sa budú rovnať aktuálnej unixovej časovej známke (v sekundách) plus počet sekúnd v jednom dni. To nám dá unixovú časovú známku s hodnotou referujúcou čas presne 1 deň od aktuálneho momentu. Neskôr môžeme porovnávať, či hodnota `readyTime` je vačšia ako `now`, aby sme zistili či uplynulo dostatok času, a či zombie môže opäť bojovať.

V ďalšej kapitole implementujeme funkcionalitu ktorá pomocou `readyTime` obmedzí bojovanie a kŕmenie zombie.

