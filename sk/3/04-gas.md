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

Super! Teraz už vieme ako aktualizovať kľučové časti našej aplikácie, a zároveň zabrániť škodlivým užívateľom modifikovať kritcké dáta kontraktu.

Poďme sa pozrieť na ďalší aspekt ktorým sa Solidity líši od ostatných programovacích jazykov.

## Gas — palivo na ktorom bežia Ethereum DApps 

V solidity musia užívatelia zaplatiť zakaždým keď zavolajú nejakú funkciu tvojho kontraktu menou nazývanou **_gas_** (plyn). Užívatelia si môžu kúpiť gas za Ether (Ethéreum kryptomena). Znamená to, že tvoji užívatelia musia utrácať ETH na to, aby mohli volať funkcie tvojej DAppky.

Koľko gasu je na vykonanie funkcie potrebné záleží od toho, aká zložita je logika volanej funkcie. Každá individuálna operácia má určitú **_spotrebu gasu_** (**_gas cost_**). Spotreba gasu operácie je daná tým, koľko výpočtových zdrojov bude potrebných na vykonanie operácie (napríklad zápis dát do blockchain je oveľa drahšia operácia ako sčítanie dvoch čísel). Finálna množstvo gasu potrebné na vykonanie funkcie je vypočítané súčet všetkých výdajov gasu jednotlivých individuálnych výpočtových operácií počas behu funkcie.

Pretože vykonávanie funkcií stojí tvojich užívateľov reálne peniaze, optimalizácia kódu je na Ethéreu oveľa dôležitejšie ako v iných programovacích jazykoch. Ak je tvoj kód neporiadny, užívatelia budú musieť utratiť za používanie tvojho kontraktu viac. V prípade tísícok užívateľov je možné, že by ľudia zbytočne premrhali milióny dolárov.  

## Prečo je gas potrebný?

Ethereum je ako obrovský, pomalý, za to však extrémne bezpečný počítač. Keď zavoláš nejakú funkciu, každý jeden server ktorý je zapojený do Ethereum siete túto funkciu spustí a overí výstup. Tisícky počítačov verifikujúcich beh každej jednej zavolanej funkcie je presne to, čo robí Ethéreum decentralizovanou sieťou. Vďaka tomu sú dáta v blokchain nemeniteľné a odolné voči cenzúre.

Tvorcovia Ethérea chceli zabezpečiť situáciu, kedy by sa nejaký užívateľ pokúsil zahltiť celú sieť spustením nekonečného cyklu, alebo ju zaplaviť príliš náročným výpočtom. To je dôvod prečo transakcie nie sú zadarmo. Užívatelia musia zaplatiť za výpočtový čas potrebný na beh funkcie ktorú zavolajú a taktiež dáta ktoré na blockchain uložia. 

> Poznámka: Toto nie je nevyhnutne pravda pre bočné siete, tzv. sidechains. Príkladom takej je napríklad sieť, na ktorej autori CryptoZombies pracujú v Loom Network. Pravdepodobne by nedávalo celkom zmysel používať hlavnú Ethereum sieť pre aplikácie ako ako napríklad World of Warcraft - množstvo gasu ktoré by úživatelia museli utratiť by pre nich bola neúnosné. Mohla by byť však použitá sidechain s odlišným konsenzus algoritmom. Viac o tom, aké typy DApps sa hodia na sidechains a aké na hlavnú Ethereum sieť preberieme v budúcich lekciách.

## Úspora gasu balíčkovaním do štruktúr

V Lekcii 1 sme spomenuli, že existujú viaceré druhy `uint`ov: `uint8`, `uint16`, `uint32`, atď.

Za normálnych okolností nám používanie týchto pod-typov nedáva žiadnu výhody, pretože Solidity rezervuje v dátovom úložisku segment 256 bitov bez ohľadu na to, koľko bitový `uint` používame. Keď vo svojom kontrakte deklaruješ stavovú premennú typu `uint8` namiesto `uint` (`uint256`), neušetríš tým žiaden gas.

Existuje však výnimka: keď tieto typy používame vo vnútri štruktúr (`struct`).

Ak použijeme niekoľko `uint`ov vo vnútri štruktúri, použitie menších `uint`ov tam kde sa dá, umožní Solidity "zabalíčkovať" tieto premenné dokopy. Vo výsledku potom takáto štruktúra zaberie menej miesta na blockchaine. Napríklad: 

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

// `mini` štruktúra bude stáť menej gasu ako `normal` vďaka "balíčkovaniu" štruktúr
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

Z tohoto dôvodu je doporučené vo vnútri štruktúr používať uint pod-typy najmenšie ako sa dá

Aby balíčkovanie fungovalo, je potrebné usporiadať typy rovnakých dátových typov spolu (tým že ich napíšeš jeden za druhým do deklarácie štruktúry). Potom bude Solidity schopné ušetriť nároky na množstvo potrebného miesta v trvalom dátovom úložisku. Napríklad, štruktúra s atribútmi `uint c; uint32 a; uint32 b;` bude stáť menej gasu ako štruktúra `uint32 a; uint c; uint32 b;`, pretože `uint32` atribúty sú zapísané vedľa seba.

## Vyskúšaj si to sám

V tejto lekcii pridáme 2 nové atribúty pre našich zombie: `level` a `readyTime`. `readyTime` bude neskôr použitý na to, aby sme implementovali stopky a obmedzili ako často sa môže zombie kŕmiť.

Teraz sa poďme pozrieť späť na `zombiefactory.sol`.

1. Pridaj dva nové atribúty do našej `Zombie` štruktúry: `level` (typu `uint32`), and `readyTime` (typu `uint32`). Tieto dáta budeme chcieť zhlúčiť do jednej skupiny pre úsporu miesta balíčkovaním, takže oba atribúty pridaj na koniec štruktúry.

32 bitov je viac než dosť na udržovanie informácie o levele zombie a časovej značky. Ušetríme preto množstvo spotrebovaného gasu tým, že tieto dáta budú uložené tesnejšie pri sebe ako v prípade obyčajného `uint`u (256 bitov).
