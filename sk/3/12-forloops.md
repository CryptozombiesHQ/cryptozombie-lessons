---
title: For Cyklus
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

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // Začni písať tu
            return result;
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
          uint[] memory result = new uint[](ownerZombieCount[_owner]);
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

V predchádzajúcej kapitole sme spomenuli, že občas je dobŕe použiť `for` cyklus na naplnenie obsahu poľa vo funkcií, namiesto toho aby sme si dáta odkladali do `storage` premenných na blockchain.
In the previous chapter, we mentioned that sometimes you'll want to use a `for` loop to build the contents of an array in a function rather than simply saving that array to storage.

Poďme sa pozrieť na to prečo.
Let's look at why.

Pre našu funkciu `getZombiesByOwner` by naivnou implementáciou bolo ukladanie vlastníkov zombie armád do `mapping` v kontrakte `ZombieFactory`: 
For our `getZombiesByOwner` function, a naive implementation would be to store a `mapping` of owners to zombie armies in the `ZombieFactory` contract:

```
mapping (address => uint[]) public ownerToZombies
```

Potom vždy keď by sme chceli vytvoriť nového zombie, jednoducho by sme použili `ownerToZombies[owner].push(zombieId)` na to aby sme pridali záznam o novom zombie užívateľa. Funkcia `getZombiesByOwner` by tak mala veľmi jednoduchú implementáciu.
Then every time we create a new zombie, we would simply use `ownerToZombies[owner].push(zombieId)` to add it to that owner's zombies array. And `getZombiesByOwner` would be a very straightforward function:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### Problém takéhoto prístupu
### The problem with this approach

Tento prístup je lákavý svojou jednoduchosťou. Poďme sa ale pozrieť na to, čo by sa stalo keby sme neskôr chceli zmeniť vlastníka zombie (čo je niečo čo určite pridáme v neskoršej lekcií!).
This approach is tempting for its simplicity. But let's look at what happens if we later add a function to transfer a zombie from one owner to another (which we'll definitely want to add in a later lesson!).

Funkcia na prevádzanie vlastníka zombie by musela:
1. Pridať zombie do poľa `ownerToZombies` nového vlastníka,
2. Odobrať zombie z poľa `ownerToZombies` predošlého vlastníka,
3. Posunúť všetkých zombie v poli starého vlastníka aby sme vyplnili dieru, a potom
4. Znížiť dĺžku poľa o 1.

That transfer function would need to:
1. Push the zombie to the new owner's `ownerToZombies` array,
2. Remove the zombie from the old owner's `ownerToZombies` array,
3. Shift every zombie in the older owner's array up one place to fill the hole, and then
4. Reduce the array length by 1.

Krok čislo 3 by bol extrémne drahý z hľadiska množstva potrebného gasu. Museli by sme totiž vykonať zapisovacie operácie pre každého zombie ktorý by bol posunutý. Ak by užívateľ mal napríklad 20 zombie a rozhodol sa predať niekomu inému svojeho zombie čislo 1, museli by sme zvýšných 19 posunúť aby sme zachovali ich poradie v poli.  
Step 3 would be extremely expensive gas-wise, since we'd have to do a write for every zombie whose position we shifted. If an owner has 20 zombies and trades away the first one, we would have to do 19 writes to maintain the order of the array.

Nakoľko zápis do trvalého dátového uložiska je najdrahšou operáciou v Solidity, zmena vlastníctva zombie by bola extrémne drahá. Čo by bolo ešte horšie je to, že by cena bola zakaždným iná, podľa toho koľko zombie by užívateľ vlastnil a podľa toho s ktorým z nich by obchodoval. Užívateľ by tak nevedel, ako gasu transakcii dať.
Since writing to storage is one of the most expensive operations in Solidity, every call to this transfer function would be extremely expensive gas-wise. And worse, it would cost a different amount of gas each time it's called, depending on how many zombies the user has in their army and the index of the zombie being traded. So the user wouldn't know how much gas to send.

> Poznámka: Mohli by sme samozrejme presunúť posledného zombie v poli na to, aby sme vyplnili prázdnu pozíciu v poli, a skrátit dĺžku poľa o jedna. To by sme ale zmenili poradie zombie v armáde zakaždým keď by sme s nimi obchodovali.
> Note: Of course, we could just move the last zombie in the array to fill the missing slot and reduce the array length by one. But then we would change the ordering of our zombie army every time we made a trade.

Nakoľko `view` funkcie nestoja žiaden gas, ak su volané externe, môžme jednoducho vo funkcii `getZombiesByOwner` použiť `for` cyklus na to, aby sme preitrovali zoznam úplne všetkých zombie a skonštruovať pole zombiekov, ktoré bude obsahovať len zombie jedného špecifického vlastníka. Tým bude naša `transfer` funkcia oveľa úspornejšia na gas, pretože nebudeme musieť preorganizovávať polia v trvalo úložisku `storage`. Metóda ktorú volíme sa môže zdať neintutívna, no vo výsledku je skutočne celkovo lacnejšia.
 Since `view` functions don't cost gas when called externally, we can simply use a for-loop in `getZombiesByOwner` to iterate the entire zombies array and build an array of the zombies that belong to this specific owner. Then our `transfer` function will be much cheaper, since we don't need to reorder any arrays in storage, and somewhat counter-intuitively this approach is cheaper overall.

## Používanie `for` cyklov
## Using `for` loops

Syntax používania `for` cyhlov v Solidity je podobná syntaxi v Javascripte.
The syntax of `for` loops in Solidity is similar to JavaScript.

Poďme sa pozrieť na príklad, v ktorom chceme skonštruovať pole párnych čisel.
Let's look at an example where we want to make an array of even numbers:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // V tejto premennej si budeme držať prehľad o aktuálnom indexe v poli
  uint counter = 0;
  // Cyklom iterujeme od 1 do 10
  for (uint i = 1; i <= 10; i++) {
    // ak je číslo `i` párne
    if (i % 2 == 0) {
      // Pridáme ho do našeho poľa
      evens[counter] = i;
      // Inkrementujeme počítadlo `counter` na nový voľný index v poli `evens`
      counter++;
    }
  }
  return evens;
}
```

Táto funkcia vráti pole s obstahom `[2, 4, 6, 8, 10]`.
This function will return an array with the contents `[2, 4, 6, 8, 10]`.

## Vyskúšaj si to sám
## Put it to the test

Poďme dokončiť našu metódu `getZombiesByOwner` tým, že napíšeme `for` cyklus ktorý bude iterovať cez všetkých zombiekov v našej DApp a pre každého porovná jeho majteľa. Zombies s majteľom ktorého hľadáme pripojíme do dočasného poľa `result`, pred tým než ho vŕatime.
Let's finish our `getZombiesByOwner` function by writing a `for` loop that iterates through all the zombies in our DApp, compares their owner to see if we have a match, and pushes them to our `result` array before returning it.

1. Deklaruj  `uint` s názvom `counter` a nastav jeho hodnotu na `0`. Túto premennú použijeme na to, aby sme vedeli, aký index poľa `result` musíme uložiť ďalšieho nájdeného zombie.
1. Declare a `uint` called `counter` and set it equal to `0`. We'll use this variable to keep track of the index in our `result` array.

2. Deklaruj `for` cyklus, ktorý bude začínať `uint i = 0` a iteruje až kým je pravda že `i < zombies.length`. To znamená že skontrolujeme všetkých existujúcich zombie.
2. Declare a `for` loop that starts from `uint i = 0` and goes up through `i < zombies.length`. This will iterate over every zombie in our array.

3. Vo vnútri `for` cyklu napíšeme podmienku `if`, ktorá bude kontrolovať že `zombieToOwner[i]` je rovná `_owner`. Toto porovná dve adresy, aby sme zistili či sme našli zhodu adries majteľov.
3. Inside the `for` loop, make an `if` statement that checks if `zombieToOwner[i]` is equal to `_owner`. This will compare the two addresses to see if we have a match.

4. Vo vnútri `if` podmienky:
   1. Pridáme ID nájdeného zobmei do poľa `result`, tým že nastavíme `result[counter]` na hodnotu `i`.
   2. Inkrementuje `counter` o 1 (pozri sa na `for` cyklus na vyššie uvedenom príklade)   
4. Inside the `if` statement:
   1. Add the zombie's ID to our `result` array by setting `result[counter]` equal to `i`.
   2. Increment `counter` by 1 (see the `for` loop example above).

To je všetko - funkcia bude teraz vracať ID všetkých zombies ktorý maju vlastníka `_owner`, bez toho aby sme museli použit gas.
That's it — the function will now return all the zombies owned by `_owner` without spending any gas.
