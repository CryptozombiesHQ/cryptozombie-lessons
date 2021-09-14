---
title: Na čom sa kŕmia Zombies?
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // Tu vytvor KittyInterface

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Nadišiel čas nakŕmiť našich zombie! Ale na čom sa zombie kŕmia najradšej?

Nuž, ukázalo sa že CryptoZombies najviac zbožňujú...

**CryptoKitties!** 😱😱😱

(Áno, myslím to vážne 😆 )

Ay sme to mohli spraviť budeme potrebovať byť schopný čítať CryptoKitties smart kontrakt. Naimplementovať sa to dá, pretože dáta CryptoKitties su uložené verejne na blockchaine. No nie je blockchain super?

Naša hra v skutočnosti neporaní žiadnu mačičku CryptoKitty. Budeme iba *čítať* Cryptokitties dáta, nebudeme schopný ich zmazať alebo modifikovať 😉 

## Interakcia s inými kontraktmi

Na to aby náš kontrakt mohol komunikovať s iným kontraktom na blockchain, budeme musieť najrpv definovať **_rozhranie_** (**_interface_**).

Poďme sa pozrieť na nasledujúci jednoduchý príklad. Predstavme si, že na blockchaine je nasadený takýto kontrakt:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

Toto by bol jednoduchý kontrakt na ukladanie štastné číslo. Ktokoľvek môže nastaviť svoje šťastné čislo pomocou funkcie `setNum`. To potom bude asociované s jeho Ethereum adresou. Ďalej môže ktokoľvek vyhľadať štastné číslo priradené k ľubovolnej adrese.

Zvážme situáciou kedy by sme mali externý kontrakt, z ktorého by sme chceli čítať dáta z `LuckyNumber` kontraktu pomocou funkcie `getNum`.

Najprv by sme museli definovať **_rozhranie_** (**_interface_** ) v našom kontrakte:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Všimni si že to vyzerá ako definícia smart kontraktu, no s pár rozdielmi. Za prvé, deklarujeme iba funkcie s ktorými chceme pracovať. V tomto prípade by to bola funkcia `getNum`. Nemusíme vôbec spomínať ostatné funkcie alebo stavové premenné.

Za druhé, nemusíme definovať telá funkcií. Namiesto závoriek (`{` a `}`) proste ukončíme deklaráciu funkcie bodkočiarkou (`;`).

Takže to vyzerá len ako základná kostra kontraktu. Kompilátor tak porozumie, že sa jedná len o rozhranie.

Tým že zahrnieme toto rozranie do kódu našej dappky, náš kontrakt bude vedieť ako vyzerajú funkcie iného kontraktu, ako ich volať, a akú odpoveď od nich má očakávať naspäť.

Ako skutočne volať funkcie cudzieho kontraktu sa pozrieme v ďalšej lekcii, zatiaľ len deklarujeme rozranie Cryptokitties kontraktu, aby sme s ním mohli začať pracovať.

# Vyskúšaj si to sám

Pozreli sme sa na zdrojový kód CryptoKitties za teba a našli sme funkciu s názvom `getKitty`. Vracia všetky informácie o jednej mačke, včetne jej génov (a to je to, čo náš zombie potrebuje na vytvorenie nového zombie!).

Funkcia vyzerá nasledovne:

```
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
) {
    Kitty storage kit = kitties[_id];

    // if this variable is 0 then it's not gestating
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

Táto funkcia vyzerá trochu inak ako to, na čo sme zvyknutý. Všimni si že vracia... nie jednu, ale hneď niekoľko hodnôt. Ak prichádzaš z jazykov ako JavaScript, možno budeš prekvapený. v Solidity je možné vrátit z funkcie niekoľko hodnôt naraz.

Teraz keď už vieme, ako táto funkcia vyzerá, môžme to použiť na deklaráciu rozrania:

1. Deklaruj rozhranie s názvom `KittyInterface`. Bude vyzerať rovnako ako keď vytváraš nový kontrakt - použi kľučové slovo `contract`.

2. Vo vnútri rozrania deklaruj funkciu `getKitty` (bude kópiou funkcie ukázanej vyššie, no s rozdielom že za `returns` bude nasledovať bodkočiarka, namiesto `{` `}` závoriek).
