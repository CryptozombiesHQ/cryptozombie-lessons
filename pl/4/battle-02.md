---
title: Liczby Losowe
actions:
  - 'sprawdźOdpowiedź'
  - 'wskazówki'
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiehelper.sol";
        
        contract ZombieBattle is ZombieHelper {
        // Rozpocznij tutaj
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefeeding.sol";
        
        contract ZombieHelper is ZombieFeeding {
        
        uint levelUpFee = 0.001 ether;
        
        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
        }
        
        function withdraw() external onlyOwner {
        owner.transfer(this.balance);
        }
        
        function setLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
        }
        
        function levelUp(uint _zombieId) external payable {
        require(msg.value == levelUpFee);
        zombies[_zombieId].level++;
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
        uint counter = 0;
        for (uint i = 0; i < zombies.length; i++) {
        if (zombieToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
        }
        }
        return result;
        }
        
        }
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
        
        KittyInterface kittyContract;
        
        function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
        }
        
        function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
        }
        
        function _isReady(Zombie storage _zombie) internal view returns (bool) {
        return (_zombie.readyTime <= now);
        }
        
        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        require(_isReady(myZombie));
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(_species) == keccak256("kitty")) {
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
      import "./zombiehelper.sol";
      contract ZombieBattle is ZombieHelper { uint randNonce = 0;
      function randMod(uint _modulus) internal returns(uint) { randNonce++; return uint(keccak256(now, msg.sender, randNonce)) % _modulus; } }
---
Świetnie! Teraz zagłębimy się w logikę walki.

Wszystkie dobre gry wymagają jakiegoś poziomu losowości. Więc jak generujemy liczby losowe w Solidity?

Prawdziwa odpowiedź brzmi: nie możesz. Cóż, przynajmniej nie możesz tego zrobić bezpiecznie.

Spójrzmy dlaczego.

## Generowanie liczby losowej poprzez `keccak256`

Najlepsze źródło losowości które mamy w Solidity to funkcja haszująca `keccak256`.

Możemy użyć poniższy przykładowy kod to wygenerowania liczby losowej:

    // Generuje liczbę losową w przedziale od 1 do 100:
    uint randNonce = 0;
    uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
    randNonce++;
    uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
    

Kod wykorzystuje timestamp `now`, zmienne `msg.sender` oraz inkrementowaną `nonce` (liczba ta jest zawsze używana tylko raz, dlatego nie możemy uruchomić tej samej funkcji haszującej z tymi samymi parametrami dwukrotnie).

Następnie funkcja `keccak` konwertuje te parametry na losowy hasz, w kolejnym kroku hash zamieniany jest na zmienną typu `uint`, potem przy użyciu `% 100` wybierane są dwie ostatnie cyfry liczby. To daje nam losową liczbę z przedziału od 1 do 100.

### Ta metoda jest podatna na atak przez nieuczciwy węzeł

W Ethereum wywołanie funkcji kontraktu, przekazujesz do węzła lub węzłów sieci jako ***transakcję***. Węzły zbierają transakcje oraz starają się rozwiązać problem matematyczny poprzez "Proof of Work", a następnie zapisują transakcje w ***bloku*** wraz z ich Proof of Work (PoW). Blok zostaje upubliczniony całej sieci.

Gdy jeden z węzłów rozwiązał PoW nowego bloku, inne węzły przestają próbować rozwiązać PoW, sprawdza on czy listy transakcji innych węzłów są prawidłowe, a następnie akceptuje blok i przechodzi do rozwiązywania następnego bloku.

**To sprawia, że nasze funkcje liczb losowych można oszukać.**

Wyobraźmy sobie, że mamy kontrakt rzutu monetą — gdy wypadnie orzeł twoje pieniądze się podwajają, a gdy wypadnie reszka to tracisz wszystko. Powiedzmy, że używa on powyższej funkcji liczb losowych do ustalenia czy wypadł orzeł czy reszka. (`random >= 50` to orzeł, `random < 50` to reszka).

Jeśli uruchomimy własny węzeł to możemy publikować transakcje **tylko na swoim węźle** nie udostępniając ich. Możemy wtedy uruchomić funkcję rzutu monetą i sprawdzić czy wygraliśmy i jeśli nie wygraliśmy to nie udostępniamy tej transakcji do kolejnego bloku. Możemy to robić nieskończenie dopóki nie wygramy rzutu monetą i kolejny blok nie zostanie zatwierdzony.

## Więc jak wygenerować bezpiecznie liczby losowe w Ethereum?

Ponieważ cała zawartość blockchain jest publiczna dla wszystkich, to jest to skomplikowany problem i jego rozwiązanie wykracza poza zakres tego samouczka. Dodatkowe informacje na ten temat możesz znaleźć w <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>tym wątku na StackOverflow</a>. Jednym z rozwiązań jest wykorzystanie ***oracle*** do dostępu do funkcji liczb losowych spoza blockchain'u Ethereum.

Oczywiście w sieci Ethereum w rywalizacji o rozwiązanie kolejnego bloku bierze udział aż około 10 tyś. węzłów. Nasze szanse na zatwierdzenie kolejnego bloku są bardzo niskie. Potrzebowalibyśmy mnóstwo czasu oraz dużej mocy obliczeniowej, aby mieć szanse na pomyślny atak. Natomiast jeśli w grę wchodzi wysoka nagroda (np. jeśli możemy wygrać 100 mln $), to będzie nam warto spróbować tego ataku.

So while this random number generation is NOT secure on Ethereum, in practice unless our random function has a lot of money on the line, the users of your game likely won't have enough resources to attack it.

Because we're just building a simple game for demo purposes in this tutorial and there's no real money on the line, we're going to accept the tradeoffs of using a random number generator that is simple to implement, knowing that it isn't totally secure.

In a future lesson, we may cover using ***oracles*** (a secure way to pull data in from outside of Ethereum) to generate secure random numbers from outside the blockchain.

## Put it to the test

Let's implement a random number function we can use to determine the outcome of our battles, even if it isn't totally secure from attack.

1. Give our contract a `uint` called `randNonce`, and set it equal to `0`.

2. Create a function called `randMod` (random-modulus). It will be an `internal` function that takes a `uint` named `_modulus`, and `returns` a `uint`.

3. The function should first increment `randNonce` (using the syntax `randNonce++`).

4. Finally, it should (in one line of code) calculate the `uint` typecast of the `keccak256` hash of `now`, `msg.sender`, and `randNonce` — and `return` that value `% _modulus`. (Whew! That was a mouthful. If you didn't follow that, just take a look at the example above where we generated a random number — the logic is very similar).