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
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
        // Start here
        }
      "zombiehelper.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
        }

        function withdraw() external onlyOwner {
        address payable _owner = address(uint160(owner()));
        _owner.transfer(address(this).balance);
        }

        function setLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
        }

        function levelUp(uint _zombieId) external payable {
        require(msg.value == levelUpFee);
        zombies[_zombieId].level++;
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

        function _isReady(Zombie storage _zombie) internal view returns (bool) {
        return (_zombie.readyTime <= now);
        }

        function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        require(_isReady(myZombie));
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
      import "./zombiehelper.sol";
      contract ZombieAttack is ZombieHelper { uint randNonce = 0;
      function randMod(uint _modulus) internal returns(uint) { randNonce++; return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus; } }
---

Świetnie! Teraz zagłębimy się w logikę walki.

Wszystkie dobre gry wymagają jakiegoś poziomu losowości. Więc jak generujemy liczby losowe w Solidity?

Prawdziwa odpowiedź brzmi: nie możesz. Cóż, przynajmniej nie możesz tego zrobić bezpiecznie.

Spójrzmy dlaczego.

## Generowanie liczby losowej poprzez `keccak256`

Najlepsze źródło losowości które mamy w Solidity to funkcja haszująca `keccak256`.

Możemy użyć poniższy przykładowy kod to wygenerowania liczby losowej:

    // Generate a random number between 1 and 100:
    uint randNonce = 0;
    uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
    randNonce++;
    uint random2 = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
    

Kod wykorzystuje timestamp `now`, zmienne `msg.sender` oraz inkrementowaną `nonce` (liczba ta jest zawsze używana tylko raz, dlatego nie możemy uruchomić tej samej funkcji haszującej z tymi samymi parametrami dwukrotnie).

It would then "pack" the inputs and use `keccak` to convert them to a random hash. Next, it would convert that hash to a `uint`, and then use `% 100` to take only the last 2 digits. This will give us a totally random number between 0 and 99.

### Ta metoda jest podatna na atak przez nieuczciwy węzeł

W Ethereum wywołanie funkcji kontraktu, przekazujesz do węzła lub węzłów sieci jako ***transakcję***. Węzły zbierają transakcje oraz starają się rozwiązać problem matematyczny poprzez "Proof of Work", a następnie zapisują transakcje w ***bloku*** wraz z ich Proof of Work (PoW). Blok zostaje upubliczniony całej sieci.

Gdy jeden z węzłów rozwiązał PoW nowego bloku, inne węzły przestają próbować rozwiązać PoW, sprawdza on czy listy transakcji innych węzłów są prawidłowe, a następnie akceptuje blok i przechodzi do rozwiązywania następnego bloku.

**To sprawia, że nasze funkcje liczb losowych można oszukać.**

Wyobraźmy sobie, że mamy kontrakt rzutu monetą — gdy wypadnie orzeł twoje pieniądze się podwajają, a gdy wypadnie reszka to tracisz wszystko. Powiedzmy, że używa on powyższej funkcji liczb losowych do ustalenia czy wypadł orzeł czy reszka. (`random >= 50` to orzeł, `random < 50` to reszka).

Jeśli uruchomimy własny węzeł to możemy publikować transakcje **tylko na swoim węźle** nie udostępniając ich. Możemy wtedy uruchomić funkcję rzutu monetą i sprawdzić czy wygraliśmy i jeśli nie wygraliśmy to nie udostępniamy tej transakcji do kolejnego bloku. Możemy to robić nieskończenie dopóki nie wygramy rzutu monetą i kolejny blok nie zostanie zatwierdzony.

## Więc jak wygenerować bezpiecznie liczby losowe w Ethereum?

Ponieważ cała zawartość blockchain jest publiczna dla wszystkich, to jest to skomplikowany problem i jego rozwiązanie wykracza poza zakres tego samouczka. Dodatkowe informacje na ten temat możesz znaleźć w <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>tym wątku na StackOverflow</a>. Jednym z rozwiązań jest wykorzystanie ***oracle*** do dostępu do funkcji liczb losowych spoza blockchain'u Ethereum.

Oczywiście w sieci Ethereum w rywalizacji o rozwiązanie kolejnego bloku bierze udział aż około 10 tyś. węzłów. Nasze szanse na zatwierdzenie kolejnego bloku są bardzo niskie. Potrzebowalibyśmy mnóstwo czasu oraz dużej mocy obliczeniowej, aby mieć szanse na pomyślny atak. Natomiast jeśli w grę wchodzi wysoka nagroda (np. jeśli możemy wygrać 100 mln $), to będzie nam warto spróbować tego ataku.

Tak więc, generowanie liczb losowych nie jest bezpieczne na Ethereum. W praktyce dopóki w naszej grze nie chodzi o duże pieniądze. W naszej grze zakładamy że użytkownicy gry prawdopobnie nie będą grali o duże pieniądze.

Ponieważ tworzymy prostą grę dla samouczka oraz nie wchodzą w grę prawdziwe pieniądze będziemy wykorzystywać prosty generator liczb losowych, który jest prosty do implementacji. Wiedząc że nie jest on w pełni bezpieczny.

Przyszłe lekcje bedą obejmować wykorzystanie ***oracle*** (bezpieczny sposób na przekazywanie danych spoza Ethereum) do wygenerowania liczb losowych poza blockchan'em.

## Wypróbujmy zatem

Zaimplementujmy funkcję do generowania liczb losowej, dzięki której będziemy mogli określić wynik naszych bitew.

1. Zadeklaruj `uint`, nazwij jako `dnaDigits` i ustaw wartość `16`.

2. Utwórz funkcję o nazwie `randMod` (random-modulus). Będzie to funkcja `internal`, która jako parametr przyjmuje `uint` o nazwie `_modulus` oraz zwraca `uint`.

3. Funkcja powinna najpierw inkrementować `randNonce` (używając składni `randNonce++`).

4. Finally, it should (in one line of code) calculate the `uint` typecast of the `keccak256` hash of `abi.encodePacked(now,msg.sender,randNonce)` — and `return` that value `% _modulus`. ( Jeśli nie nadążasz, zerknij przykład z przykładu wyżej, gdzie generujemy liczbę losową, logika jest podobna).