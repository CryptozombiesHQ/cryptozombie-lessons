---
title: DNA Zombi
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefactory.sol";
        
        contract ZombieFeeding is ZombieFactory {
        
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        // zacznij tutaj
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
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      }
---
Skończmy pisać funkcję `feedAndMultiply`.

Formuła do obliczania nowego DNA Zombi jest prosta: jest to po prostu średnia pomiędzy DNA Zombiaka i DNA ofiary.

Na przykład:

    function testDnaSplicing() public {
      uint zombieDna = 2222222222222222;
      uint targetDna = 4444444444444444;
      uint newZombieDna = (zombieDna + targetDna) / 2;
      // ^ będzie równe 3333333333333333
    }
    

Później możemy uczynić naszą formułę bardziej skomplikowaną, jeśli chcemy, np. dodać trochę losowości do nowego DNA Zombi. Lecz na razie utrzymamy to w prostocie - zawsze możemy do niego wrócić później.

# Wypróbujmy zatem

1. Najpierw musimy się upewnić czy `_targetDna` nie jest dłuższe niż 16 cyfr. Aby to zrobić, możemy ustawić `_targetDna` równe `_targetDna % dnaModulus` aby wziąć tylko ostatnie 16 cyfr.

2. Następnie nasza funkcja powinna deklarować `uint` o nazwie `newDna` i ustawić równe średniej z `myZombie` DNA oraz `_targetDna` (jak podano w przykładzie powyżej).
    
    > Uwaga: Możesz dostać się do właściwości `myZombie` używając `myZombie.name` i `myZombie.dna`

3. Kiedy mamy nowe DNA, wywołajmy `_createZombie`. Możesz zajrzeć do zakładki `zombiefactory.sol` jeśli nie pamiętasz jakich parametrów potrzebuje ta funkcja do wywołania. Note that it requires a name, so let's set our new zombie's name to `"NoName"` for now — we can write a function to change zombies' names later.

> Note: For you Solidity whizzes, you may notice a problem with our code here! Don't worry, we'll fix this in the next chapter ;)