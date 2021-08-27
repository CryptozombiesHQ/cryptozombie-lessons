---
title: واحدهای زمانی
actions: ['بررسی پاسخ', 'راهنمایی']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. Define `cooldownTime` here

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
                // 2. Update the following line:
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

          function setKittyContractAddress(address _address) external onlyOwner {
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
  
ویژگی `سطح(level)` از اسمش مشخصه چیو نشون می‌ده. در ادامه، وقتی یک سیستم مبارزه ایجاد کردیم، زامبی‌های برنده به مرحله بعد می‌رن و به توانایی‌هاشون اضافه می‌شه.

ویژگی `readyTime` به توضیح بیشتری نیاز داره. هدف اینه که یه "مدت انتظار" به کد اضافه کنیم، که مدت زمان بین تغذیه/ حمله مجدد زامبی رو نشون می‌ده. چون در غیر اینصورت، یه زامبی می‌تونه هر زمانی حمله کنه یا چند برابر شه و اینطوری بازی خیلی ساده می‌شه.

برای ثبت این فاصله زمانی، می‌تونیم از واحدهای زمانی سالیدیتی استفاده کنیم.

## واحدهای زمانی


سالیدیتی برای کار با زمان، واحدهای زمانی ارائه می‌ده.

متغیر `now` تایم‌استمپ آخرین بلاک رو برمی‌گردونه (تعداد ثانیه‌های گذشته از ۱ ژانویه ۱۹۷۰) این مقدار برای لحظه نوشتن این درس برابر `1515527488` است.

> نکته: زمان از قدیم در یک عدد ۳۲ بیتی ذخیره شده، و این عدد تا "سال ۲۰۳۸" رو جواب می‌ده. پس اگر بخوایم دپ ما از الان تا ۲۰ سال دیگه کار کنه، باید از یک عدد ۶۴ بیتی استفاده کنیم، و در اینصورت کاربران ما باید هزینه گس بیشتری بپردازند. تصمیمات طراحی!

سالیدیتی واحدها زمانی `ثانیه`، `دقیقه`، `ساعت`، `روز`، `هفته` و `سال` رو داره. و همه اینا رو با یک عدد صحیح که برابر تعداد ثانیه‌هاست، نمایش می‌دن. یعنی `۱ دقیقه` می‌شه `۶۰`، `۱ ساعت` می‌شه `۳۶۰۰`، `۱ روز` می‌شه `۸۶۴۰۰` و الی آخر.

این هم مثالی از کاربرد واحدهای زمانی:
</div>

```
uint lastUpdated;

// Set `lastUpdated` to `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Will return `true` if 5 minutes have passed since `updateTimestamp` was 
// called, `false` if 5 minutes have not passed
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```
<div dir="rtl">
  
ما می‌تونیم از این واحدهای زمانی برای ویژگی `زمان استراحت(cooldown)` زامبی استفاده کنیم.

## دست به کد شو

خب بیایین یک زمان استراحت به دپ‌مون اضافه کنیم تا زامبی‌ها مجبور باشن *۱ روز* برای تغذیه یا حمله مجدد صبر کنند. 

۱. یک `uint` به نام `cooldownTime` تعریف کنید، و مقدارش رو برابر `۱ روز` بذارین. (خب حتما می‌دونین که اگر برابر "۱ روز" بذارین کامپایل نمی‌شه!)

۲. چون به ساختار `Zombie` متغیر `level` و `readyTime` رو اضافه کردیم باید تابع `_createZombie()` رو به‌روز‌رسانی کنیم تا تعداد آرگومان‌های صحیحی رو بخونه.


  خط رو به‌روز‌رسانی کنید و ۲ آرگومان دیگر بهش اضافه کنید: `۱` (برای `level`) و `uint32(زمان حال + زمان استراحت)` (برای `readyTime`).
  
> نکته: نوشتن عدد صحیح ۳۲ بیتی به اینصورت `uint32(...)` لازمه، چون زمان حال `now`به صورت پیش‌فرض عددصحیح ۲۵۶ بیتی برمی‌گردونه. پس باید صریحا به `uint32` تبدیلش کنیم.

مقدار `now + cooldownTime` برابر تایم‌استمپ زمانی الان (به ثانیه) به‌علاوه تعداد ثانیه‌های یک روز می‌شه. بعدا می‌تونیم مقایسه کنیم ببینیم `readyTime` این زامبی بزرگتر از `now` شده یا نه که نشون می‌ده زمان کافی برای استفاده از این زامبی گذشته یا نه.

عملکردهایی که براساس `readyTime` فعالیت‌های زامبی رو محدود می‌کنه در درس بعد اضافه می‌کنیم.

</div>
