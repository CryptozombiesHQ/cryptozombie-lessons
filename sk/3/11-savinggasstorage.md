---
title: Ukladanie Dát Je Drahé
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
            // Začni písať tu
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

          return result;
        }

      }
---

Jedna z najdrahších operácií v Solidity je používanie `storage` - predovšetkým zápis dát.

To preto, lebo zakaždým ked zapíšeš alebo zmeníš nejaké dáta, tie budú permanentne zapísané na blockchain. Navždy! Tisícky serverov po celom svete budú musieť tieto dáta uložiť na svoje hard disky. Ako bude blockchain rásť, množstvo takýchto dát sa bude čím ďalej, tým viac navyšovať. Preto je zápis dát na blockchain drahá operácia.

Na to aby sme udržali ceny čo najnižšie sa musíme snažiť vyhnúť zápisu dát na blockchain pokiaľ to nie je nevyhnutné. To môže mať za dôsledok zdanlivo neefektívne napísaný kód - napríklad vytváranie nového poľa v pamäti zakaždým keď je zavolaná určitá funkcia, namiesto toho aby sme si tieto dáta proste dopredu zapísali na blockchain.

V prípade väčšiny programovacích jazykov je iterácia cez veľké datasety operácia drahá na zdroje. Avšak v Solidity je tento spôsob lacnejší ako používanie `storage`, v prípade že sa jedná o `external view` funkciu. To preto, lebo `view` funkcie nestoja nestoja našich užívateľov žiaden gas (gas stojí našich užívateľov skutočné peniaze!).

V ďalšej kapitole sa pozrieme na `for` cykly. Ešte pred tým ale preberieme, ako deklarovať pole v pamäti.

## Deklarácia polí v pamäti

Na to aby si vo funkcii vytvoril pole v pamäti a nezapísal si žiadne dáta na blockchain môžeš použiť kľúčové slovo `memory`. Pole bude existovať len do konca behu funkcie. Takže z hľadiska gasu to bude oveľa lacnejšie ako zápis dát na blockchain - dokonca úplne zadarmo, v prípade `view` funkcie volanej externe.

Takto deklarujeme pole v pamäti:

```
function getArray() external pure returns(uint[]) {
  // Vytvor inštanciu nového poľa v pamäťti s dĺžkou 3
  uint[] memory values = new uint[](3);
  // Pridaj do neho nejaké hodnoty
  values.push(1);
  values.push(2);
  values.push(3);
  // vráť pole z funkcie
  return values;
}
```

Toto je triviálny príklad ktorý demonštruje syntax, ale v ďalšej kapitole sa pozrieme na to, ako môžme polia skombinovať s `for` cyklami v skutočných kontraktoch.

>Poznámka: polia v pamäti **musia** mať špecifikovanú dĺžku (v tomto príklade je to `3`). Polia, ktoré sídlia v pamäti nemôžu dynamicky meniť veľkost tak, ako to dokážu polia v trvalom `storage` dátovom úložisku pomocou `array.push()`. Je však možné, že toto chovanie sa zmení v budúcich verziách Solidity.

## Vyskúšaj si to sám

Z našej funkcie `getZombiesByOwner` cheme vrátit pole `uint`ov, teda `uint[]`, ktoré bude obsahovať všetkých zombies ktorých daný užívateľ vlastní.

1. Deklaruj premennú `result` typu `uint[] memory`.

2. Nastav jej hodnotu na nové `uint` pole. Dĺžka tohoto poľa by mala toľko, koľko zombie tento `_owner` vlastní. Tento počet môžeme zistiť z našeho mapovania `ownerZombieCount[_owner]`.

3. Na konci funkcie vrátime `result`. Zatiaľ je to len prázdne pole, no v ďalšej kapitole sa pozrieme ako ho vyplníme.
