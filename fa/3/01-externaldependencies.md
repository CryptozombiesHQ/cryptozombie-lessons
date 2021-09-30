---
title: غیرقابل تغییر بودن قرارداد
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

          // 1. Remove this:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Change this to just a declaration:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Add setKittyContractAddress method here

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
---

<div dir="rtl"></div>

تا الان سالیدیتی خیلی شبیه زبان‌های برنامه‌نویسی دیگه مثل جاوااسکریپت به نظر می‌اومد. اما مواردی هست که اپلیکیشن‌های اتریوم تفاوت بسیاری با اپلیکیشن‌های معمولی دارند.

یکی از اون موارد اینه که، بعد از اینکه قرارداد رو در شبکه اتریوم دیپلوی کردین، **_immutable_ (غیرقابل تغییر)** خواهد بود یعنی امکان به‌روزرسانی یا تغییر نداره.

کد اولیه‌ای که در قرارداد می‌نویسین همیشه در بلاکچین، ماندگار خواهد بود. به همین دلیله که امنیت، یکی از موارد مهم در سالیدیتی به شمار می‌آد.اگر خطایی در قرارداد شما باشه، به هیچ وجه امکان اصلاح نخواهد داشت. و در این موارد باید  آدرس یک قرارداد هوشمند دیگری که اصلاح شده است را در اختیار کاربرانتان قرار دهید.

اما این مورد یک جور مزیت هم به حساب می‌آد. کد مثل قانونه. اگر کد قرارداد هوشمندی رو بخونید و تاییدش کنید، می‌تونین مطمئن باشین که هر بار که یک تابع رو صدا می‌زنین همون کاری که در کد اومده بود انجام می‌ده. هیچکس نمی‌تونه تابع رو تغییر بده و نتایج غیرقابل انتظار بده.

## وابستگی‌های خارجی

در درس ۲، آدرس قرارداد کریپتوکیتی‌ها رو به صورت ثابت (hardcode) در اپلیکیشن‌مون قراردادیم. اما چه اتفاقی می‌افته اگر اون قراردادمون باگ داشته باشه و یکی بیاد همه کیتی‌ها رو نابود کنه؟

احتمالش کمه، اما اگر همچین اتفاقی هم بیفته، اپلیکیشن‌مون غیرقابل استفاده می‌شه چون به آدرسی اشاره می‌کنه که کیتی برنمی‌گردونه.

به همین دلیل، خوبه که توابعی داشته باشیم که بتونیم موارد مهم رو در اپلیکیشن به‌روزرسانی کنیم.

برای مثال، شاید بهتر باشه به جای اینکه آدرس رو به صورت ثابت در اپلیکیشن ثبت کنیم(hardcode) یه تابع `setKittyContractAddress` داشته باشیم که اگر اتفاقی برای قراردادمون افتاد بتونیم آدرسش رو تغییر بدیم.

## دست به کد شو

بیایین کد فصل۲ رو به‌روزرسانی کنیم تا بتونیم آدرس قرارداد رو تغییر بدیم.

۱. کدهایی که آدرس رو هاردکد کردیم `ckAddress` حذف کنید.

۲. خطی که `kittyContract` را ساختیم تغییر بدین به صورتی که فقط متغیر رو تعریف کنین، بدون اینکه مقداری بهش تخصیص بدین.

۳. تابعی به اسم `setKittyContractAddress` بسازین. یک آرگومان به اسم `_address` از نوع `address` می‌گیره و باید یک تابع باشه.

۴. یه خط به  این تابع اضافه کنید که مقدار `kittyContract`  رو برابر `KittyInterface(_address)` ست کنه.

> نکته: اگر مشکل امنیتی تو این تابع می‌بینید نگرانش نباشید، قسمت‌های بعدی درستش می‌کنیم ;)
