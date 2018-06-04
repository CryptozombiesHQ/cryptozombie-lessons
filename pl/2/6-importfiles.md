---
title: Import
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
        // tutaj umieść instrukcję importu
        
        contract ZombieFeeding is ZombieFactory {
        
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
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefactory.sol";
      contract ZombieFeeding is ZombieFactory {
      }
---
Łał! Pewnie widzisz, że wyczyściliśmy kod po prawej i masz teraz zakładki na górze edytora. Dalej! Klikaj pomiędzy nimi aby wypróbować.

Nasz kod stawał się coraz dłuższy, więc podzieliliśmy go na kilka plików aby uczynić go łatwiej zarządzalnym. Jest to naturalny sposób w jaki radzimy sobie z długimi skryptami w projektach Solidity.

Kiedy masz kilka plików i chcesz zaimportować jeden plik do innego, Solidity używa słowa kluczowego `import`:

    import "./someothercontract.sol";
    
    contract newContract is SomeOtherContract {
    
    }
    

Więc jeśli mamy plik o nazwie `someothercontract.sol` w tym samym katalogu co nasz kontrakt (znaki `./` nam o tym mówią), to zostanie on zaimportowany przez kompilator.

# Wypróbujmy zatem

Teraz, kiedy mamy wielo-plikową strukturę, potrzebujemy użyć słówka `import` aby móc czytac zawartość innego pliku:

1. Zaimportuj `zombiefactory.sol` do naszego nowego pliku, `zombiefeeding.sol`.