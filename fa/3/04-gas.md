---
title: گس(Gas)
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

            struct Zombie {
                string name;
                uint dna;
                // Add new data here
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
  
خب حالا می‌دونیم چطوری بخش‌های کلیدی اپلیکیشن‌مون رو به‌روزرسانی کنیم تا بقیه کاربران دسترسی تغییر قراردادمون رو نداشته باشند.

خب بیایین یکی دیگر از ویژگی‌های سالیدیتی رو ببینیم که نسبت به سایر زبان‌های برناممه نویسی متفاوته:

## گس - سوختی که دپ‌های اتریوم با آن کار می‌کنند

در سالیدیتی، کارابران دپ شما هر بار که یک تابعی رو اجرا می‌کنند باید هزینه‌ای رو پرداخت کنند و واحد این ارز **_gas(گس)** نام داره. کاربران با اتر (واحد ارز اتریوم) گس خریداری می‌کنند، بنابراین کاربران شما برای اجرای توابع باید اتر خرج کنند.

مقدار گس مورد نیاز برای اجرای تابع به پیچیدگی منطق تابع بستگی داره. **هزینه گس** هر عملیات براساس میزان منابعی که برای انجام اون عملیات نیازه، تعیین می‌شه (برای مثال- هزینه نوشتن روی حافظه خیلی بیشتر از جمع دو عدد صحیحه). **هزینه گس** تابع می‌شه مجموع هزینه‌های گس تک تک عملیات اون تابع.

به دلیل اینکه کاربران شما باید برای اجرای توابع هزینه برای پرداخت کنند، بهینه‌سازی کد در اتریوم از زبان‌های برنامه‌نویسی دیگه خیلی مهم‌تره. اگر کد شما مرتب و تمیز نباشه، کاربران شما مجبور می‌شن با اجرای توابع دپ شما هزینه اضافی پرداخت کنند و این مبلغ می‌تونه به میلیون‌ها دلار هزینه اضافی در هزاران کاربر برسه.

## چرا گس لازمه؟

اتریوم مثل یک کامپیوتر بزرگ و کند اما امنه. وقتی یک تابع رو اجرا می‌کنید، تمامی نودهای شبکه باید اون تابع رو اجرا کنند تا خروجی رو تایید کنند- اجرای هر تابع توسط هزاران نود چیزیه که باعث غیرمتمرکز شدن اتریوم و غیر قابل تغییر بودن داده‌اش و مقاوم در برابر سانسور می‌شه. 

سازندگان اتریوم می‌خواستن مطمئن شن که کسی نمی‌تونه با اجرای یک لوپ بی‌نهایت شبکه رو قفل کنه یا با محاسبات سنگین، تمامی منابع شبکه رو در اختیار بگیره. بنابراین کاری کردن که تراکنش‌ها رایگان نباشه و کاربران برای زمان محاسبات و حافظه مصرفی مجبور باشند هزینه پرداخت کنند.

> نکته: این مورد لزوما در مورد sidechainها صدق نمی‌کنه، مثل این بازی کریپتوزامبی که در Loom Network ساخته شده. احتمالا اجرای بازی مستقیما روی شبکه اصلی اتریوم بی‌معنیه- هزینه گس بسیار بالایی داره. اما می‌تونه روی sidechain با الگوریتم اجماع متفاوتی اجرا شه. در درس‌های آینده درباره اینکه چه دپ‌هایی بهتره روی sidechain یا شبکه اصلی اتریوم اجرا شوند صحبت می‌کنیم.

## نوشتن ساختارهایی که باعث صرفه‌جویی در گس می‌شن

در درس ۱، اشاره کردیم که انوع مختلفی عدد صحیح `uint` داریم: `uint8`، `uint16`، `uint32` و الی آخر.

در حالت عادی هیچ فایده‌ای نداره که نوع `uint` رو مشخص کنیم، چون سالیدیتی ۲۵۶ بایت از حافظه رو به عدد صحیح اختصاص می‌ده بدون توجه به اندازه `uint`. برای مثال اگر از `uint8` به جای `uint` (`uint256`) استفاده کنیم، در هزینه گس هیچ تفاوتی نداره.

اما یه استثنایی در این مورد وجود داره: داخل ساختارها.

اگر در یک ساختار چندین نوع `uint` داشتین، استفاده از `uint`های کوچکتر در مواقع لازم به سالیدیتی اجازه می‌ده تا این متغیرها رو جمع و جور ذخیره کنه تا حافظه کمتری مصرف شه. مثال:
</div>

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` will cost less gas than `normal` because of struct packing
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```
<div dir="rtl">
  
به همین دلیل، داخل یک ساختار بهتره که از کوجکترین اندازه عدد صحیح ممکن استفاده شه.

همچنین بهتره که نوع‌داده‌های مشابه رو  کنار هم و به صورت خوشه‌بندی بذارید (یعنی در یک ساختار مشابه‌ها رو کنار هم قرار بدید) به این صورت سالیدیتی مقدار حافظه مورد نیاز رو به حداقل می‌رسونه. مثلا یک ساختار با متغیرهایی به این ترتیب : `uint c; uint32 a; uint32 b;` گس کمتری نسبت به `uint32 a; uint c; uint32 b;` مصرف می‌کنه. چون `uint32` در یک خوشه قرار گرفتند.


## دست به کد شو

در این درس، می‌خوایم ۲ تا ویژگی دیگه به زامبی‌هامون اضافه کنیم: سطح(`level`) و زمان آماده‌بودن (`readyTime`)- دومی برای نشون دادن زمان تغذیه زامبیه.

پس بریم سراغ `zombiefactory.sol`.

۱. به ساختار `Zombie` دو تا ویژگی اضافه کنید: `level` (یک `uint32`) و `readyTime` (یک `uint32`). می‌خوایم این دو تا متغیر کنار هم باشن پس اینا رو به انتهای ساختار اضافه کنید.

۳۲ بیت برای نگهداری سطح زامبی و یک زمان بیش از حد نیازه ، بنابراین کنار هم نوشتن‌شون و استفاده از `uint32` به جای `uint` باعث صرفه‌جویی در گس مصرفی می‌شه.
</div>
