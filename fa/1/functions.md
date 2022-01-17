---
title: تعریف توابع
actions: ['بررسی پاسخ', 'راهنمایی']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          // start here

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

<div dir="rtl">

در سالیدیتی توابع به صورت زیر تعریف می‌شوند:

</div>

```
function eatHamburgers(string _name, uint _amount) {

}
```

<div dir="rtl">
  
این تابع، `eatHamburgers` نام دارد که دو پارامتر می‌گیرد: یک `string` و یک `uint`. فعلا بدنه تابع را خالی گذاشتیم.


> نکته: رایجه (ولی لازم نیست) که متغیرهای پارامتر توابع با علامت (_) شروع بشه تا از متغیرهای سراسری متمایز بشن.

تابعی که بالاتر ساختیم رو به این صورت صدا می‌زنیم:

</div>
```
eatHamburgers("vitalik", 100);
```

<div dir="rtl">

# دست به کد شو

توی اپ‌مون نیاز میشه که تعدادی زامبی ایجاد کنیم، بیایید برای انجامش یه تابع بنویسیم.


۱. تابعی به نام `createZombie` بسازید که دو پارامتر دریافت می‌کنه: **\_name** (یک `string`) و **\_dna**  (یک uint)

داخل تابع رو فعلا خالی بذارید بعدا تکمیلش می‌کنیم.

</div>
