---
title: صرفه‌جویی در مصرف گس با استفاده از توابع 'View'
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

          // Create your function here

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

        }

      }
---
<div dir="rtl">
  
عالیه! حالا زامبی‌های مرحله بالاتر یه سری توانایی‌های خاص دارند و این باعث می‌شه که کاربر تشویق شه تا زامبی رو به اون مراحل برسونه. هر زمانی می‌تونیم از این جور توانایی‌های اضافه کنیم.

بیایین یک تابع دیگه اضافه کنیم: می‌خوایم تابعی به اسم `getZombiesByOwner` برای مشاهده کل ارتش زامبی‌های یک کاربر  بسازیم.

این تابع فقط نیاز به خوندن داده از بلاکچین داره پس می‌تونیم `view` تعریفش کنیم. و در ادامه درباره تاثیر این نوع توابع در مصرف گس صحبت می‌کنیم:

## توابع view هزینه گس ندارند

زمانی که توابع `view` بصورت خارجی توسط کاربر صدا زده می‌شن هزینه گس ندارند.

دلیل این مسئله اینه که توابع `view` چیزی رو در بلاکچین تغییر نمی‌دهند و فقط داده رو می‌خونن. پس وقتی تابع رو به عنوان `view` تعریف می‌کنیم به `web3.js` می‌گه که برای اجرای تابع فقط نیاز به ارسال درخواست به اتریوم محلی (local) دارهو نیازی به ایجاد تراکنش در بلاکچین نداره (عملی که باید روی تمامی نودها اعمال شه و باعث مصرف گس می‌شه).

بعدا درباره تنطیمات web3.js روی نو خودتون صحبت می‌کنیم. اما نکته مهمی که برای بهینه‌سازی دپ‌مون یا گرفتیم اینه که تا جایی که ممکنه توابع رو به صورت `external view` تعریف کنیم.

> نکته: اگر یک تابع `view` به صورت داخلی و توسط یک تابع دیگر درون همون قرارداد صدا زده شه دیگه یک تابع `view` نیست و گس مصرف می‌کنه. به این دلیل که تابع دیگر روی اتریوم تراکنش داره و نیاز به تایید همه نودها داره. بنابراین توابع `view` تنها زمانی رایگان هستند که به صورت خارجی صدا زده شوند.

## دست به کد شو

می‌خوایم تابعی بنویسیم که کل ارتش زامبی کاربر رو برگردونه. برای نمایش پروفایل کاربر همراه با ارتش زامبی باید این تابع رو از `web3.js` صدا بزنیم.

منطق این تابع کمی پیچیده است، بنابراین پیاده‌سازیش چند درس طول می‌کشه.

۱. تابعی به اسم `getZombiesByOwner` بنویسید. یک آرگومان از نوع `address` به نام `_owner` داشته باشه.

۲. بیایین تابع رو بصورت `external view` تعریف کنیم تا از `web3.js` صداش کنیم و هزینه گس هم نداشته باشه.

۳. تابع باید یک `uint[]` برگردونه (آرایه‌ای از `uint`).

بدنه تابع رو در درس‌های بعد تکمیل می‌کنیم.
</div>
