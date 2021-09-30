---
title: Handling Multiple Return Values
actions: ['checkAnswer', 'hints']
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

          // Tu definuj funkciu

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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna);
        }

      }
---

Táto `getKitty` funkcia je prvým príkladom vracania niekoľkým hodnôt z funkcie. Poďme sa pozrieť ako tieto návratové hodnoty spracovať. 

```
function multipleReturns() internal returns(uint a, uint b, uint c) {
  return (1, 2, 3);
}

function processMultipleReturns() external {
  uint a;
  uint b;
  uint c;
  // Takto priradíš návratové hodnoty do niekoľkých premenných
  (a, b, c) = multipleReturns();
}

// Alebo v prípade že ťa zaujíma len jedna z hodnôt:
function getLastReturnValue() external {
  uint c;
  // Môžme ostatné položky ponechať prázdne takto:
  (,,c) = multipleReturns();
}
```

# Vyskúšaj si to sám

Je čas na interakciu s CryptoKitties kontraktom!

Poďme napísať funkciu ktorá získa gény mačky z CryptoKitties kontraktu:

1. Vytvor funkciu s názvom `feedOnKitty`. Bude príjmať 2 `uint` parametre - `_zombieId` a `_kittyId`. Mala by to byť `public` funkcia.

2. Funkcia by mala najprv deklarovať `uint` s názvom `kittyDna`.

  > Poznámka: V našom `KittyInterface`, `genes` je `uint256` - ale ak si spomenieš na Lekciu 1, `uint` je skratkou pre `uint256` - je to to isté.

3. Funkcia by potom mala volať funkciu `kittyContract.getKitty` s parametrom `_kittyId` a uložiť `genes` do `kittyDna`. Ber na vedomie, že `getKitty` vracia kopu návratových hodnôt. (10, aby sme boli presný. Sme dobrí, zrátali sme ich za teba!). Jediná návratová hodnota ktorá nás ale naozaj zaujíma je tá posledná, `genes`. Zrátaj si počet čiarok pozorne!

4. Funkcia by mala na záver zavolať `feedAndMultiply` a predať jej paremetre `_zombieId` a `kittyDna`.
