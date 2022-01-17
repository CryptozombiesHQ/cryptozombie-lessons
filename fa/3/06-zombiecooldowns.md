---
title: زمان استراحت زامبی
actions: ['بررسی پاسخ', 'راهنمایی']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

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

          // 1. Define `_triggerCooldown` function here

          // 2. Define `_isReady` function here

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
        pragma solidity ^0.4.25;

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
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
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
        pragma solidity ^0.4.25;

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
      pragma solidity ^0.4.25;

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

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
---
<div dir="rtl">

خب حالا که متغیر `readyTime` رو در ساختار `Zombie` داریم، بریم سراغ `zombiefeeding.sol` و تایمر زمان توقف رو پیاده کنیم.

می‌خوایم `feedAndMultiply`  رو تغییر بدیم:

۱. با غذاخوردن، تایمر شروع می‌شه.

۲. زامبی‌ها نمی‌تونن در زمان استراحت کیتی‌ها رو بخورن.

این باعث می‌شه که زامبی‌ها هر زمانی نتونن گربه‌ها رو بخورن و تکثیر شن. در آینده وقتی جنگ هم به عملیات اضافه بشه، طوری پیاده‌سازی می‌کنیم که حمله به زامبی‌های دیگر به این زمان استراحت وابسته باشه.

اول، می‌خوایم یه تابع کمکی تعریف کنیم که توسط اون، `readyTime` زامبی رو تنظیم و چک کنیم.

## ارسال ساختار به عنوان آرگومان

می‌تونید اشاره‌گر حافظه رو به عنوان آرگومان یک تابع `private` یا`internal`، به یک ساختار بفرستید.  مثلا برای ارسال ساختار `Zombie` به تابع، سینتکس به این صورت می‌شه:
</div>

```
function _doStuff(Zombie storage _zombie) internal {
  // do stuff with _zombie
}
```
<div dir="rtl">

از این طریق می‌تونیم به جای ارسال متغیرهای زامبی ارجاع بدیم به ساختار زامبی.

## دست به کد شو


۱. با تعریف تابع `_triggerCooldown` شروع کنید. یک آرگومان به عنوان `_zombie` می‌گیره، اشاره‌گر `Zombie storage`. این تابع باید `internal(داخلی)` باشه.

۲. داخل تابع مقدار `_zombie.readyTime` رو `uint32(زمان حال + زمان استراحت)` بذارید.

۳. سپس، یک تابع به نام `_isReady` بنویسید. این تابع هم آرگومان `Zombie storage` رو با اسم `_zombie` دریافت می‌کنه. تابع از نوع `internal view` است و `bool` برمی‌گردونه.

۴. تابع باید `(_zombie.readyTime <= now)` رو برگردونه، یعنی `true` یا `false`برمی‌گردونه. این تابع نشون می‌ده که زمان کافی از آخرین بار که زامبی تغذیه کرده گذشته یا نه.

</div>
