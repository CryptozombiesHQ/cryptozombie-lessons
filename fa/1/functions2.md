---
title: توابع عمومی و خصوصی
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

<div dir="rtl">

در سالیدیتی، توابع به صورت پیش‌فرض `عمومی` هستند. به عبارت دیگه هر فردی (یا هر قرارداد دیگه‌ای) می‌تونه توابع قرارداد شما رو صدا بزنه و کدش رو اجرا کنه.

مشخصه که همیشه نمی‌خوایم به این صورت توابع‌مون عمومی باشه، چون اینطوری قراردادمون در برابر حملات آسیب‌پذیر میشن. بنابراین خوبه که به صورت پیش‌فرض تمامی توابع رو به صورت `خصوصی` بنویسین، و فقط توابعی که می‌خواین در دسترس عموم قرار بگیره رو به صورت `عمومی` بنویسید.

خب بیایید ببینیم چطوری باید یک تابع خصوصی (private) تعریف کنیم: 

</div>

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

<div dir="rtl">

در این صورت، فقط توابعی که در همین قرارداد نوشته میشن می‌تونن این تابع رو صدا بزنن و عنصر به آرایه `numbers` اضافه کنن.

همونطور که دیدین، بعد از اسم تابع کلمه کلیدی `private` نوشته می‌شه. و برای پارامترهای تابع بهتره که قبل از اسمشون علامت (`_`) گذاشته بشه.

# دست به کد شو

تابع `createZombie` قراردادمون در حال حاضر به صورت پیش‌فرض عمومیه، و این یعنی هر کسی می‌تونه این تابع رو صدا بزنه و یک زامبی جدید در قراردادمون بسازه! بیایید این تابع رو به حالت خصوصی دربیاریم.

۱. تابع `createZombie` را طوری تغییر بدین که خصوصی بشه. شرایط نام‌گذاری رو فراموش نکنید.

</div>
