---
title: زامبی ها چه می خورند؟
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        // Create KittyInterface here

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

<div dir="rtl">
وقت آن است که به زامبی های خود غذا دهیم! زامبی ها بیشتر دوست دارند چه چیزی بخورند؟

اتفاقاً CryptoZombies عاشق خوردن ...

**CryptoKitties!** 😱😱😱

(بله ، جدی هستم 😆 )

برای انجام این کار باید kittyDna را از قرارداد هوشمند CryptoKitties بخوانیم. ما می توانیم این کار را انجام دهیم زیرا داده های CryptoKitties به طور عمومی در بلاکچین ذخیره می شوند. بلاکچین جالب نیست؟!

نگران نباشید - بازی ما در واقع به CryptoKitty هیچ کس آسیب نمی رساند. ما فقط در حال *خواندن* داده های CryptoKitties هستیم، و قادر به حذف واقعی آنها نیستیم 😉

## تعامل با سایر قراردادها

برای اینکه قرارداد ما با قرارداد دیگری در مورد بلاکچین صحبت کند که ما مالک آن نیستیم، ابتدا باید یک **_interface_** تعریف کنیم.

بیایید به یک مثال ساده نگاه کنیم. فرض کنید قراردادی در بلاکچین وجود دارد که به این شکل است:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

این یک قرارداد ساده است که در آن هر کسی می تواند شماره شانس خود را ذخیره کند و به آدرس اتریوم هر شخص نسبت داده خواهد شد. سپس هر شخص دیگری می تواند با استفاده از آدرس این شخص، به شماره شانس آن شخص نگاه کند.

حال فرض کنید یک قرارداد خارجی داشتیم که می خواست با استفاده از تابع `getNum` داده های این قرارداد را بخواند.

ابتدا باید **_interface_** قرارداد `LuckyNumber` را تعریف کنیم:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

توجه داشته باشید که به نظر می رسد این تعریف شبیه تغریف قرارداد است، با چند تفاوت. مورد اول ، ما فقط توابعی را که می خواهیم با آنها ارتباط برقرار کنیم تعریف می کنیم - در این مورد `getNum` - و هیچ یک از توابع یا متغیرهای state دیگر را تغریف نمی کنیم.

تفاوت دوم این است که، بدنه توابع را تعریف نمیکنیم. به جای آکولاد های (`{` و `}`) ، به سادگی در پایان تعریف تابع (`;`) استفاده میکنیم.

بنابراین این تعریف به نظر می رسد نوعی اسکلت قرارداد است. کامپایلر از این طریق می داند که این تعریف یک interface است.

قرارداد ما با قرار دادن این interface در کد dapp ما می داند که توابع قرارداد دیگر چطور تعریف شده است، چگونه آنها را فراخوانی کند و چه نوع پاسخی را باید انتظار داشته باشد.

در درس بعدی در واقع فراخوانی توابع قرارداد دیگر را خواهیم دید ، اما اکنون اجازه دهید interface خود را برای قرارداد CryptoKitties تعریف کنیم.

# دست به کد شو

ما سورس کد CryptoKitties را برای شما جستجو کردیم و تابعی به نام `getKitty` را پیدا کردیم که تمام داده های بچه گربه، از جمله "genes" آن را برمی گرداند (همان چیزی است که بازی زامبی ما برای تشکیل یک زامبی جدید نیاز دارد!).

تابع به صورت زیر است:

```
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
) {
    Kitty storage kit = kitties[_id];

    // if this variable is 0 then it's not gestating
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

عملکرد نسبت به آنچه که عادت کرده ایم کمی متفاوت به نظر می رسد. می بینید که دسته ای از مقادیر مختلف برگردانده می شود. اگر از زبان برنامه نویسی مانند Javascript استفاده کرده اید، می بینید که این دستور متفاوت است - در Solidity می توانید بیش از یک مقدار از یک تابع برگردانید.

اکنون که دانستیم این تابع چگونه تعریف شده است، می توانیم از آن برای ایجاد یک interface استفاده کنیم:

1. interfaceی به نام `KittyInterface` را تعریف کنید. به یاد داشته باشید ، این کار درست مانند ایجاد یک قرارداد جدید است - ما از کلمه کلیدی `contract` استفاده می کنیم.

2. در داخل interface ، تابع `getKitty` را تعریف کنید (که باید یک کپی از تابع بالا باشد، اما بعد از دستور `returns` به جای اینکه همه چیز داخل آکولاد باشد، نقطه ویرگول استفاده کنید).
</div>
