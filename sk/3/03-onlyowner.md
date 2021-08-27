---
title: Funkčný modifikátor onlyOwner
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

          KittyInterface kittyContract;

          // Uprav túto funkciu
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
---

Teraz keď náš základný kontrakt `ZombieFactory` dedí od `Ownable`, môžeme použiť funkčný modifikátor `onlyOwner` taktiež v kontrakte `ZombieFeeding`.

To preto, ako funguje dedičnost kontraktov. Ak máme takúto hierarchiu:

```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```

`ZombieFeeding` je `ZombieFactory`, a `ZombieFactory` je `Ownable`. Potom `ZombieFeeding` je tiež `Ownable`. Preto `ZombieFeeding` má taktiež prístup k funkciám, udalostiam a modifikátorom `Ownable` kontraktu. Rovnaký princíp sa ďalej aplikuje na všetky kontrakty ktoré budú v budúcnosti ďalej dediť od `ZombieFeeding`.

## Funkčné modifikátory

Funkčný modifikátor vyzerá úplne ako funkcia, no používa kľučové slovo `modifier` namiesto `function`. Naviac nemôže byť zavolaný priamo, ako funkcia. Miesto toho môžeme ale modifikátor pripojiť na koniec hlavičky nejakej funkcie a tak modifikovať jej správanie.

Poďme sa na to lepšie pozrieť skúmaním modifkátoru `onlyOwner`: 

```
/**
 * @dev Throws if called by any account other than the owner.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

Tento modifikátor potom môžeme použiť takýmto spôsobom:

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // Všimni si použitie `onlyOwner`:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

Všimni si modifikátor `onlyOwner` na funkcii `likeABoss`. Keď zavoláš `likeABoss`, kód vo vnútri `onlyOwner` sa vykoná **ako prvý**. Až potom, keď sa tok kódu dostane ku riadku `_;` vo vnútri `onlyOwner`, začne sa vykonávať kód pôvodne volanej funkcie `likeABoss`.

Existujé rozličné možnosti ako využiť modifikátory, no jeden z najtypickéjších prípadov je na vykonanie určitých `require` kontrol, pred tým než sa funkcia začne vykonávať.

V prípade `onlyOwner`, využitie tohoto modifikátora zaručí to, že **iba** (only) **vlasntník** (owner) kontraktu (to si ty, ktorý si nasadil kontrakt na blockchain) može funkciu s týmto modifikátorom úspešne zavolať.

>Poznámka: Pridávanie takýchto špeciálnych schopností je často síce nevyhnutnosť, no je to zároveň niečo, čo vlastníci kontraktov môžu zneužiť proti užívateľom. Napríklad, vlastník kontraktu môže pridať backdoor funkciu, ktorá by len jemu umožnila privlastniť si cudzích zombies!

>Preto je dôležité si pamätať, že len preto že je naša DAppka na Ethéreu ju nerobí automaticky decentralizovanou. Je treba si prečítať zdrojový kód a uistiť sa, že neobsahuje špeciálne kontrolné funkcie pre vlastníka kontraktu, ktoré by mohli predstavovať problém. Pri písaní DAppiek je potrebné nájsť určitú rovnováhu medzi schopnosťou udržiavať aplikáciu funkčnú, byť schopný opraviť pontencionálne bugy, no zároveň vytvoriť necentralizovanú platformu, ktorej užívatelia môžu veriť.  

## Vyskúšaj si to sám

Teraz môžeme obmedziť prístup do `setKittyContractAddress` tak, aby sme túto funkciu mohli volať len my.

1. Pridaj funkcii `setKittyContractAddress` modifikátor `onlyOwner`.
