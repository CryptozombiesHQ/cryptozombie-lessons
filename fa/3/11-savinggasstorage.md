---
title: ذخیره‌سازی در storage گران است
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
            // Start here
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

          return result;
        }

      }
---
<div dir="rtl">
  
یکی از پرهزینه‌ترین عملیات در سالیدیتی استفاده از `storage` است، خصوصا نوشتن در آن.

دلیلش اینه که هر بار که یک قسمت از داده رو تغییر می‌دین یا داده‌ای نوشته می‌شه، به صورت دائمی رو بلاکچین نوشته می‌شه. و هزاران نود در سراسر جهان باید اون داده رو روی هارد فیزیکی‌شون ذخیره کنند و با رشد و توسعه بلاکچین حجم این داده‌ها بالاتر می‌ره، بنابراین هزینه‌ای برای این کار در نظر گرفته شده است.


برای کم کردن هزینه‌ها، باید فقط در زمان لزوم روی  `storage` داده بنویسید. و بعضی مواقع ممکنه از لحاظ برنامه‌نویسی بهینه به نظر نیاد، مثل به‌روزرسانی آرایه در حافظه  `memory` هر بار که تابع صدا زده می‌شه، به جای ذخیره اون آرایه در یک متغیر.

در اکثر زبان‌های برنامه‌نویسی لوپ زدن روی مجموعه‌داده حجیم کار پرهزینه‌ایه، اما در سالیدیتی این کار بسیار کم‌هزینه‌تر از استفاده از `storage`  در صورتی که تابع `external view` تعریف شده باشه، چون توابع `view` هزینه‌ای برای کاربر ندارند.


درباره حلقه `for` در درس بعد صحبت می‌کنیم اما الان ببینیم که چطور باید در حافظه آرایه تعریف کنیم.

## تعریف آرایه در حافظه


برای ایجاد یک آرایه داخل تابع می‌تونید از کلمه کلیدی `memory` استفاده کنید بدون نیاز به نوشتن در  `storage`. آرایه در زمان اجرای تابع وجود خواهد داشت و این کار بسیار ارزانتر (از لحاظ مصرف گس) از به‌روزرسانی آرایه در  `storage`  خواهد بود و رایگانه اگر تابع از نوع `view` باشه و بصورت خارجی صدا زده شه.

مثال زیر نشون می‌ده چطوری آرایه رو در حافظه تعریف کنید:

</div>

```
function getArray() external pure returns(uint[]) {
  // Instantiate a new array in memory with a length of 3
  uint[] memory values = new uint[](3);
  // Add some values to it
  values.push(1);
  values.push(2);
  values.push(3);
  // Return the array
  return values;
}
```
<div dir="rtl">
  

این یک مثال برای نشان دادن سینتکس بود، در درس بعد با حلقه `for` و طرز استفاده ازش آشنا می‌شیم.

> نکته: طول آرایه‌های حافظه **باید** مشخص باشد (در این مثال `3`). در حال حاضر نمی‌شه اندازه‌شون رو مثل آرایه‌های ذخیره شده در storage با `array.push()` تغییر داد اما شاید در نسخه‌های بعدی سالیدیتی این ویژگی بهش اضافه شه.

## دست به کد شو

در تابع `getZombiesByOwner` می‌خواهیم یک آرایه از نوع `uint[]` شامل زامبی‌های یک کاربر را برگردونه.

۱. متغیری از نوع `uint[] memory` به نام `result` تعریف کنید.

۲. مقدار متغیر را برابر آرایه‌ای جدید از نوع `uint` قرار دهید.  طول آرایه برابر تعداد زامبی‌های یک کاربر خواهد بود که با استفاده از `mapping` با `ownerZombieCount[_owner]` می‌تونیم مقدارش رو چک کنیم.

۳. در انتهای تابع مقدار `result` رو برگردانید. فعلا آرایه خالی است ولی در درس بعد آرایه رو تکمیل می‌کنیم.

</div>
