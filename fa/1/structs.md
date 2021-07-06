---
title: ساختارها (Structs)
actions: ['بررسی پاسخ', 'راهنمایی']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

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

      }
---

<div dir="rtl">

گاهی اوقات ممکنه به نوع‌داده پیچیده‌تری نیاز داشته باشین و **_structs(ساختار)_** در سالیدیتی برای اینطور مواقع است.

```
struct Person {
  uint age;
  string name;
}

```


ساختارها این امکان را فراهم می‌آوردند تا نوع داده‌های پیچیده‌تری با ویژگی‌های چندگانه ایجاد کنین.

> نکته: همونطور که در مثال مشاهده می‌کنین یک نوع داده دیگری معرفی کردیم، `string`. رشته‌ها برای داده‌ها با طول متفاوت و فرمت UTF-8 استفاده می‌شن. مثال: `string greeting = "Hello world!"`

# دست به کد شو

در برنامه‌مون می‌خوایم تعدادی زامبی بسازیم و زامبی‌ها چندین ویژگی دارن، بنابراین ساختارها در اینجا بسیار مناسب هستن.

۱. ساختاری به اسم `Zombie` بسازید.

۲. این ساختار (struct) ۲ ویژگی دارد: `name` از نوع `string` و `dna` از نوع `uint`.

</div>
