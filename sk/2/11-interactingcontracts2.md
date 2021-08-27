---
title: Používanie rozhrania
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
          // Tu nainicializuj kittyContract použitím `ckAddress` z riadku vyššie

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

      }
---
Pokračujeme v predošlom príklade s `NumberInterface`. Po tom ako sme definovali rozranie ako: 

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Ho teraz môžeme použiť v našom kontrakte nasledovne:

```
contract MyContract {
  address NumberInterfaceAddress = 0xab38... 
  // ^ Adresa kontraktu FavoriteNumber na Ethereum blockchaine
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress);
  // Teraz `numberContract` ukazuje na cudzí FavoriteNumber kontrakt

  function someFunction() public {
    // Teraz môžme zavolať `getNum` toho kontraktu
    uint num = numberContract.getNum(msg.sender);
    // ... a niečo ďalej robiť s hodnotou `num` ktorú sme z neho obdržali 
  }
}
```

Takýmto spôsobom môže náš kontrakt pracovať na Ethereum blockchain s cudzím kontraktom, za predpokladu že zverejňuje svoje funkcie prostredníctvom `public` alebo `external` modifikátorov.

# Vyskúšaj si to sám

Poďme nastaviť náš kontrakt tak, aby čítal dáta z CryptoKitties smart kontraktu.

1. Uložili sme pre teba adresu CryptoKitties kontraktu do kódu, konkrétne do premennej pomenovanej `ckAddress`. Na ďalšom riadku vytvor rozhranie `KittyInterface` pomenované `kittyContract`. Inicializuj ho adresou `ckAddress`, presne ako sme to spravili na príklade s `numberContract` vyššie.
