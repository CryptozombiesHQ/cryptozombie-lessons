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

        // Modify function definition here:
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        // Add an if statement here
        _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        // And modify function call here:
        feedAndMultiply(_zombieId, kittyDna);
        }

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
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
        }

        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d; KittyInterface kittyContract = KittyInterface(ckAddress);
      function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---

Logika naszej funkcji jest gotowa... lecz dodajmy bonusową cechę.

Zróbmy, aby Zombi stworzone z kotków miały jakąś unikalną cechę, która pokaże nam, że są one koto-Zombiakami.

Aby to zrobić, możemy dodać specjalny kod kotka w DNA Zombiaka.

Jeśli spojrzymy do lekcji 1, to widać, że używamy tylko pierwszych 12 cyfr z naszego 16-to cyfrowego DNA do określenia wyglądu Zombi. Więc wykorzystajmy ostatnie dwie nieużywane cyfry do obsługi "specjalnej" charakterystyki.

Powiemy, że koto-Zombi mają `99` jako ostatnie cyfry DNA (bo koty mają 9 żyć). Tak więc w naszym kodzie, mówimy `if` (jeśli) Zombiak pochodzi od kotka, ustaw ostatnie dwie cyfry DNA na `99`.

## Wyrażenia if

If statements in Solidity look just like JavaScript:

    function eatBLT(string memory sandwich) public {
      // Remember with strings, we have to compare their keccak256 hashes
      // to check equality
      if (keccak256(abi.encodePacked(sandwich)) == keccak256(abi.encodePacked("BLT"))) {
        eat();
      }
    }
    

# Wypróbujmy zatem

Zaimplementujmy geny kota w kodzie Zombi.

1. First, let's change the function definition for `feedAndMultiply` so it takes a 3rd argument: a `string` named `_species` which we'll store in `memory`.

2. Next, after we calculate the new zombie's DNA, let's add an `if` statement comparing the `keccak256` hashes of `_species` and the string `"kitty"`. We can't directly pass strings to `keccak256`. Instead, we will pass `abi.encodePacked(_species)` as an argument on the left side and `abi.encodePacked("kitty")` as an argument on the right side.

3. Wewnatrz `if'a`, chcemy zamienić ostatnie 2 cyfry DNA na `99`. Jedyną drogą, aby to wykonać jest użycie następującej operacji: `newDna = newDna - newDna % 100 + 99;`.
    
    > Wyjaśnienie: Załóżmy że `newDna` jest równe `334455`. Wtedy, `newDna % 100` jest `55`, więc `newDna - newDna % 100` jest `334400`. Na końcu dodajemy `99` aby otrzymać `334499`.

4. Jeszcze musimy zmienić wywołanie funkcji wewnątrz `feedOnKitty`. Kiedy wywołuje `feedAndMultiply`, dodaj na końcu parametr `"kitty"`.