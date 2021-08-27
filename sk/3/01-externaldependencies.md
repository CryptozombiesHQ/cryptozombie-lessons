---
title: Nemennosť kontraktov
actions: ['checkAnswer', 'hints']
requireLogin: true
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

          // 1. Zmaž tento riadok
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Toto zmeň len na deklaráciu bez inicializácie
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Tu pridaj funkciu setKittyContractAddress

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

        KittyInterface kittyContract;

        function setKittyContractAddress(address _address) external {
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
---

Doposiaľ Solidity vyzeralo celkom podobne ako ostatné programovanie jazyky, napríklad Javascript. Existuje však niekoľko veľkých rozdielov, akými sa decentralizované aplikácie (DApps) na Ethéreu líšia od klasických aplikácií.

Za prvé, po tom čo nasadíš svoj kontrakt na Ethereum blockchain, stane sa **_nemeniteľným_**. To znamená že jeho kód už nikdy nemože byť upravený.

Kód kontraktu ktorý nasadíš na blockchain tam zostane navždy, permanentne. Práve to je ale jeden z dôvodov, prečo je bezpečnosť v prípade Solidity kontraktov extrémne dôležitá záležitosť. Ak je v tvojom kód chyba, nie je spôsob ako ju dodatočne napraviť. Musel by si povedať svojim užívateľom povedať, aby začali používať adresu nového smart kontraktu, obsahujúceho opravu chyby.

Nemeniteľnosť je zároveň užitočnou vlastnosťou smart kontraktov. Kód je zákon. Ak si prečítaš kód smart kontraktu, môžeš si byť istý, že vždy keď zavoláš jeho funkciu, vykoná sa presne tak, ako si to našiel napísané v kóde. Nikto sa nemôže dodatočne rozhodnúť upraviť kód danej funkcie a spôsobiť pre užívateľov neočakávané výsledky.  

## Externé závislosti

V Lekcii 2 sme zafixovali adresu CryptoKitties smart kontraktu do našej DApp. Ale čo by sa stalo, keby mal CryptoKitties kontrakt v sebe chybu a niekto zmazal všetky mačky?

Je to síce nepravdepodobné, ale keby sa to stalo, spravilo by to našu DAppku kompletne nepoužiteľnou. Naša DApp by odkazovala na kontrakt, ktorý by už neobsahoval žiadne krypto mačky. Naši zombie by sa neboli schopný na mačkách kŕmiť, a my by sme nemali možnosť náš kontrakt upraviť. 

Práve z tohoto dôvodu dáva zmysel vytvoriť taktiež funkcie, ktoré umožnia aktualizovať kľučové časti DAppky.

Napríklad namiesto zafixovania adresy CryptoKitties kontraktu do našej DAppky, mohli by sme si spraviť funkciu `setKittyContractAddress`, ktorá by nám umožnila túto adresu zmeniť. V prípade, že by sa v budúcnosti stalo CryptoKitties kontraktu niečo zlé, mohli by sme dodatočne aktualizovať adresu CryptoKitties (novú opravenú verziu CryptoKitties, ktorú by autori CryptoKitties museli nanovo nasadiť na blockchain).

## Vyskúšaj si to sám

Poďme upraviť náš kód z Lekcie 2 tak, aby sme boli schopný dodatočne zmneniť adresu CryptoKitties kontraktu.

1. Zmaž riadok kódu kde sme zafixovali hodnotu premennej `ckAddress`.

2. Uprav riadok, v ktorom sme deklarovali premennú `kittyContract`. Nenastavuj jej žiadnu hodnotu, ponechaj len deklaráciu.

3. Vytvor funkciu ktorá sa bude volať `setKittyContractAddress`. Bude príjmať jeden argument `_address` (typu `address`). Mala by to byť `external` funkcia.

4. Do vnútra tejto funkcie pridaj riadok kódu ktorý nastaví hodnotu premennej `kittyContract` na `KittyInterface(_address)`.

> Poznámka: Ak si v tejto funkcii všimneš bezpečnostnú zranitelnosť, neboj, opravíme to v ďalšej kapitole ;)
