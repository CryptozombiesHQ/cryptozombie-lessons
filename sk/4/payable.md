---
title: Payable
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

          // 1. Tu definuj funkciu levelUpFee 

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Tu vlož funkciu levelUp

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

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
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
---
Doposiaľ sme hovorili o niekoľkých **_funkčných modifikátoroch_**. Môže byť ťažké si všetko zapamätať, poďme si to teda ešte rýchlo zopakovať.

1. K dispozicií mamé modifikátory viditelnosti, ktoré určujú odkiaľ môže byť funkcia zavolaná. `private` znamená, že môže byť volaná len z ostatných funkcií rovnakého kontraktu. `internal` je ako `private`, ale môže byť volaná taktiež z kódu oddedených kontraktov. `external` funkcie môžu byť volané iba externe, mimo daného kontraktu. Na záver, funkcie `public` môžu byť volané odkiaľkoľvek - interne aj externe. 

2. Ďalej máme taktiež modifikátory stavu, ktoré deklarujú, akým spôsobom funkcia interaguje s blockchain. Modifikátor `view` deklaruje, že funkcia nemodifikuje žiadne dáta na blockchain. `pure` značí že funkcia nezapisuje ani nečíta žiadne dáta do a z blockchainu. Volanie oboch týchto typov funkcií je gasovo bezplatné, v prípade že sú volané externe mimo kontraktu (no budú stáť gas, v prípade že su zavolané interne inou funkciou kontraktu).

3. Na záver máme vlastné modifikátory `modifiers` o ktorých sme sa naučili v Lekcii 3. Napríklad `onlyOwner` a `aboveLevel`. Týmto môžeme napísať vlastnú logiku a definovať akým spôsobom funkciu ovplyvnia.

Všetky tieto typy modifikátorov môžu byť použité spolu, napríklad takto:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

V tejto kapitole sa pozrieme na ďalší modifikátor: `payable`.

## Modifikátor `payable`

Funkcie `payable` je to, čo robí Solidity a Ethereum tak cool - sú to špeciálne typy funkcií, ktoré su schopné príjmať Ether.

Poďme o tom chvíľu premýšlať. Keď zavoláš API klasického webového serveru, nemôžeš mu poslať americké doláre alebo bitcoin spolu s HTTP requestom.

Ale na Ethereum blockchain, pretože peniaze (_Ether_), dáta (*dáta transkacie*) aj kód kontraktu, ležia spoločne na Ethereum blockchain, je môžné naraz zavolať funkciu kontraktu **a zároveň** mu poslať peniaze.

To umožnuje vytvárať zaujímavú logiku. Napríklad kontrakt môže vyžadovať určité množstvo Etheru na to, aby volanú funkciu vykonal.

## Poďme sa pozrieť na príklad

```
contract OnlineStore {
  function buySomething() external payable {
    // skontroluj že 0.001 etheru bolo poslaného naraz s funkčným volaním
    require(msg.value == 0.001 ether);
    // Ak áno, potom môžme volatelovi funkcie privlastniť nejaký digitálny majetok, napríklad zombieho:
    transferThing(msg.sender);
  }
}
```

`msg.value` nám hovorí, koľko Etheru pre kontrakt bolo pripojeného k funkčnému volaniu. `ether` je vstaná jednotka. 

Na nasledujúcom príklade je ukážka, ako by niekto mohol zavolať túto funkciu z web3.js (z Javascriptového front endu našej DAppky):

```
// Predpoklajme, že `OnlineStore` referuje na náš kontrakt na Ethereum blockchain
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

Všimni si parameter `value`, ktorým javascriptové funkčné volanie špecifikuje koľko `ether`u poslať (0.001). Ak si predstavíme transakciu ako odoslanie obálky, funkčné parametre sú ako písmenká ktoré napíšeš na list v obálke a `value` je ako keď do tej obálky ešte pridáš bankovky. List aj peniaze v obálky sú potom doručené príjemcovi (kontraktu) vo forme transakcie.

>Poznámka: Ak funkcia nie je označená `payable` a pri jej zavolaní sa pokúsiš poslať nejaký Ether, transakcia bude odmietnutá.

## Vyskúšaj si to sám

Poďme v našej zombie hre vytvoriť `payable` funkciu.

Naša hra bude mať vlasnosť, že užívatelia môžu zaplatiť ETH za to, aby zvýšili level svojho zombie. ETH ktorý ľudia kontraktu pošlú zostane uložený v kontrakte ktorého si vlastník. Toto je jednoduchý príklad, ako môžeš na svojich blockchain hrách zarobiť peniaze. 

1. Definuj premennú kontraktu `uint` s názvom `levelUpFee` a nastav ju na hodnotu `0.001 ether`.

2. Vytvor funkciu s názvom `levelUp`. Tá bude príjmať jeden parameter `_zombieId` typu `uint`. Bude to funkcia `external` a `payable`.

3. Funkcia by mala najprv použiť `require` aby skontrolovala že `msg.value` sa rovná `levelUpFee`.

4. Ďalej by mala inkrementovať `level` daného zombie: `zombies[_zombieId].level++`.
