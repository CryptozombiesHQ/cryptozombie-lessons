---
title: Gas
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

            struct Zombie {
                string name;
                uint dna;
                // Pridaj tu nové atribúty
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
---

Super! Teraz už vieme ako aktualizovať kľučové časti našej aplikácie, no zaroveň zabrániť škodlivým užívaľom hrabať sa v našom kontrakte.

Poďme sa pozrieť na ďalší aspekt, ktorým sa Solidity líši od ostatných programovacích jazykov.

## Gas — palivo na ktorom bežia Ethereum DApps 

V solidity musia užívatelia zaplatiť zakaždým keď zavolajú nejakú funkciu tvojho kontraktu meno nazývanou **_gas_** (plyn). Užívatelia si môžu kúpiť gas za Ether (Ethereum kryptomena), to znamená že tvoji užívatelia musia utrácať ETH na to, aby mohli vyvolávať funkcie tvojej DAppky.

Koľko gasu je požadovaného na vykonanie funkcie záleží od toho aká zložita je logika funkcie. Každá individuálna operácia má určitú **_cenu gasu_** (**_gas cost_**), na základe toho koľko výpočtových zdrojov bude potrených na vykonanie danej opeŕacie (napríklad zápis dát do blockchain je oveľa drahšia operácia ako sčítanie dvoch čísel). Finálna cena (koľko "gasov" bude užívateľ zaplatiť) za vykonanie funkcie, je daná ako súčet všetkých výdajov gasu na všetky individuálne výpočtové operácie počas jej vykonávania.

Pretože vykonávanie funkcií stojí tvojich užívateľov reálne peniaze, optimalizácia kódu je na Ethereu oveľa dôležitejšia ako v iných programovacích jazykoch. Ak je tvoj kód neporiadny, užívatelia budú musieť utratiť za používanie tvojho kontraktu viac - v prípade tísícok užívateľov by tak moholo možné že by ľudia utratili milióny zbytočne.  

## Prečo je gas potrebný?

Ethereum je ako obrovksý, pomalý ale extrémny bezpečný počítač. Keď zavoláš nejakú funkciu, každý jeden server ktorý je zapojený do Ethereum siete túto funkciu spustí a overí výstup - tisícky počítačov verifikujúcich beh každej jednej zavolanej funkcie je to, čo robit Ethereum decentrailozvanu sieťou. Vďaka tomu sú dáta v blokchain nemeniteľné a odolné voči cenzúre.

Tvorcovia Ethereum chceli zabezpečiť situáciu kedy by sa nejaký užívateľ pokúsil zahltiť celú sieť spustením nekonečného cyklu, alebo ju zaplaviť príliš náročným výpočtom. Práve preto transakcie nie sú zadarmo, užívatelia musia zaplatiť za výpočtový čas potrebný na beh funkcie ktorú zavolajú, a taktiež dáta ktoré do blockchain uložia. 

> Poznámka: Toto nie je nevyhnutne pravda pre bočné siete, tzv. sidechains. Príkladom takej je sieť, na ktorej autori CryptoZombies pracujú v Loom Network. Pravdepodobne by nedávalo celkom zmysel používať hlavnú Ethereum sieť pre ako ako napríklad World of Warcraft - množstvo gasu ktoré by úživatelia museli utratiť by pre nich bola neúnosná. Mohla by byť však použitá sidechain s odlišným konsenzus algoritmom. Viac o tom, aké typy DApps sa hodia na sidechains a aké na hlavnú Ethereum sieť, budeme preberať v budúcich lekciách.

## Úspora gasu balíčkovaním do štruktúr

V Lekcii 1 sme spomenuli že existuju viaceré druhy `uint`ov: `uint8`, `uint16`, `uint32`, atd.

Za normálnych okolností nám používanie týchto pod-typov nedáva žiadnu výhody, pretože Solidity rezervuje v dátovom úložisku segment 256 bitov bez ohľadu na to, koľko bitový `uint` používame. Keď vo svojom kontrakte deklaruješ stavovú premennú typu `uint8` namiesto  `uint` (`uint256`), neušetríš tým žiaden gas.

Existuje však výnimka: ked tieto typy používame vo vnútri štruktúr (`struct`).

Ak použijeme niekoľko `uint`ov vo vnútri štruktúri, použitie menších `uint`ov tam kde sa dá, umožní Solidity zabalíčkovať tieto premenné dokopy a vy výsledku takáto štruktúra zaberie menej miesta. Napríklad: 

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` will cost less gas than `normal` because of struct packing
// `mini` štruktúra bude stáť menej gasu ako `normal` vďaka balíčkovaniu štruktúr
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

Z tohoto dôvodu je doporučene vo vnútri štruktúr používať uint pod-typy najmenšie ako sa dá

Aby to fungovalo, je ale potrebné usporiadať typy rovnakých dátových typov spolu (tým že ich napíšeš jeden za druhým v štruktúre). Potom bude Solidity schopné ušetriť nároky na množstvo potrebného miesta v dátovom úložisku. Napríklad, štruktúra s atribútmi `uint c; uint32 a; uint32 b;` bude stáť menej gasu ako štruktúra, pretože `uint32` atribúty sú zhromadené dokopy.

## Vyskúšaj si to sám

V tejto lekcii pridáme 2 nové atribúty pre našich zombie: `level` a `readyTime`. `readyTime` bude neskôr použitý na to, aby sme implementovali stopky a obmedzili ako často sa môže zombie kŕmiť.

Teraz sa poďme pozriet spať na `zombiefactory.sol`.

1. Pridaj dva nové atribúty do našej `Zombie` štruktúry: `level` (typu `uint32`), and `readyTime` (typu `uint32`). Tieto dáta budeme chcieť zhlúčiť do jednej skupiny pre úsporu miesta balíčkovaním, takže oba atribúty pridaj na koniec štruktúry.

32 bitov je viac než dosť na udržovanie informácie o levele zombie a časovej značky, takže ušetríme množstvo spotrebovaného gasu tým, že tieto dáta budú uložené tesnejšie pri sebe ako v prípade obyčajného `uint`u (256 bitov).
