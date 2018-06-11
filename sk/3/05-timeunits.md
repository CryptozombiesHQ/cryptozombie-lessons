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

Atribút `level` by mal byť celkom jasný. Až neskôr vyvinieme systém útočenia a zápasov, víťazní zombie ktorí vyhraju viac bytiek navýšia svoj level a získaju prístup k novým schopnostiam.
The `level` property is pretty self-explanatory. Later on, when we create a battle system, zombies who win more battles will level up over time and get access to more abilities.

Atribút `readyTime` si vysvetlíme podrobnejšie. Jeho cieľom je pridať "obdobie chladnutia", čo bude predstavovať čas kedy musí zombie čakať než mu bude dovolené útočiť znova po predchádzajúcom útoku. Bez tejto vlasnosti by zombie mohol útočiť a násobiť sa tisícky krát za deň, čo by spravilo hru príliš ľahkú.
The `readyTime` property requires a bit more explanation. The goal is to add a "cooldown period", an amount of time a zombie has to wait after feeding or attacking before it's allowed to feed / attack again. Without this, the zombie could attack and multiply 1,000 times per day, which would make the game way too easy.

Na to aby sme si držali prehľad o tom, koľko času musí zombie čakať než znova zaútočí použijeme Solidity časové jednotky.
In order to keep track of how much time a zombie has to wait until it can attack again, we can use Solidity's time units.

## Časové jednotky
## Time units

Solidty nám poskytuje natívne časové jednotky pre prácu s časom. 
Solidity provides some native units for dealing with time. 

Globálna premenná `now` bude vždu vracať unixovú časovú známku (počet sekúnd ktoré uplynuli od 1vého Januára 1970). V momente písania tohoto textu je aktuálny čas v týchto jednotkách `1515527488`.
The variable `now` will return the current unix timestamp (the number of seconds that have passed since January 1st 1970). The unix time as I write this is `1515527488`.

>Poznámka: Unixový čas je typicky uložený v 32 bitovom čísle. To bude viesť k "Problému roku 2038", kedy 32-bitové unixové časové známky pretečú a rozbijú mnoho zastaralých systémov. Takže ak by sme chceli aby naša aplikáciu fungovala aj po 20 rokoch od dneška, museli by sme použit 64-bitové číslo - naši používatelia by však museli utratiť viac gasu v našej DAppke medzičasom. Je to designové rozhodnutie.
>Note: Unix time is traditionally stored in a 32-bit number. This will lead to the "Year 2038" problem, when 32-bit unix timestamps will overflow and break a lot of legacy systems. So if we wanted our DApp to keep running 20 years from now, we could use a 64-bit number instead — but our users would have to spend more gas to use our DApp in the meantime. Design decisions!

Solidity taktiež obsahuje časove jednotky `seconds`, `minutes`, `hours`, `days`, `weeks` a `years`. Tieto skonvertujú časový interval do počtu sekúnd v ňom. Napríklad  `1 minutes` je `60`, `1 hours` je `3600` (60 sekúnd x 60 minút), `1 days` je `86400` (24 hodín x 60 minút x 60 sekúnd), atď.
Solidity also contains the time units `seconds`, `minutes`, `hours`, `days`, `weeks` and `years`. These will convert to a `uint` of the number of seconds in that length of time. So `1 minutes` is `60`, `1 hours` is `3600` (60 seconds x 60 minutes), `1 days` is `86400` (24 hours x 60 minutes x 60 seconds), etc.

Tu je príklad, ako môžu byť takéto časové jednotky užitočné:
Here's an example of how these time units can be useful:

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
We can use these time units for our Zombie `cooldown` feature.


# Vyskúšaj si to sám
## Put it to the test 

Poďme teraz pridať vychladzovacie obdobie do našej DApp. Nastavíme to tak, aby zombie museli čakať **1 deň** po útočení alebo kŕmení, než im bude dovolené útočiť znova.
Let's add a cooldown time to our DApp, and make it so zombies have to wait **1 day** after attacking or feeding to attack again.

1. Deklaruj `uint` nazvaný `cooldownTime` a nstav jeho hodnotu na  `1 days` (odpusti zlú anglickú gramatiku - ak sa pokusiš nastaviť hodnotu na "1 day", kontrakt sa neskompiluje!)
1. Declare a `uint` called `cooldownTime`, and set it equal to `1 days`. (Forgive the poor grammar — if you set it equal to "1 day", it won't compile!)

2. Nakoľko sme pridali `level` a `readyTime` do našej `Zombie` štruktúry v predchádzajúcej kapitole, budeme musieť aktualizovať `_createZombie()`, aby používal správny počet argumentov pri vytváraní novej `Zombie` štruktúry.
2. Since we added a `level` and `readyTime` to our `Zombie` struct in the previous chapter, we need to update `_createZombie()` to use the correct number of arguments when we create a new `Zombie` struct.

Aktualizuj riadok kódu s  `zombies.push` a pridaj 2 nové argumenty: `1` (pre `level`), a `uint32(now + cooldownTime)` (pre `readyTime`).
  Update the `zombies.push` line of code to add 2 more arguments: `1` (for `level`), and `uint32(now + cooldownTime)` (for `readyTime`).

>Poznámka: `uint32(...)` je nevyhnutnosť, pretože `now` vracia `uint256`, preto ho musíme explicitne pretypovať na `uint32`.
>Note: The `uint32(...)` is necessary because `now` returns a `uint256` by default. So we need to explicitly convert it to a `uint32`.

`now + cooldownTime` sa budú rovnať aktuálnej unixovej časovej známke (v sekundách) plus počet sekúnd v jednom dni - to nám da unixovú časovú známku s hodnotou referujou čas presne 1 deň od aktuálneho momentu. Neskôr môžme porovnávať či hodnota `readyTime` je vačšia ako `now`, aby sme zistili či už uplynulo dostatok času a zombie môže opäť bojovať.
`now + cooldownTime` will equal the current unix timestamp (in seconds) plus the number of seconds in 1 day — which will equal the unix timestamp 1 day from now. Later we can compare to see if this zombie's `readyTime` is greater than `now` to see if enough time has passed to use the zombie again.

V ďalšej kapitole implementujeme funkcionalitu ktorá pomocou `readyTime` obmedzí bojovanie a kŕmenie zombie.
We'll implement the functionality to limit actions based on `readyTime` in the next chapter.
