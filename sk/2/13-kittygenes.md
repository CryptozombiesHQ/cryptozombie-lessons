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
            // A uprav spôsob volanie funkcie tu
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
Our function logic is now complete... but let's add in one bonus feature.

Poďme kód upraviť tak, aby zombies vyrobený z mačiek mali nejakú unikátnu vlasnost ktorá odráža fakt že sú to mačko-zombies.
Let's make it so zombies made from kitties have some unique feature that shows they're cat-zombies.

Poďme im pridať nejaký špecialny mačko kód do DNA.
To do this, we can add some special kitty code in the zombie's DNA.

Ak sa spomínaš z Lekcie 1, momentálne používame len prvých 12 cifier zo 16 cifier našeho DNA na určenie vzhľadu našeho zombie. Poďme teda využiť posledné 2 nevyužité cify na signalizáciu "špciálnych" vlasností.
If you recall from lesson 1, we're currently only using the first 12 digits of our 16 digit DNA to determine the zombie's appearance. So let's use the last 2 unused digits to handle "special" characteristics. 

Definujme, že mačko zombies budú mať čislo `99` v posledných dvoch cifrách DNA (lebo mačky majú 9 životov). Takže v našom kóde povieme, že `ak` pochádza zombie z mačky, potom posledné dve cifry DNA sa budú rovnať `99`.
We'll say that cat-zombies have `99` as their last two digits of DNA (since cats have 9 lives). So in our code, we'll say `if` a zombie comes from a cat, then set the last two digits of DNA to `99`.

## If podmienky

`if` v Solidity vyzerá rovnako ako v Javascripte:
If statements in Solidity look just like javascript:

```
function eatBLT(string sandwich) public {
  // Spomeň si že v prípade reťazcov musíme porovnávať ich keccak256 
  // hashe na overenie rovnosti 
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# Vyskúšaj si to sám
# Put it to the test

Poďme implemntovať mačacie gény do našeho zombie DNA kódu
Let's implement cat genes in our zombie code.

1. Za prvé, poďme upraviť definíciu funkcie  `feedAndMultiply` tak, aby príjmala tretí argument: `string` s názvom `_species`.
1. First, let's change the function definition for `feedAndMultiply` so it takes a 3rd argument: a `string` named `_species`

2. Ďalej, po tom čo vypočítame DNA nového zombie, pridajme podmienku `if` a porovnajme `keccak256` hashe reťazcov `_species` a`"kitty"`.
2. Next, after we calculate the new zombie's DNA, let's add an `if` statement comparing the `keccak256` hashes of `_species` and the string `"kitty"`

3. Vo tele `if` podmienky nahradíme posledné dve cifry DNA čislom 99. Jedna z možností ako to dosiahnu't je použít nasledovný spôsob: `newDna = newDna - newDna % 100 + 99;`.
3. Inside the `if` statement, we want to replace the last 2 digits of DNA with `99`. One way to do this is using the logic: `newDna = newDna - newDna % 100 + 99;`.

  > Vysvetlenie: Predpokladajme že `newDna` is `334455`. Potom `newDna % 100` je `55`, takže `newDna - newDna % 100` je `334400`. Na záver, ak prídáme `99`, dostaneme `334499`.
  > Explanation: Assume `newDna` is `334455`. Then `newDna % 100` is `55`, so `newDna - newDna % 100` is `334400`. Finally add `99` to get `334499`.

4. Na koniec, potrebujeme upravi+t volanie funkcie vo vnútri `feedOnKitty`. Keď voláme `feedAndMultiply`, musíme pridať pradenie hodnoty nového parametru `_species` hodnotou `"kitty"`.
4. Lastly, we need to change the function call inside `feedOnKitty`. When it calls `feedAndMultiply`, add the parameter `"kitty"` to the end.
