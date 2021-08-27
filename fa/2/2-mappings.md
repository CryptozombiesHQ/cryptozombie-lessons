---
title: مپ ها و آدرس ها
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
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

          // declare mappings here

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              emit NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
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

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              emit NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---
<div dir="rtl">
بیایید با دادن مالک به زامبی های موجود در پایگاه داده ، بازی خود را چند نفره کنیم.

برای انجام این کار ، ما به دو نوع داده جدید نیاز داریم: `mapping` و `address`.

## آدرس ها

بلاکچین اتریوم از **_accounts_** تشکیل شده است که می توانید آنها را مانند حساب های بانکی در نظر بگیرید. یک حساب شامل مقداری **_Ether_** (ارز مورد استفاده در بلاک چین اتریوم) است و شما می توانید اتر را به حساب های دیگر ارسال و دریافت کنید ، درست مانند حساب بانکی شما که می تواند پول را به حساب های بانکی دیگر منتقل کند.

هر حساب یک `address` دارد ، که می توانید آن را مانند شماره حساب بانکی در نظر بگیرید. که یک شناسه منحصر به فرد است که به آن حساب اشاره می کند و به این شکل است:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(این آدرس متعلق به تیم CryptoZombies است. اگر از CryptoZombies لذت می برید ، می توانید برای ما اتر بفرستید! 😉)

ما در فصل بعدی به جزییات فنی آدرس خواهیم پرداخت، اما در حال حاضر فقط باید بدانید که **ـ آدرس متعلق به یک کاربر خاص است ـ** (یا یک قرارداد هوشمند).

بنابراین می توانیم از آن به عنوان شناسه منحصر به فرد برای مالکیت زامبی های خود استفاده کنیم. هنگامی که یک کاربر با تعامل با برنامه ما زامبی های جدید ایجاد می کند ، ما مالکیت آن زامبی ها را به آدرس اتریومی که تابع را صدا می کند تنظیم خواهیم کرد.

## Mappings

در فصل 1 ما **_structs_** و **_arrays_** را بررسی کردیم. **_Mappings_** روش دیگری برای ذخیره سازی داده های سازمان یافته در Solidity است.

تعریف `mapping` به این شکل است:

```
// For a financial app, storing a uint that holds the user's account balance:
mapping (address => uint) public accountBalance;
// Or could be used to store / lookup usernames based on userId
mapping (uint => string) userIdToName;
```

یک mapping اساساً ذخیره کلید/مقدار برای ذخیره و جستجوی اطلاعات است. در مثال اول ، کلید یک `address` است و مقدار آن یک `uint` است ، و در مثال دوم کلید `uint` و مقدار `string` است.

# دست به کد شو

برای ذخیره مالکیت زامبی ، ما قصد داریم از دو mapping استفاده کنیم: یکی که آدرس صاحب زامبی را ثبت کند و دیگری که تعداد زامبی های یک مالک را ثبت کند.

1. یک mapping به نام `zombieToOwner` ایجاد کنید. کلید `uint` خواهد بود (ما زامبی را بر اساس شناسه آن ذخیره و جستجو خواهیم کرد) و مقدار `address` خواهد بود. بیایید این mapping را `public` کنیم.

2. یک mapping به نام `ownerZombieCount` ایجاد کنید ، جایی که کلید یک `address` است و مقدار آن یک `uint` است.
</div>
