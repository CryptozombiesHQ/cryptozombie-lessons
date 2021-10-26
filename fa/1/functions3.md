---
title: کمی بیشتر در مورد توابع
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generateRandomDna(string _str) private view returns (uint) {

          }

      }
---

<div dir="rtl">
  
در این فصل  درباره **_مقادیر بازگشتی_** و تغییردهنده‌های (modifiers) توابع یاد می‌گیریم.

## Return Values

برای اینکه تابع یه مقداری برگردونه اینطوری تعریفش می‌کنیم: 

</div>

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```
<div dir="rtl">

در سالیدیتی، نوع داده مقدار بازگشتی هنگام تعریف تابع مشخص می‌شود. (در این مثال `string`)

## تغییردهنده‌های (modifiers) توابع 

تابع بالا حالتی را تغییر نمی‌ده، مثلا مقداری را تغییر نمی‌ده یا چیزی نمی‌نویسه.

در این حالت می‌تونیم تابع را یه عنوان **_view_** تعریف کنیم. به این معنی که فقط داده رو می‌بینه و تغییرش نمی‌ده:

</div>

```
function sayHello() public view returns (string) {
```
<div dir="rtl">

توابعی دیگری هم در سالیدیتی می‌توان تعریف کرد. تابع **_pure_** حتی به داده‌های اپلیکیشن هم دسترسی نداره. به مثال زیر دقت کنید:

</div>
```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```
<div dir="rtl">

این تابع حتی حالت اپلیکیشن رو نمی‌خونه، مقداری که برمی‌گردونه فقط به پارامتر تابعش وابسته است. پس در این موارد تابع به عنوان **_pure_** تعریف می‌شه.

> نکته: ممکنه تشخیص اینکه چه زمانی تابع رو به صورت view یا pure تعریف کنیم. خوشبختانه کامپایلر سالیدیتی هشدارهای مناسبی می‌ده تا متوجه بشیم از کدوم modifier استفاده کنیم.

# دست به کد شو

به یه تابع کمکی احتیاج داریم که از یه رشته، DNA تصادفی تولید کنه.

۱. یک تابع `private` به `_generateRandomDna` اسم بسازین. یک پارامتر به اسم `_str` از نوع رشته می‌گیره و یک `uint` برمی‌گردونه.

۲. این تابع بعضی از متغیرهای قراردادمون رو می‌بینه ولی تغییرشون نمی‌ده پس از نوع `view` تعریفش کنید. 

۳. داخل تابع رو فعلا خالی بذارید، بعدا تکمیلش می‌کنیم.


</div>
