---
title: قراردادهای مالکیت‌پذیر
actions: ['بررسی پاسخ', 'راهنمایی']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

        // 1. Import here

        // 2. Inherit here:
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
                emit NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
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

          function setKittyContractAddress(address _address) external {
            kittyContract = KittyInterface(_address);
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

      import "./ownable.sol";

      contract ZombieFactory is Ownable {

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
              emit NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              randDna = randDna - randDna % 100;
              _createZombie(_name, randDna);
          }

      }
---
<div dir="rtl">

باگ امنیتی مرحله قبل رو تشخیص دادین؟

تابع `setKittyContractAddress` به‌صورت `external` تعریف شد پس یعنی هر کسی می‌تونه صداش بزنه! و این یعنی هر کسی که تابع رو صدا بزنه می‌تونه آدرس قرارداد CryptoKitties رو تغییر بده و اپلیکیشن رو برای تمام کاربران از بین ببره.

ما می‌خوایم توانایی به‌روزرسانی آدرس قراردادمون رو داشته باشیم، اما نمی‌خوایم هر کسی بتونه آدرس رو به‌روز‌رسانی کنه.

برای مدیریت این موارد، قابلیت تعیین مالکیت اضافه شده، به این معنی که برای قراردادها می‌شه مالک تعریف کرد که دسترسی‌های خاصی داره.

## قرارداد `Ownable` از OpenZeppelin

در ادامه قرارداد `Ownable` رو از کتابخونه سالیدیتی **_OpenZeppelin_** می‌بینید. OpenZeppelin یک کتابخونه برای تامین امنیت قراردادهاست که مورد تایید جامعه بلاکچین اتریومه که می‌تونین در دپ خودتون ازش استفاده کنید. بعد از اتمام این درس پیشنهاد می‌شه که یه سری به وبسایتشون بزنید تا اطلاعات بیشتری درباره‌ش کسب کنین.

یه نگاهی به قرارداد زیر بندازین، مواردی رو می‌بینید که هنوز یاد نگرفتین، اما نگران نباشید در ادامه درباره‌شون صحبت می‌کنیم.
</div>

```
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
```
<div dir="rtl">

بعضی از چیزایی که قبلا ندیدیم:
- سازنده‌ها (Constructors): `constructor()` یک **_سازنده_** است، یک تابع اختیاری خاص. فقط یک بار اجرا می‌شه، زمانی که قرارداد برای اولین بار ساخته شد.
- متغیرهای تابع(Function Modifiers): تغییردهنده‌ها(Modifiers) یه جورایی نیمه‌تابع هستند که برای تغییر توابع دیگر استفاده می‌شن، معمولا برای اینکه یک‌سری پیش‌نیازها رو قبل از اجرا چک کنن. در اینجا، `modifier onlyOwner()` برای محدودکردن دسترسی استفاده می‌شه پس **فقط مالک** قرارداد می‌تونه این تابع رو اجرا کنه. بعدا بیشتر درباره تغییردهنده‌ها و این علامت عجیب `_;` صحبت می‌کنیم.
- کلمه کلیدی `indexed` : فعلا بهش نیاز نداریم، نگرانش نباشید.
پس اساسا قرارداد `Ownable` موارد زیر رو انجام می‌ده:


۱. زمانی که یک قرارداد ایجاد می‌شه، سازنده‌ش، `owner` (مالک) رو برابر `msg.sender`(کسی که قرارداد رو دیپلوی می‌کنه)قرار می‌ده.

۲. تغییردهنده رو اضافه می‌کنه، که می‌تونه دسترسی به توابع خاصی رو به `مالک` محدود کنه.

۳. به شما اجازه می‌ده قرارداد رو به مالک جدید منتقل کنید.

قرارداد یکی از نیازمندی‌های اصلی قراردادهاست به همین دلیل اکثر دپ‌های سالیدیتی این قرارداد رو کپی می‌کنند.

ما هم چون می‌خوایم `setKittyContractAddress` رو محدود کنیم به `onlyOwner`، همین کار رو برای قراردادمون می‌خوایم انجام بدیم.

## دست به کد شو

ما کد قرارداد `Ownable` رو در یک فایل جدید به اسم `ownable.sol` کپی کردیم، حالا باید کاری کنیم که `ZombieFactory` اون رو به ارث ببره.

۱. کد رو طوری تغییر بدین که محتوای `ownable.sol` رو `import` کنه. اگر یادتون نمی‌آد چطوری این کار رو انجام بدین نگاهی به `zombiefeeding.sol` بندازین.

۲. قرارداد `ZombieFactory` رو طوری تغییر بدین که `Ownable` رو به ارث ببره. دوباره می‌تونین به `zombiefeeding.sol` نگاهی بندازین تا یادتون بیاد چطوری این کار رو انجام بدین.
</div>
