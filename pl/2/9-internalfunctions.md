---
title: Więcej o widoczności funkcji
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode:
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
        
        // edytuj poniższą definicję funkcji
        function _createZombie(string _name, uint _dna) private {
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
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
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
      pragma solidity ^0.4.19;
      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string _name, uint _dna) internal { uint id = zombies.push(Zombie(_name, _dna)) - 1; zombieToOwner[id] = msg.sender; ownerZombieCount[msg.sender]++; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { require(ownerZombieCount[msg.sender] == 0); uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
**Kod z naszej poprzedniej lekcji ma błąd!**

Jeśli go skompilujesz, kompilator poinformuje Cię o błędzie.

Problemem jest próba wywołania funkcji `_createZombie` wewnątrz `ZombieFeeding`, bo `_createZombie` jest funkcją prywatną</code> ` dla <code>ZombieFactory`. Oznacza to, że żaden kontrakt, który dziedziczy z `ZombieFactory` nie może uzyskać do niego dostępu.

## Internal oraz External

Oprócz `public` i `private`, Solidity ma dwa dodatkowe typy określające dostęp do funkcji: `internal` i `external`.

`internal` jest tym samym co `private`, z wyjątkiem tego, że umożliwia dostęp do kontraktów dziedziczących po tym kontrakcie. **(Hmm, tego właśnie tutaj potrzebujemy!)**.

`external` jest podobne do `public`, z wyjątkiem, że funkcje te mogą zostać wywołane TYLKO poza kontraktem — nie mogą być wywołane poprzez inne funkcje wewnątrz kontraktu. Będziemy później mówić o tym, dlaczego warto czasem użyć `external` vs `public`.

Do deklarowania funkcji `internal` lub `external`, składnia wygląda tak samo jak przy `private` i `public`:

    contract Sandwich {
      uint private sandwichesEaten = 0;
    
      function eat() internal {
        sandwichesEaten++;
      }
    }
    
    contract BLT is Sandwich {
      uint private baconSandwichesEaten = 0;
    
      function eatWithBacon() public returns (string) {
        baconSandwichesEaten++;
        // Możemy wywołać ją tutaj, bo jest oznaczona jako internal
        eat();
      }
    }
    

# Wypróbujmy zatem

1. Zmień `_createZombie()` z `private` na `internal` więc nasze pozostałe kontrakty będą miały do niej dostęp.
    
    We've already focused you back to the proper tab, `zombiefactory.sol`.