---
title: For ciklusok
actions: ['checkAnswer', 'hints']
requireLogin: true
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
            // Kezdj itt
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
---

Az előző fejezetben említettük, hogy néha szeretnéd egy `for` ciklust használni egy tömb tartalmának felépítéséhez egy függvényben, ahelyett, hogy egyszerűen elmentenéd azt a tömböt a tárolóba.

Nézzük meg, miért.

A `getZombiesByOwner` függvényünkhöz egy naiv implementáció lenne, ha tárolnánk egy `mapping`-ot a tulajdonosokról a zombiseregekre a `ZombieFactory` szerződésben:

```
mapping (address => uint[]) public ownerToZombies
```

Aztán minden alkalommal, amikor új zombit hozunk létre, egyszerűen használnánk az `ownerToZombies[owner].push(zombieId)`-t, hogy hozzáadjuk a tulajdonos zombi tömbjéhez. És a `getZombiesByOwner` egy nagyon egyszerű függvény lenne:

```
function getZombiesByOwner(address _owner) external view returns (uint[] memory) {
  return ownerToZombies[_owner];
}
```

### A probléma ezzel a megközelítéssel

Ez a megközelítés vonzó az egyszerűsége miatt. De nézzük meg, mi történik, ha később hozzáadunk egy függvényt, amely átruház egy zombit egyik tulajdonostól a másikhoz (amit biztosan hozzá akarunk adni egy későbbi leckében!).

Az átruházási függvénynek:
1. Hozzá kell adnia a zombit az új tulajdonos `ownerToZombies` tömbjéhez,
2. El kell távolítania a zombit a régi tulajdonos `ownerToZombies` tömbjéből,
3. Fel kell tolnia minden zombit a régi tulajdonos tömbben egy hellyel, hogy kitöltse a lyukat, és aztán
4. Csökkentenie kell a tömb hosszát 1-gyel.

A 3. lépés rendkívül drága lenne gáz szempontjából, mivel minden zombihoz írni kellene, amelynek a pozícióját eltoljuk. Ha egy tulajdonosnak 20 zombija van, és eladja az elsőt, 19 írást kellene végeznünk a tömb sorrendjének fenntartásához.

Mivel a tárolóba írás a Solidity egyik legdrágább művelete, ennek az átruházási függvénynek minden hívása rendkívül drága lenne gáz szempontjából. És ami rosszabb, minden alkalommal más mennyiségű gázba kerülne, attól függően, hogy hány zombija van a felhasználónak a seregében, és hogy a kereskedett zombi melyik indexen van. Tehát a felhasználó nem tudná, mennyi gázt kell küldenie.

> Megjegyzés: Természetesen csak áthelyezhetnénk a tömb utolsó zombiját, hogy kitöltsük a hiányzó helyet, és csökkenthetnénk a tömb hosszát eggyel. De akkor minden alkalommal megváltoztatnánk a zombiseregünk sorrendjét, amikor kereskedünk.

Mivel a `view` függvények nem kerülnek gázba, amikor külsőleg hívják meg őket, egyszerűen használhatunk egy for-ciklust a `getZombiesByOwner`-ben, hogy végigiteráljuk a teljes zombi tömböt, és felépítsünk egy tömböt azokkal a zombikkal, amelyek ehhez a konkrét tulajdonoshoz tartoznak. Aztán az átruházási függvényünk sokkal olcsóbb lesz, mivel nem kell átrendeznünk semmilyen tömböt a tárolóban, és valamelyest ellentmondásos módon ez a megközelítés összességében olcsóbb.

## `For` ciklusok használata

A `for` ciklusok szintaxisa a Solidity-ben hasonló a JavaScript-hez.

Nézzünk meg egy példát, ahol páros számokból szeretnénk egy tömböt készíteni:

```
function getEvens() pure external returns(uint[] memory) {
  uint[] memory evens = new uint[](5);
  // Kövesd nyomon az indexet az új tömbben:
  uint counter = 0;
  // Iterálj 1-től 10-ig egy for ciklussal:
  for (uint i = 1; i <= 10; i++) {
    // Ha az `i` páros...
    if (i % 2 == 0) {
      // Add hozzá a tömbünkhöz
      evens[counter] = i;
      // Növeld a számlálót a következő üres indexre az `evens`-ben:
      counter++;
    }
  }
  return evens;
}
```

Ez a függvény egy `[2, 4, 6, 8, 10]` tartalmú tömböt ad vissza.

## Tegyük próbára

Fejezzük be a `getZombiesByOwner` függvényünket egy `for` ciklus írásával, amely végigiterál az összes zombin a DApp-unkban, összehasonlítja a tulajdonosukat, hogy lássuk, van-e egyezés, és hozzáadja őket a `result` tömbünkhöz, mielőtt visszaadná.

1. Deklarálj egy `counter` nevű `uint`-ot, és állítsd be `0`-ra. Ezt a változót használjuk a `result` tömbünk indexének nyomon követéséhez.

2. Deklarálj egy `for` ciklust, amely `uint i = 0`-tól kezdődik, és `i < zombies.length`-ig megy. Ez végigiterál minden zombin a tömbben.

3. A `for` cikluson belül készíts egy `if` állítást, amely ellenőrzi, hogy a `zombieToOwner[i]` egyenlő-e a `_owner`-rel. Ez összehasonlítja a két címet, hogy lássuk, van-e egyezés.

4. Az `if` állításon belül:
   1. Add hozzá a zombi ID-ját a `result` tömbünkhöz azáltal, hogy beállítod a `result[counter]`-t `i`-re.
   2. Növeld a `counter`-t 1-gyel (lásd a fenti `for` ciklus példát).

Ennyi — a függvény most visszaadja az összes zombit, amelyet a `_owner` birtokol, gáz költség nélkül.
