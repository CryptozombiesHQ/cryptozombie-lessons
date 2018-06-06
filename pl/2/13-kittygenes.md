---
title: "Bonus: Geny Kotka"
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
        
        // Zmodyfikuj tutaj definicję funkcji:
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        // Tutaj dodaj wyrażenie if
        _createZombie("NoName", newDna);
        }
        
        function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        // A tu, zmodyfikuj wywołanie funkcji:
        feedAndMultiply(_zombieId, kittyDna);
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
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d; KittyInterface kittyContract = KittyInterface(ckAddress);
      function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(_species) == keccak256("kitty")) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---
Logika naszej funkcji jest gotowa... lecz dodajmy bonusową cechę.

Zróbmy, aby Zombi stworzone z kotków miały jakąś unikalną cechę, która pokaże nam, że są one koto-Zombiakami.

Aby to zrobić, możemy dodać specjalny kod kotka w DNA Zombiaka.

Jeśli spojrzymy do lekcji 1, to widać, że używamy tylko pierwszych 12 cyfr z naszego 16-to cyfrowego DNA do określenia wyglądu Zombi. Więc wykorzystajmy ostatnie dwie nieużywane cyfry do obsługi "specjalnej" charakterystyki.

Powiemy, że koto-Zombi mają `99` jako ostatnie cyfry DNA (bo koty mają 9 żyć). Tak więc w naszym kodzie, mówimy `if` (jeśli) Zombiak pochodzi od kotka, ustaw ostatnie dwie cyfry DNA na `99`.

## Wyrażenia if

Wyrażenia if w Solidity wyglądają jak w Javascripcie:

    function eatBLT(string sandwich) public {
      // Pamiętaj, że przy stringach porównujemy ich hasze keccak256
      // aby sprawdzić równość
      if (keccak256(sandwich) == keccak256("BLT")) {
        eat();
      }
    }
    

# Wypróbujmy zatem

Zaimplementujmy geny kota w kodzie Zombi.

1. First, let's change the function definition for `feedAndMultiply` so it takes a 3rd argument: a `string` named `_species`

2. Next, after we calculate the new zombie's DNA, let's add an `if` statement comparing the `keccak256` hashes of `_species` and the string `"kitty"`

3. Inside the `if` statement, we want to replace the last 2 digits of DNA with `99`. One way to do this is using the logic: `newDna = newDna - newDna % 100 + 99;`.
    
    > Explanation: Assume `newDna` is `334455`. Then `newDna % 100` is `55`, so `newDna - newDna % 100` is `334400`. Finally add `99` to get `334499`.

4. Lastly, we need to change the function call inside `feedOnKitty`. When it calls `feedAndMultiply`, add the parameter `"kitty"` to the end.