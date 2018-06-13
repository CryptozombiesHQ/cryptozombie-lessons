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

Doposiaľ Solidity vyzeralo celkom podobne ako ostatné programovanie jazyky, napríklad Javascript. Existuje však niekoľko veľkých rozdielov akými sa decentralizované aplikácie (DApps) na Ethereu líšia od klasických aplikácií.

Za prvé, po tom čo nasadíš svoj kontrakt na Ethereum blockchain, bude **_nemeniteľný_** , čo znamená že jeho kód už nikdy nemože byť upravený.

Počiatočný kód kontraktu ktorý nasadíš na blockchain tam zostane navždy, permanentne. Práve to je ale jeden z dôvodov, prečo je bezpečnosť v prípade Solidity kontraktov extrémne dôležitá záležitosť.. Ak je v tvojom kód chyba, nie je spôsob ako ju neskôr napraviť. Musel by si povedať svojim užívateľom aby začali používať adresu iného smart kontraktu, ktorý by zahrňoval opravu danej chyby.

No nemenitelnost je zároveň užitočnou vlastnosťou smart kontraktov. Kód je zákon. Ak si prečítaš kód smart kontraktu, môžeš si byť istý že vždy keď zavoláš jeho funkciu, vykoná sa presne to čo si našiel napísané v kóde. Nikto sa nemôže dodatočne rozhodnúť upraviť kód tej funkcie a spôsobiť neočakávané výsledky pre užívateľov.  

## Externé závislosti

V Lekcii 2 sme zafixovali adresu CryptoKitties smart kontraktu do našej DApp. Ale čo by sa stalo, keby CryptoKitties kontrakt mal v sebe chybu a niekto zmazal všetky mačky?

Je to síce nepravdepodobné, ale keby sa to stalo, spravilo by to našu DAppku kompletne nepoužitelnú - naša DApp by odkazovala na kontrakt ktorý by už nevracal žiadne krypto mačky. Naši zombie by sa teda neboli schopný na mačkách kŕmiť a my by sme nemali možnosť náš kontrakt upraviť. 

Práve z tohoto dôvodu dáva zmysel vytvárať funkcie, ktoré umožnia aktualizovať kľučové časti našej DApp.

Napríklad, namiesto zafixovania adresy CryptoKitties kontraktu do našej DAppky, mohli sme si spraviť funkciu `setKittyContractAddress`, ktorá by nám umožnila zmeniť túto adresu. V prípade že by sa v budúcnosti stalo CryptoKitties kontraktu niečo zlé, mohli by sme aktualizovať adresu CryptoKitties kontraktu na novú opravenú verziu.

## Vyskúšaj si to sám

Poďme upraviť náš kód z Lekcie 2, tak aby sme boli schopný modifikovať adresu CryptoKitties kontraktu.

1. Zmaž riadok kódu kde sme zafixovali hodnotu premennej `ckAddress`.

2. Upravit riadok, v ktorom sme vytvorili `kittyContract`. Namiesto priradenia hodnoty túto premennú len deklaruj.

3. Vytvor funkciu, ktorá sa bude volať `setKittyContractAddress`. Bude príjmať jeden argument `_address` (typu `address`). Mala by to byť `external` funkcia.

4. Vo vnútri tejto funkcie pridaj riadok kódu, ktorý nastaví hodnotu `kittyContract` rovnú `KittyInterface(_address)`.

> Poznámka: Ak si všimneš bezpečnostnú zranitelnosť v tejto funkcii, neboj, opravíme to v ďalšej kapitole ;)
