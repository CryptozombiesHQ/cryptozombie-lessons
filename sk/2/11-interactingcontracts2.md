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
Continuing our previous example with `NumberInterface`, once we've defined the interface as:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Teraz ho môžeme použiť v našom kontrakte nasledovne:
We can use it in a contract as follows:

```
contract MyContract {
  address NumberInterfaceAddress = 0xab38... 
  // ^ Adresa kontraktu FavoriteNumber na Ethereum blockchain
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress);
  // Teraz `numberContract` ukazuje na cudzí FavoriteNumber kontrakt

  function someFunction() public {
    // Teraz môžme zavolať `getNum` toho kontraktu
    // Now we can call `getNum` from that contract:
    uint num = numberContract.getNum(msg.sender);
    // ... a niečo ďalej robiť s hodnotou `num` ktorú sme z neho obdržali 
  }
}
```

Takýmto sposobom, náš kontrakt može pracovať s iným kontraktom ktorý je na Ethereum blockchain, pokiaľ daný kontrakt odhaľuje svoje funkcie ako `public` alebo `external`.
In this way, your contract can interact with any other contract on the Ethereum blockchain, as long they expose those functions as `public` or `external`.

# Vyskúšaj si to sám
# Put it to the test

Poďme nastaviť náš kontrakt tak, aby čítal dáta z CryptoKitties smart kontraktu.
Let's set up our contract to read from the CryptoKitties smart contract!

1. Uložil som pre teba adresu CryptoKitties kontraktu do kódu, konkrétne do premennej pomenovanej `ckAddress`. Na ďalšom riadku vytvor rozhranie `KittyInterface` pomenované `kittyContract` . Inicializuj ho adresou `ckAddress` - presne ako sme to spravili na príklade s `numberContract` vyššie.
1. I've saved the address of the CryptoKitties contract in the code for you, under a variable named `ckAddress`. In the next line, create a `KittyInterface` named `kittyContract`, and initialize it with `ckAddress` — just like we did with `numberContract` above.
