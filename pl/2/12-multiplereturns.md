---
title: Obsługa Zwracania Wielu Wartości
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

        // define function here

        }
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

        function _createZombie(string memory _name, uint _dna) internal {
        uint id = zombies.push(Zombie(_name, _dna)) - 1;
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender]++;
        emit NewZombie(id, _name, _dna);
        }

        function _generateRandomDna(string memory _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
        }

        function createRandomZombie(string memory _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
        }

        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d; KittyInterface kittyContract = KittyInterface(ckAddress);
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna); }
      }
---

Funkcja `getKitty` jest naszym pierwszym przykładem funkcji, która zwraca wiele wartości. Spójrzmy, jak sobie z nimi radzić:

    function multipleReturns() internal returns(uint a, uint b, uint c) {
      return (1, 2, 3);
    }
    
    function processMultipleReturns() external {
      uint a;
      uint b;
      uint c;
      // W ten sposób wykonujesz wiele zadań:
      (a, b, c) = multipleReturns();
    }
    
    // Lub jeśli interesuje nas tylko jedna z wartości:
    function getLastReturnValue() external {
      uint c;
      // Możemy pozostawić pozostałe pola puste:
      (,,c) = multipleReturns();
    }
    

# Wypróbujmy zatem

Czas na interakcję z kontraktem CryptoKitties!

Uczyńmy, aby funkcja ta otrzymywała geny z kontraktu:

1. Napisz funkcję o nazwie `feedOnKitty`. Ma ona mieć 2 parametry typu `uint`, `_zombieId` oraz `_kittyId`, oznacz ją jako `public`.

2. Ta funkcja powinna najpierw deklarować zmienną `kittyDna` typu `uint`.
    
    > Uwaga: W naszym interfejsie `KittyInterface`, `geny` są typu `uint256` — ale jeśli pamiętasz z lekcji 1, `uint` jest aliasem dla `uint256` — to jest to samo.

3. Następnie powinna wywoływać funkcję `kittyContract.getKitty` z `_kittyId` i przechowywać `geny` w `kittyDna`. Pamiętaj — `getKitty` zwraca wiele wartości. (dokładnie 10 - jestem miły, policzyłem je dla Ciebie!). Ale to, na czym nam zależy, to ostatni, `geny`. Policz przecinki dokładnie!

4. Ostatecznie, funkcja powinna wywoływać `feedAndMultiply` i przekazać zarówno `_zombieId` oraz `kittyDna`.