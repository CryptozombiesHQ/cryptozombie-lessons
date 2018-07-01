---
title: Pętle For
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
requireLogin: prawda
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefeeding.sol";
        
        contract ZombieHelper is ZombieFeeding {
        
        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
        }
        
        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        zombies[_zombieId].name = _newName;
        }
        
        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        zombies[_zombieId].dna = _newDna;
        }
        
        function getZombiesByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerZombieCount[_owner]);
        // Zacznij tutaj
        return result;
        }
        
        }
      "zombiefeeding.sol": |
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
        
        KittyInterface kittyContract;
        
        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }
        
        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(_species) == keccak256("kitty")) {
        newDna = newDna - newDna % 100 + 99;
        }
        _createZombie("NoName", newDna);
        }
        
        function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        feedAndMultiply(_zombieId, kittyDna, "kitty");
        }
        
        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;
        
        import "./ownable.sol";
        
        contract ZombieFactory is Ownable {
        
        event NewZombie(uint zombieId, string name, uint dna);
        
        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        uint cooldownTime = 1 days;
        
        struct Zombie {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        }
        
        Zombie[] public zombies;
        
        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;
        
        function _createZombie(string _name, uint _dna) internal {
        uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
      "ownable.sol": |
        /**
        * @title Ownable
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
        address public owner;
        
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        
        /**
        * @dev The Ownable constructor sets the original `owner` of the contract to the sender
        * account.
        */
        function Ownable() public {
        owner = msg.sender;
        }
        
        
        /**
        * @dev Throws if called by any account other than the owner.
        */
        modifier onlyOwner() {
        require(msg.sender == owner);
        _;
        }
        
        
        /**
        * @dev Allows the current owner to transfer control of the contract to a newOwner.
        * @param newOwner The address to transfer ownership to.
        */
        function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[]) { uint[] memory result = new uint[](ownerZombieCount[_owner]); uint counter = 0; for (uint i = 0; i < zombies.length; i++) { if (zombieToOwner[i] == _owner) { result[counter] = i; counter++; } } return result; }
      }
---
W poprzednim rozdziale, wspomnieliśmy, że czasami będziesz chciał użyć pętli `for`, aby zbudować zawartość tablicy w funkcji, zamiast po prostu zapisywać tą tablicę do przechowania.

Spójrzmy dlaczego.

Dla naszej funkcji `getZombiesByOwner`, naiwnym byłoby przechowywać `mapowanie` właścicieli do armii Zombi w kontrakcie `ZombieFactory`:

    mapping (address => uint[]) public ownerToZombies
    

Wtedy za każdym razem, gdy tworzymy nowego Zombiaka, użyjemy po prostu `ownerToZombies[owner].push(zombieId)`, aby dodać go do tablicy Zombiaków właściciela. I `getZombiesByOwner` byłaby bardzo prostą funkcją:

    function getZombiesByOwner(address _owner) external view returns (uint[]) {
      return ownerToZombies[_owner];
    }
    

### Jaki jest problem z tym podejściem?

Podejście to jest kuszące, w swej prostocie. Ale przyjrzyjmy się co się dzieje, jeśli dodamy funkcję transferującą Zombi od jednego właściciela do drugiego (będziemy to chcieli na pewno dodać w późniejszej lekcji!).

Ta funkcja transferująca będzie potrzebowała: 1. Włożyć Zombiaka do tablicy `ownerToZombies` nowego właściciela, 2. Usunąć Zombi ze starej tablicy `ownerToZombies`, 3. Przesunąć Zombi w starej tablicy o jedną pozycję w górę, aby zniwelować lukę, a następnie 4. Zmniejszyć długość tablicy o 1.

Krok 3 byłby ekstremalnie kosztowny jeśli chodzi o gaz, ponieważ będziemy musieli zrobić zapis dla każdego Zombi, którego przeniesiemy. Jeśli właściciel ma 20 zombie i handluje od pierwszego, będziemy musieli zrobić 19 zapisów, aby utrzymać kolejność w tablicy.

Odkąd zapisywanie do pamięci jest jedną z najbardziej kosztownych operacji w Solidity, każde wywołanie tej funkcji transferującej będzie pożerało bardzo duże ilości gazu. I co gorsza, ilość gazu będzie się różniła za każdym jej wywołaniem, w zależności od tego jak wiele Zombiaków użytkownik ma w swojej armii i numeru Zombi, który zostanie poddany wymianie. Więc user nie będzie wiedział ile gazu zużyje.

> Uwaga: Oczywiście, możemy tylko przemieścić ostatniego Zombiaka w tablicy, aby wypełnić brakujący slot i zmniejszyć długość tablicy o jeden. Ale wtedy zmienilibyśmy kolejność naszej armii Zombi za każdym razem, gdy dokonywalibyśmy wymiany.

Odkąd funkcje `view` nie kosztują gazu gdy są wywołane zewnętrznie, możemy po prostu użyć pętli for w `getZombiesByOwner` aby iterować w całej tablicy Zombi i utworzyć tablicę, która należy do konkretnego właściciela. Wtedy nasza funkcja `transfer` będzie mniej kosztowna, ponieważ nie musimy zmieniać kolejności żadnych tablic w pamięci i to nieco mniej intuicyjne podejście jest ogólnie mniej kosztowne.

## Użycie pętli `for`

Składnia pętli `for` w Solidity jest podobna do tej w JavaScripcie.

Spójrzmy na przykład gdzie chcemy zrobić tablicę liczb parzystych:

    function getEvens() pure external returns(uint[]) {
      uint[] memory evens = new uint[](5);
      // Śledź indeks w nowej tablicy:
      uint counter = 0;
      // Iteruj od 1 do 10 za pomocą pętli for:
      for (uint i = 1; i <= 10; i++) {
        // Jeśli `i` jest parzyste...
        if (i % 2 == 0) {
          // Dodaj to do naszej tablicy
          evens[counter] = i;
          // Inkrementuj licznik do kolejnego pustego indeksu w `evens`:
          counter++;
        }
      }
      return evens;
    }
    

Ta funkcja zwróci tablicę z zawartością `[2, 4, 6, 8, 10]`.

## Wypróbujmy zatem

Zakończmy funkcję `getZombiesByOwner` poprzez napisanie pętli `for`, która iteruje po wszystkich Zombiakach w naszej DApp, porównując ich właściciela w celu dopasowania i włożenia ich do tablicy `result` przed zwróceniem.

1. Zadeklaruj `counter` typu `uint` i ustaw równe `0`. Użyjemy tej zmiennej, aby śledzić indeks tablicy `result`.

2. Zadeklaruj pętlę `for`, która rozpoczyna się od `uint i = 0` i przechodzi przez `i < zombies.length`. To będzie iterować wszystkie Zombi w naszej tablicy.

3. Wewnątrz pętli `for`, utwórz wyrażenie `if`, które sprawdza czy `zombieToOwner[i]`jest równe `_owner`. This will compare the two addresses to see if we have a match.

4. Inside the `if` statement:
    
    1. Add the zombie's ID to our `result` array by setting `result[counter]` equal to `i`.
    2. Increment `counter` by 1 (see the `for` loop example above).

That's it — the function will now return all the zombies owned by `_owner` without spending any gas.