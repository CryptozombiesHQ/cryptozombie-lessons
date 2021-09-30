---
title: Prevencia Pretečenia
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";
        // 1. Tu importuj

        contract ZombieFactory is Ownable {

          // 2. Tu deklaruj safemath

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;
          uint cooldownTime = 1 days;

          struct Zombie {
            string name;
            uint dna;
            uint32 level;
            uint32 readyTime;
            uint16 winCount;
            uint16 lossCount;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) internal {
            uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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
      "zombieownership.sol": |
        pragma solidity ^0.4.19;

        import "./zombieattack.sol";
        import "./erc721.sol";
        
        contract ZombieOwnership is ZombieAttack, ERC721 {

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) public view returns (uint256 _balance) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) public view returns (address _owner) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to]++;
            ownerZombieCount[_from]--;
            zombieToOwner[_tokenId] = _to;
            Transfer(_from, _to, _tokenId);
          }

          function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            _transfer(msg.sender, _to, _tokenId);
          }

          function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _to;
            Approval(msg.sender, _to, _tokenId);
          }

          function takeOwnership(uint256 _tokenId) public {
            require(zombieApprovals[_tokenId] == msg.sender);
            address owner = ownerOf(_tokenId);
            _transfer(owner, msg.sender, _tokenId);
          }
        }
      "zombieattack.sol": |
        pragma solidity ^0.4.19;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          uint randNonce = 0;
          uint attackVictoryProbability = 70;

          function randMod(uint _modulus) internal returns(uint) {
            randNonce++;
            return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
          }

          function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            Zombie storage enemyZombie = zombies[_targetId];
            uint rand = randMod(100);
            if (rand <= attackVictoryProbability) {
              myZombie.winCount++;
              myZombie.level++;
              enemyZombie.lossCount++;
              feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
            } else {
              myZombie.lossCount++;
              enemyZombie.winCount++;
              _triggerCooldown(myZombie);
            }
          }
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

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
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

          modifier onlyOwnerOf(uint _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            _;
          }

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal onlyOwnerOf(_zombieId) {
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
      "safemath.sol": |
        pragma solidity ^0.4.18;

        /**
         * @title SafeMath
         * @dev Math operations with safety checks that throw on error
         */
        library SafeMath {

          /**
          * @dev Multiplies two numbers, throws on overflow.
          */
          function mul(uint256 a, uint256 b) internal pure returns (uint256) {
            if (a == 0) {
              return 0;
            }
            uint256 c = a * b;
            assert(c / a == b);
            return c;
          }

          /**
          * @dev Integer division of two numbers, truncating the quotient.
          */
          function div(uint256 a, uint256 b) internal pure returns (uint256) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint256 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          /**
          * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
          */
          function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            assert(b <= a);
            return a - b;
          }

          /**
          * @dev Adds two numbers, throws on overflow.
          */
          function add(uint256 a, uint256 b) internal pure returns (uint256) {
            uint256 c = a + b;
            assert(c >= a);
            return c;
          }
        }
      "erc721.sol": |
        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

          function balanceOf(address _owner) public view returns (uint256 _balance);
          function ownerOf(uint256 _tokenId) public view returns (address _owner);
          function transfer(address _to, uint256 _tokenId) public;
          function approve(address _to, uint256 _tokenId) public;
          function takeOwnership(uint256 _tokenId) public;
        }
    answer: |
      pragma solidity ^0.4.19;

      import "./ownable.sol";
      import "./safemath.sol";

      contract ZombieFactory is Ownable {

        using SafeMath for uint256;

        event NewZombie(uint zombieId, string name, uint dna);

        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        uint cooldownTime = 1 days;

        struct Zombie {
          string name;
          uint dna;
          uint32 level;
          uint32 readyTime;
          uint16 winCount;
          uint16 lossCount;
        }

        Zombie[] public zombies;

        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;

        function _createZombie(string _name, uint _dna) internal {
          uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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

Gralujeme. Tvoja implementácia ERC721 štandardu je hotová!

To nebolo zas tak ťažké, čo povieš? Veľa vecí okolo Ethereum znie veľmi zložito keď o nich počuješ rozprávať ostatných ľudí. Najlepší spôsob ako veciam porozumieť je skúsiť si ich sám naimplementovať.

Pamätaj však že toto bola len minimálna implementácia. Mohli by sme ju rozšíriť o ďalšie vlastnosti, napríklad pridať dodatočné kontroly, aby užívatelia nemohli odoslať svojich zombies na adresu `0` (Posielanie tokenov na takúto adresa sa nazýva "pálenie" ("burning") tokenov. Znamená to totiž odosielanie tokenov na adresu, ktorej privátny kľúč nikto nemá. Preto tokeny na tejto adrese zostanú navždy neobnoviteľnými). Ďalšia dodatočná funkcionalita našej DApp, ktorú by sme mohli pridať, by mohli byť aukcie. (Dokáž prísť s nejakými nápadmi ako také niečo naimplementovať?)

Chceli sme však túto lekciu spraviť ľahko stráviteľnú, preto sme prešli iba základnou implementáciou. Keby si chcel vidieť príklad pokročilejšej implementácie, môžeš sa po tomto tutoriále pozrieť na OpenZeppelin ERC721 kontrakt.


### Bezpečnostné vylepšenia kontraktu: Pretečenie a podtečenie

Teraz sa pozrieme na jednu z najdôležitejších bezpečnostných vlastností, ktorých by si si mal byť vedomí pri písani smart kontraktov. Ochrana pred pretečením a podtečením.

Čo je to  **_pretečenie_**?


Dajme tomu, že máme nejaký `uint8`, ktorý má len 8 bitov. To znamená, že najväčšie číslo, ktoré môže držat je binárne `11111111` (decimálne je to, 2^8 - 1 = 255).

Pozri sa na nasledujúci kód. Čomu sa bude na konci rovnať `number`?

```
uint8 number = 255;
number++;
```

V tomto prípade sme spôsobili pretečenie. Číslo `number` sa na konci tohotu kódu neintuitívne bude rovnať `0`, a to napriek tomu, že sme sa jeho hodnotu pokúsili inkrementovať! (Keď pridáš 1 ku binárnemu čislu `11111111`, vyresetuje sa naspať na `00000000`, rovnako ako sa čas na hodinkách mení z `23:59` na `00:00`).

Podtečenie je podobné. Nastáva v prípade že odčítaš `1` od `uint8` ktorý sa rovná `0`. Výsledok sa bude rovnať `255` (pretože `uint` je bez znamienka, nemôže nadobúdať záporné hodnoty).

V našom kóde síce nepoužívame `uint8`, a môže sa zdať nepravdepodobné, že by `uint256` pretiekol len preto, že mu zakaždým pričítame jednotku (2^256 je skutočne gigantické číslo). Napriek tomu je stále dobrou praktikou naimplementovať ochranné mechanizmy, aby sme mali istotu že naša DApp sa v budúcnosti nikdy nedostane do neočakávaného stavu. 

### Používanie SafeMath

Na to, aby sme sa tomu vyhli, OpenZeppelin vytvoril **_knižnicu_** (**_library_**) s názvom SafeMath. Tá zabraňuje vyššie spomenutým problémom.

Ale než sa k tomu dostaneme... čo je to vlastne knižnica?

**_Knižnica_** (**_library_**), je v solidity špeciálny typ kontraktu. Jeden zo spôsobov, akým sú knižnice užitočné je ten, že môžu rozšíriť natívne dátové typy o nové funkcie.

Najprv musíme deklarovať v našom kontrakte, že chceme časť knižnice používať takýmto spôsobom `using SafeMath for uint256`. SafeMath knižnica má 4 funkcie - `add`, `sub`, `mul`, and `div`. K týmto funkciám budeme môcť pristupovať z `uint256` takto:

```
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```

Na to, čo presne tieto funkcie robia sa pozrieme v ďalšej kapitole. Zatiaľ poďme len pridať SafeMath knižnicu do našeho kontraktu.


## Vyskúšaj si to sám

Do tvojeho projektu sme ti už pridali `SafeMath` knižnicu, nájdeš ju v súbore `safemath.sol`. Môžeš sa pozrieť ako vyzerá jej kód, no to budeme skutočne podrobnejšie preberať až v ďalšej kapitole.

Najprv poďme našemu kontraktu povedať, aby používal SafeMath. Spravíme to v Zombie Factory, nášom úplne najzákladnejšom kontrakte. To nám umožní používať SafeMath funkcie aj vo všetkých kontraktoch, ktoré od neho dedia. 

1. Importuj `safemath.sol` do `zombiefactory.sol`.

2. Pridaj deklaráciu `using SafeMath for uint256;`.
