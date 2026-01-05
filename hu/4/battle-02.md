---
title: Véletlenszámok
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          // Kezdj itt
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

      contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        }
      }

---

Nagyszerű! Most találjuk ki a csata logikát.

Minden jó játék valamilyen szintű véletlenszerűséget igényel. Szóval hogyan generálunk véletlenszámokat a Solidity-ben?

Az igazság az, hogy nem tudod. Vagy legalábbis nem tudod biztonságosan.

Nézzük meg, miért.

## Véletlenszám generálás `keccak256`-tal

A legjobb véletlenszerűségi forrás, amink van a Solidity-ben, a `keccak256` hash függvény.

Valami ilyesmit tehetnénk egy véletlenszám generálásához:

```
// Generálj egy véletlenszámot 1 és 100 között:
uint randNonce = 0;
uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
randNonce++;
uint random2 = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
```

Ez azt tenné, hogy veszi a `now` időbélyegét, a `msg.sender`-t, és egy növekvő `nonce`-ot (egy szám, amelyet csak egyszer használunk, így nem futtatjuk ugyanazt a hash függvényt ugyanazokkal a bemeneti paraméterekkel kétszer).

Ezután "csomagolja" a bemeneteket, és `keccak`-ot használ, hogy véletlenszerű hash-té alakítsa őket. Ezután konvertálja ezt a hash-t `uint`-té, majd `% 100`-at használ, hogy csak az utolsó 2 számjegyet vegye. Ez egy teljesen véletlenszerű számot ad 0 és 99 között.

### Ez a módszer sebezhető egy becstelen csomópont támadásával

Az Ethereumon, amikor meghívsz egy függvényt egy szerződésen, azt egy **_tranzakcióként_** közvetíted a hálózat egy vagy több csomópontjára. A hálózat csomópontjai ezután összegyűjtenek egy csomó tranzakciót, megpróbálják elsőként megoldani egy számítási szempontból intenzív matematikai problémát "Proof of Work"-ként, majd közzéteszik azt a tranzakciócsoportot a Proof of Work (PoW) mellett egy **_blokkként_** a hálózat többi részének.

Miután egy csomópont megoldotta a PoW-t, a többi csomópont abbahagyja a PoW megoldását, ellenőrzi, hogy a másik csomópont tranzakciólistája érvényes-e, majd elfogadja a blokkot, és továbblép a következő blokk megoldására.

**Ez sebezhetővé teszi a véletlenszám függvényünket.**

Tegyük fel, hogy volt egy pénzfeldobós szerződésünk — fejnél megduplázod a pénzed, írásnál mindent elveszítesz. Tegyük fel, hogy a fenti véletlenszám függvényt használta a fej vagy írás meghatározásához. (`random >= 50` fej, `random < 50` írás).

Ha én futtatnék egy csomópontot, közzétehetnék egy tranzakciót **csak a saját csomópontomra**, és nem osztanám meg. Ezután futtathatnám a pénzfeldobó függvényt, hogy lássam, nyertem-e — és ha vesztettem, úgy dönthetnék, hogy nem tartalmazom azt a tranzakciót a következő blokkban, amit megoldok. Ezt korlátlanul folytathatnám, amíg végül megnyerném a pénzfeldobást és megoldanám a következő blokkot, és profitálnék.

## Szóval hogyan generálunk biztonságosan véletlenszámokat az Ethereumon?

Mivel a blokklánc teljes tartalma minden résztvevő számára látható, ez egy nehéz probléma, és megoldása túlmutat ezen az oktatóanyagon. Olvashatsz <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>ezt a StackOverflow szálat</a> néhány ötletért. Egy ötlet lenne egy **_orákulum_** használata, hogy hozzáférjünk egy véletlenszám függvényhez az Ethereum blokkláncon kívülről.

Természetesen, mivel tízezer Ethereum csomópont versenyezik a hálózaton a következő blokk megoldásáért, az esélyem, hogy megoldom a következő blokkot, rendkívül alacsony. Sok időt vagy számítási erőforrást venne igénybe, hogy ezt profitálisan kihasználjam — de ha a jutalom elég magas lenne (például ha $100,000,000-t fogadhatnék a pénzfeldobó függvényre), megérné nekem a támadás.

Tehát bár ez a véletlenszám generálás NEM biztonságos az Ethereumon, a gyakorlatban, hacsak a véletlenszám függvényünkön nincs sok pénz a tét, a játékod felhasználói valószínűleg nem rendelkeznek elég erőforrással a támadáshoz.

Mivel ebben az oktatóanyagban csak egy egyszerű játékot építünk bemutató célokra, és nincs valódi pénz a tét, elfogadjuk a kompromisszumokat egy olyan véletlenszám generátor használatával, amely egyszerűen implementálható, tudva, hogy nem teljesen biztonságos.

Egy jövőbeli leckében foglalkozhatunk az **_orákulumok_** használatával (egy biztonságos módszer adatok behúzására az Ethereumon kívülről) biztonságos véletlenszámok generálásához a blokkláncon kívülről.

## Tedd próbára

Implementáljunk egy véletlenszám függvényt, amelyet használhatunk a csaták kimenetének meghatározásához, még akkor is, ha nem teljesen biztonságos a támadástól.

1. Adj a szerződésünknek egy `randNonce` nevű `uint`-ot, és állítsd `0`-ra.

2. Hozz létre egy `randMod` (random-modulus) nevű függvényt. Ez egy `internal` függvény lesz, amely egy `_modulus` nevű `uint`-ot vesz, és `uint`-ot ad vissza.

3. A függvény először növelje a `randNonce`-ot (a `randNonce++` szintaxist használva).

4. Végül (egy kódsorban) számítsa ki a `keccak256` hash `uint` típusú konverzióját az `abi.encodePacked(now,msg.sender,randNonce)`-ből — és adja vissza azt az értéket `% _modulus`. (Húha! Ez hosszú volt. Ha nem követted, csak nézd meg a fenti példát, ahol véletlenszámot generáltunk — a logika nagyon hasonló).
