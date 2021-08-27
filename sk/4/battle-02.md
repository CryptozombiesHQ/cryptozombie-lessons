---
title: Náhodné čísla
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity ^0.4.19;

        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // Začni tu
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
          }

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
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

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
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

      import "./zombiehelper.sol";

      contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
      }

---

Skvelé. Poďme teraz vymyslieť ako budú fungovať súboje.

Všetky dobré hry v sebe majú štipku náhondosti. Takže ako vygenerujeme náhodné čisla v Solidity?

Skutočná odpoveď je v tomto prípade taká, že sa to v Solidity zatiaľ spraviť nedá. Aspoň nie úplne bezpečne.

Pozrieme na to, prečo je to tak.

## Generovanie náhodných čísel pomocou `keccak256`

Najlepším zdrojom náhodnosti v Solidity je hash funkcia `keccak256`.

Na generovanie náhodných čísel by sme mohli skúsiť spraviť niečo takéto:

```
// Vygeneruj náhodné čislo medzi 1 a 100
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

Tento kód vezme aktuálnu časovú známku z `now`, hodnotu `msg.sender` a číslo `nonce` (to je číslo, ktoré sa bude zakaždým inkrementovať, aby sa predišlo situácii, kde by sme spustili funkciu s rovnakými vstupnými parametrami dva krát). 

Potom tento kód použije `keccak` a skonvertuje kombináciu všetkých vstupov na náhodný hash. Jeho hodnotu skonvertuje na celé čislo `uint`. Na záver z tohoto čísla vypočítame `% 100`, aby sme dostali len posledné dve cifry. Tým konečne dostávame náhodné číslo v rozsahu 0 až 99. 

### Táto metóda je zraniteľná útokom nečestného uzlu

Keď v Ethéreu zavoláš funkciu kontraktu, rozpošle sa Ethéreum uzlom (serverom ktoré overujú transakcie) vo forme **_transakcie_**. Uzly v sieti pozbierajú niekoľko takýchto transakcií a pokúsia sa ako prvé vyriešiť výpočtovo náročný matematický problém, známy ako "Proof of Work". Keď ho vyriešia, zverejnia na Ethéreum sieť skupinu transakcií spolu vypočítaným riešením Proof of Work (PoW) vo forme **_bloku_**.

Po tom čo jeden uzol vyrieši PoW, ostatné uzly sa prestanú počítať atuálny PoW, ale overia že list transakcií ktoré zverejnil úspešný uzol je validný, akceptujú nový blok a začnú sa snažiť vyriešiť PoW pre ďalší blok.

**To je to čo robí našu generáciu nahodný čísel zraniteľnou**

Dajme tomu, že by sme spravili kontrakt na "hádzanie si mincou". Ak spadne hlava, tvoje peniaze sa zdvojnásobia, v opačnom prípade stratíš všetko. Dajme tomu že tento kontrakt používa funkciu na generovanie náhodných čisel ktorú sme ukázali vyššie k tomu, aby rozhodol, ktorá strana mince spadla (`random >= 50` bude hlava, `random < 50` bude znak).

Keby som v Ethéreum sieti bežal svoj vlastný uzol, mohol by som zverejniť transakciu **iba pre moj uzol** a rozhodnúť sa ju nezdieľat s ostatnými. Potom by som mohol v kontrakte opakovane hádzať mincou a sledovať, či sa mi podarilo hod vyhrať. Ak by som prehral, túto transakciu by som sa proste rozhodol nezačleniť do ďalšieho bloku transakcií na ktorom pracujem. Toto by som mohol robiť do nekonečna, až by sa mi nakoniec podarilo mincou víťazne hodiť. Takúto transakciu by som už  začlenil do ďalšieho bloku a profitoval.

## Tak ako bezpečne vygenerujeme náhodné čisla na Ethereum?

Pretože všetok obsah blockchainu je viditeľný všetkým zučastneným, je to náročný problém, a jeho riešenie je nad rámec tohoto tutoriálu. Môžeš sa o tom dočítať viacej <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>v tomto StackOverflow vlákne</a>. Jeden z nápadov je používať tzv. **_oracle_** pre prístup k funkcii generujúcej náhodné čísla mimo Ethereum blockchain.

Samozrejme že keďže by sme v sieti súťažili v overovaní ďalšieho bloku s desiatkami tísic iných Ethereum uzlov, šanca že by sa nám podarilo vyriešiť nasledujúci blok (ktorý by mohol obstahovať nami zmanipulovanú transakciu) by bola veľmi nízka. Potrebovali by sme veľké množstvo výpočtových zdrojov na to, aby sme z tejto zranitelnosti mohli s výnosne ťažiť. Keby však bola potenciálna odmena dostatočne veľká (keby bolo možné na hádzanie mincov staviť napríklad $100,000,000), stálo by to za pokus o útok.

Náhodná generácia čísel na Ethereu teda NIE JE bezpečná. Pokiaľ ale na našej náhodnej funkcií nezáleží obrovské množstvo peňazí, v praxi je to tak, že užívatelia pravdepodobne nebudú mať k dispozicii dostatok zdrojov na to aby ju napadli.

Pretože v tomto tutoriále vytvárame len jednoduchú hru za účelom ukážky, a v stávke nie sú žiadne reálne peniaze, rozhodli sme sa akceptovať riziká ktoré so sebou nesie použitie takéhoto náhodného generátora. Generátor nebude celkom 100% bezpečný, no výhodou je jeho jednoduchá implementácia.

V budúcich lekciách môžno pokryjeme tému **_oracle_** (bezpečný spôsob ako získať dáta z mimo Ethereum siete) na to, aby sme mohli získať náhodné čísla generované mimo blockchain. 

## Vyskúšaj si to sám

Poďme teraz naimplementovať funkciu, ktorá bude počítať náhodné čísla. Tú využijeme na určovanie výsledkov našich zombie zápasov, hoci nebude zabezpečené voči útokom spomenutého typu.

1. Daj svojmu kontraktu `uint` s názvom `randNonce` a nstav ho na hodnotu `0`.

2. Vytvor funkciu s názvom `randMod`(random-modulus). Bude to `internal` funkcia ktorá príjma `uint` s názvom `_modulus` a vracia hodnotu typu `uint`.

3. Funkcia by mala najprv inkrementovať `randNonce` (s použitím syntaxe `randNonce++`). 

4. Na záver by mala (v jednom riadku kódu) vypočítať `keccak256` hash z hodnôt `now`, `msg.sender`, `randNonce`, výsledok pretopovať na `uint`. Z toho by sa mala spočítať hodnota `% _modulus`, a tento výsledok bude vrátený (`return`) z funkcie. (Huh, to možno znie trochu zložito. Ak si sa v tom stratil, pozri sa na to ako sme generovali náhodné čísla na našom pôvodnom príklade hore - logika je veľmi podobná).
