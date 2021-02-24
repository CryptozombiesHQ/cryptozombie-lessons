---
title: حلقه For
actions: ['بررسی پاسخ', 'راهنمایی']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.25;

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
            // Start here
            return result;
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

در درس قبل گفتیم که بعضی مواقع نیاز می‌شه که با استفاده از حلقه `for` محتوای آرایه رو ایجاد کنیم، به جای اینکه آرایه رو در  `storage`  بنویسیم.

بریم دلیلش رو بررسی کنیم:

یه کار ساده برای به دست آوردن ارتش زامبی‌های یک کاربر اینه که از `mapping` استفاده کنیم، به این صورت:

```
mapping (address => uint[]) public ownerToZombies
```

هر بار که یک زامبی جدید ساخته می‌شه، به سادگی از `ownerToZombies[owner].push(zombieId)`  استفاده می‌کنیم و اون رو به آرایه زامبی‌ها اضافه می‌کنیم و تابع `getZombiesByOwner` خیلی ساده‌تر می‌شه:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### مشکل این رویکرد

این روش خیلی ساده است، اما بذارید ببینیم زمانی که می‌خواهیم زامبی‌های یک کاربر رو به دیگری انتقال یدیم چه اتفاقی می‌افته.
تابع انتقال به موارد زیر نیاز داره:

۱. زامبی را به آرایه `ownerToZombies`  کاربر جدید اضافه کن.
۲. آن زامبی را از آرایه `ownerToZombies`  کاربر قبلی حذف کن.
۳. برای پرکردن جای خالی زامبی حذف شده، همه خانه‌های آرایه را شیفت بده.
۴. یک واحد از طول آرایه کم کن.


مرحله ۳ بسیار پرهزینه (از لحاظ مصرف گس) خواهد بود. اگر کاربر ۲۰ تا زامبی داشته باشه، و اولین زامبی در آرایه منتقل شود، نیاز به ۱۹ عمل نوشتن داریم.

و از آنجایی که نوشتن در  `storage`  یکی از پرهزینه‌ترین کارهادر سالیدیتی است، هر بار صدا زدن این تابع انتقال هزینه زیادی به بار خواهد آورد. با توجه به مکان زامبی انتقالی و تعداد دفعات صدازدن این تابع این هزینه متغیر است، بنابراین کاربر نمی‌دونه چه مقدار گس باید بفرسته. 

> نکته: البته می‌تونیم آخرین زامبی آرایه رو انتقال بدیم و فقط اون خانه رو پر کنیم اما در اینصورت باید در هر بار انتقال ترتیب ارتش زامبی رو هم درست کنیم.
چون توابع `view` در صورتی که به صورت خارجی صدا زده شوند، گس مصرف نمی‌کنند، می‌تونیم در تابع `getZombiesByOwner`  از حلقه for برای به‌روزرسانی آرایه استفاده کنیم. در این صورت تابع `انتقال` ما خیلی ارزانتر می‌شه.

## استفاده از حلقه `for`


سینتکس حلقه `for` در سالیدیتی مشابه جاوااسکریپت است.

مثالی رو برای تشکیل آرایه‌ای از اعداد زوج ببینیم:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // Keep track of the index in the new array:
  uint counter = 0;
  // Iterate 1 through 10 with a for loop:
  for (uint i = 1; i <= 10; i++) {
    // If `i` is even...
    if (i % 2 == 0) {
      // Add it to our array
      evens[counter] = i;
      // Increment counter to the next empty index in `evens`:
      counter++;
    }
  }
  return evens;
}
```

این تابع هر آرایه‌ای با محتوای `[2, 4, 6, 8, 10]` برمی‌گردونه.

## دست به کد شو

بیایید تابع `getZombiesByOwner`  رو با نوشتن یک حلقه `for`  تموم کنیم این حلقه روی زامبی‌های همه کاربران اجرا می‌شه تا ارتش مناسب رو پیدا کنه و در نهایت نتیجه رو در `result` ذخیره می کنه.


۱. متغیری به نام `counter`  از نوع `uint` با مقدار `0` معرفی کنید. این متغیر ایندکس آرایه `result` رو ذخیره می‌کنه.

۲. یک حلقه `for` با شروع از `uint i = 0`  و پایان  `i < zombies.length`  تعریف کنید.

۳. داخل حلقه `for`  یک عبارت `if` بنویسید که چک می‌کند `zombieToOwner[i]`  برابر `_owner`  است یا خیر. این مورد برای بررسی دو آدرس است.

۴. داخل عبارت `if` :
  الف. ID زامبی را با تخصیص مقدار i به `result[counter]`  به  `result`  دهید.
  ب. مقدار `counter` را یک واحد افزایش دهید.
    

تمام! حالا تابع تمامی زامبی‌های `_owner` رو بدون ارسال گس برمی‌گردونه.

