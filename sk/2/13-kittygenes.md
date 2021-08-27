---
title: "Bonus: Kitty Genes"
actions: ['checkAnswer', 'hints']
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // Uprav túto definíciu funkcie
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // Add an if statement here
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // A tu uprav spôsob volania funkcie
            feedAndMultiply(_zombieId, kittyDna);
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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

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
Logika našej funkcie je teraz kompletná... no poďme pridať ešte nejakú bonusovú vlasnosť.

Poďme kód upraviť tak, aby zombies vyrobený z mačiek mali nejakú unikátnu vlasnosť odrážajúcu fakt, že sú to mačko zombíci.

Poďme im pridať špeciálny mačkovský DNA kód.

Ak sa spomínaš z Lekcie 1, momentálne používame len prvých 12 cifier zo 16 cifier našeho DNA na určenie vzhľadu našeho zombie. Poďme teda využiť posledné 2 nevyužité cify na signalizáciu "špeciálnych" vlasností.

Definujme, že mačko-zombíci budú mať čislo `99` v posledných dvoch cifrách DNA (lebo mačky majú 9 životov). Takže v našom kóde povieme, že ak pochádza zombie z mačky, potom posledné dve cifry DNA sa budú rovnať `99`.

## If podmienky

`if` v Solidity vyzerá rovnako ako v Javascripte:

```
function eatBLT(string sandwich) public {
  // Spomeň si, že v prípade reťazcov musíme porovnávať ich keccak256 hash
  // hashe na overenie rovnosti 
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# Vyskúšaj si to sám

Poďme implemntovať mačacie gény do našeho zombie DNA kódu.

1. Za prvé uprav definíciu funkcie `feedAndMultiply` tak, aby príjmala tretí argument: `string` s názvom `_species`.

2. Po tom čo vypočítaš DNA nového zombie, pridaj podmienku `if` a porovnaj `keccak256` hashe reťazcov `_species` a`"kitty"`.

3. Vo tele `if` podmienky nahraď posledné dve cifry DNA čislom 99. Jedna z možností ako to dosiahnuť je použiť nasledovný metódu: `newDna = newDna - newDna % 100 + 99;`.

  > Vysvetlenie: Predpokladajme že `newDna` is `334455`. Potom `newDna % 100` je `55`, takže `newDna - newDna % 100` je `334400`. Na záver, ak prídáme `99`, dostaneme `334499`.

4. Na koniec musíš upraviť volanie funkcie vo vnútri `feedOnKitty`. Keď voláš `feedAndMultiply`, musíš do volania pridať náš nový parameter `_species` hodnotou `"kitty"`.
