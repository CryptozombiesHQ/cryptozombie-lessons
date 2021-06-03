---
title: Więcej o zakresie widoczności funkcji
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode:
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

        // edit function definition below
        function _createZombie(string memory _name, uint _dna) private {
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
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        _createZombie("NoName", newDna);
        }

        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

**Kod z naszej poprzedniej lekcji ma błąd!**

Jeśli go skompilujesz, kompilator poinformuje Cię o błędzie.

Problemem jest próba wywołania funkcji `_createZombie` wewnątrz `ZombieFeeding`, bo `_createZombie` jest funkcją prywatną</code> ` dla <code>ZombieFactory`. Oznacza to, że żaden kontrakt, który dziedziczy z `ZombieFactory` nie może uzyskać do niej dostępu.

## Internal oraz External

Oprócz `public` i `private`, Solidity ma dwa dodatkowe typy określające dostęp do funkcji: `internal` i `external`.

`internal` jest tym samym co `private`, z wyjątkiem tego, że umożliwia dostęp do kontraktów dziedziczących po tym kontrakcie. **(Hmm, tego właśnie tutaj potrzebujemy!)**.

`external` jest podobne do `public`, z wyjątkiem, że funkcje te mogą zostać wywołane TYLKO poza kontraktem — nie mogą być wywołane poprzez inne funkcje wewnątrz kontraktu. Będziemy później mówić o tym, dlaczego warto czasem użyć `external` vs `public`.

Przy deklarowaniu funkcji `internal` lub `external`, składnia wygląda tak samo jak przy `private` i `public`:

    contract Sandwich {
      uint private sandwichesEaten = 0;
    
      function eat() internal {
        sandwichesEaten++;
      }
    }
    
    contract BLT is Sandwich {
      uint private baconSandwichesEaten = 0;
    
      function eatWithBacon() public returns (string memory) {
        baconSandwichesEaten++;
        // We can call this here because it's internal
        eat();
      }
    }
    

# Wypróbujmy zatem

1. Zmień funkcję `_createZombie()` z `private` na `internal`, aby nasze pozostałe kontrakty mogły mieć do niej dostęp.
    
    Już skierowaliśmy Cię do właściwej zakładki, `zombiefactory.sol`.