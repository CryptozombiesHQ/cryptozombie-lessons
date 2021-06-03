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
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
        }

        function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerZombieCount[_owner]);
        // Start here
        return result;
        }

        }
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

        KittyInterface kittyContract;

        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }

        function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
        }

        function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
        newDna = newDna - newDna % 100 + 99;
        }
        _createZombie("NoName", newDna);
        _triggerCooldown(myZombie);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

        }
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

        function _createZombie(string memory _name, uint _dna) internal {
        uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
      "ownable.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        /**
        * @title Ownable
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
        address private _owner;

        event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
        );

        /**
        * @dev The Ownable constructor sets the original `owner` of the contract to the sender
        * account.
        */
        constructor() internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
        }

        /**
        * @return the address of the owner.
        */
        function owner() public view returns(address) {
        return _owner;
        }

        /**
        * @dev Throws if called by any account other than the owner.
        */
        modifier onlyOwner() {
        require(isOwner());
        _;
        }

        /**
        * @return true if `msg.sender` is the owner of the contract.
        */
        function isOwner() public view returns(bool) {
        return msg.sender == _owner;
        }

        /**
        * @dev Allows the current owner to relinquish control of the contract.
        * @notice Renouncing to ownership will leave the contract without an owner.
        * It will not be possible to call the functions with the `onlyOwner`
        * modifier anymore.
        */
        function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
        }

        /**
        * @dev Allows the current owner to transfer control of the contract to a newOwner.
        * @param newOwner The address to transfer ownership to.
        */
        function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
        }

        /**
        * @dev Transfers control of the contract to a newOwner.
        * @param newOwner The address to transfer ownership to.
        */
        function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
        }
        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./zombiefeeding.sol";
      contract ZombieHelper is ZombieFeeding {
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[] memory) { uint[] memory result = new uint[](ownerZombieCount[_owner]); uint counter = 0; for (uint i = 0; i < zombies.length; i++) { if (zombieToOwner[i] == _owner) { result[counter] = i; counter++; } } return result; }
      }
---

W poprzednim rozdziale, wspomnieliśmy, że czasami będziesz chciał użyć pętli `for`, aby zbudować zawartość tablicy w funkcji, zamiast po prostu zapisywać tą tablicę do przechowania.

Spójrzmy dlaczego.

Dla naszej funkcji `getZombiesByOwner`, naiwnym byłoby zapisanie `mapowania` właścicieli do armii Zombi w kontrakcie `ZombieFactory`:

    mapping (address => uint[]) public ownerToZombies
    

Wtedy za każdym razem, gdy tworzymy nowego Zombiaka, użyjemy po prostu `ownerToZombies[owner].push(zombieId)`, aby dodać go do tablicy Zombiaków właściciela. I `getZombiesByOwner` byłaby bardzo prostą funkcją:

    function getZombiesByOwner(address _owner) external view returns (uint[] memory) {
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

    function getEvens() pure external returns(uint[] memory) {
      uint[] memory evens = new uint[](5);
      // Keep track of the index in the new array:
      uint counter = 0;
      // Iterate 1 through 10 with a for loop:
      for (uint i = 1; i <= 10; i++) {
        // If `i` is even...
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

Zakończmy funkcję `getZombiesByOwner` poprzez napisanie pętli `for`, która iteruje po wszystkich Zombiakach w naszej DApp, porównując ich właściciela w celu dopasowania i włożenia ich do tablicy `result` przed zwróceniem jej.

1. Zadeklaruj `counter` typu `uint` i ustaw równe `0`. Użyjemy tej zmiennej, aby śledzić indeks tablicy `result`.

2. Zadeklaruj pętlę `for`, która rozpoczyna się od `uint i = 0` i przechodzi przez `i < zombies.length`. To będzie iterować przez wszystkie Zombi w naszej tablicy.

3. Wewnątrz pętli `for`, utwórz wyrażenie `if`, które sprawdza czy `zombieToOwner[i]` jest równe `_owner`. Będzie to porównywać dwa adresy w celu sprawdzenia dopasowania.

4. Wewnątrz wyrażenia `if`:
    
    1. Dodaj ID Zombiaka do tablicy `result` przez ustawienie `result[counter]` równe `i`.
    2. Inkrementuj `counter` o 1 (spójrz na przykład pętli `for` powyżej).

To wszystko — funkcja zwróci teraz wszystkie Zombi, które są własnością `_owner` nie pożerając przy tym żadnej ilości gazu.