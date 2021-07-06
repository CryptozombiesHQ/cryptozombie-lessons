---
title: عملیات ریاضی
actions: ['بررسی پاسخ', 'راهنمایی']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //start here

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---
<div dir="rtl">

ریاضیات در سالیدیتی بسیار آسونه. عملیات زیر مثل اکثر زبان‌های برنامه‌نویسی انجام می‌شه:

* جمع: `x + y`
* تفریق: `x - y`,
* ضرب: `x * y`
* تقسیم: `x / y`
* پیمانه‌ای / باقی‌مانده: `x % y` _(برای مثال، `۱۳٪۵` می‌شه `۳`. چون باقی‌مانده تقسیم `۱۳` به `۵` می‌شه `۳`)_

سالیدیتی از **_عملگر نمایی_** هم پشتیبانی می‌کند.("x به توان y"، x^y):
</div>
```
uint x = 5 ** 2; // equal to 5^2 = 25
```
<div dir="rtl">

# دست به کد شو

برای اطمینان از ۱۶ کاراکتری بودن DNA، بیایین یک متغیر دیگه از نوع `uint` با مقدار ۱۰^۱۶ بسازیم. اینطوری می‌تونیم با استفاده از عملگر پیمانه‌ای یک عدد صحیح رو به صورت ۱۶ رقمی دربیاریم.

۱. یک متغیر به اسم `dnaModulus` از نوع `uint` بسازین و مقدارش رو **۱۰ به توان `dnaDigits`** بذارین.
</div>
