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

V predchádzajúcej kapitole sme spomenuli, že občas je dobré použiť `for` cyklus na naplnenie obsahu poľa vo funkcií, namiesto toho aby sme si dáta odkladali do `storage` premenných na blockchaine.

Poďme preskúmať prečo je to tak.

Pre našu funkciu `getZombiesByOwner` by naivnou implementáciou bolo ukladanie vlastníkov zombie armád do mapovania v kontrakte `ZombieFactory`: 

```
mapping (address => uint[]) public ownerToZombies
```

Potom vždy keď by sme chceli vytvoriť nového zombie, jednoducho by sme použili `ownerToZombies[owner].push(zombieId)` na to, aby sme pridali záznam o novom zombie užívateľa. Funkcia `getZombiesByOwner` by tak mala veľmi jednoduchú implementáciu.

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### Problém takéhoto prístupu

Tento prístup je lákavý svojou jednoduchosťou. Poďme sa ale pozrieť na to, čo by sa stalo keby sme neskôr chceli zmeniť vlastníka zombie (čo je niečo, čo určite pridáme v neskoršej lekcii!).

Funkcia na prevádzanie vlastníka zombie by musela:
1. Pridať zombie do poľa `ownerToZombies` nového vlastníka,
2. Odobrať zombie z poľa `ownerToZombies` predošlého vlastníka,
3. Posunúť všetkých zombie v poli starého vlastníka aby sme vyplnili dieru, a potom
4. Znížiť dĺžku poľa o 1.

Krok čislo 3 by bol extrémne drahý z hľadiska množstva spotrebovaného gasu. Museli by sme totiž vykonať zapisovacie operácie pre každého zombie ktorý by bol posunutý. Ak by užívateľ mal napríklad 20 zombie a rozhodol sa predať niekomu inému svojeho zombie čislo 1, museli by sme zvýšných 19 posunúť aby sme zachovali ich poradie v poli.  

Nakoľko zápis do trvalého dátového uložiska je najdrahšou operáciou v Solidity, zmena vlastníctva zombie by bola extrémne drahá. Čo by bolo ešte horšie je to, že by cena bola zakaždným iná. Záležala by od toho, koľko zombie by užívateľ vlastnil a s ktorým z nich by obchodoval. Užívateľ by tak dobre nevedel, ako gasu transakcii venovať.

> Poznámka: Mohli by sme samozrejme presunúť posledného zombie v poli na to, aby sme vyplnili prázdnu pozíciu v poli, a skrátit dĺžku poľa o jedna. To by sme ale zmenili poradie zombie v armáde pri každom obchode.

Nakoľko `view` funkcie nestoja žiaden gas, ak su volané externe, môžme jednoducho vo funkcii `getZombiesByOwner` použiť `for` cyklus na to, aby sme preitrovali zoznam kompletne všetkých existujúcich zombie a skonštruovať pole, ktoré bude obsahovať len zombiekov jedného špecifického vlastníka. Tým bude naša `transfer` funkcia oveľa úspornejšia na gas. Nebudeme totiž musieť preorganizovávať polia v trvalom `storage` úložisku. Metóda ktorú volíme sa môže zdať neintutívna, no vo výsledku je skutočne úspornejšia.

## Používanie `for` cyklov

Syntax používania `for` cyhlov v Solidity je podobná syntaxi v Javascriptu.

Poďme sa pozrieť na príklad, v ktorom chceme skonštruovať pole párnych čisel.

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

## Vyskúšaj si to sám

Poďme dokončiť našu metódu `getZombiesByOwner` tým, že napíšeme `for` cyklus ktorý bude iterovať cez všetkých zombiekov v našej DApp a pre každého z nich porovná jeho majteľa. Zombies s majteľom, ktorého hľadáme, pripojíme do dočasného poľa `result` pred tým než ho vrátime z funkcie.

1. Deklaruj `uint` s názvom `counter` a nastav jeho hodnotu na `0`. Túto premennú použijeme na to, aby sme vedeli, na aký index poľa `result` musíme uložiť ďalšieho nájdeného zombie.

2. Deklaruj `for` cyklus, ktorý začína `uint i = 0` a iteruje, pokiaľ je pravda že `i < zombies.length`. To znamená že skontrolujeme úplne všetkých existujúcich zombie.

3. Vo vnútri `for` cyklu napíšeme podmienku `if`, ktorá bude kontrolovať že `zombieToOwner[i]` je rovná `_owner`. Toto porovná dve adresy, aby sme zistili či sme našli zhodu adries majteľov.

4. Vo vnútri `if` podmienky:
   1. Pridáme ID nájdeného zombie do poľa `result` tým, že nastavíme `result[counter]` na hodnotu `i`.

Funkcia bude teraz vracať id-čká všetkých zombies ktorí maju vlastníka `_owner`. A to všetko bez nutnosti míňať gas.
