---
title:  Keccak256 و تبدیل نوع داده
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              // start here
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

      }
---

<div dir="rtl">

می‌خوایم تابع `_generatePseudoRandomDna` یک مقدار (نیمه) تصادفی از نوع `uint` برگردونه. چطور می‌تونیم این کار رو انجام بدیم؟

تابع هش اتریوم نام دارد که نسخه‌ای از است. تابع هش کارش اینه که ورودی رو به یه عدد هگزا دسیمال(مبنای ۱۶) تصادفی ۲۵۶ بیتی تبدیل کنه. یک تغییر کوچک در ورودی، موجب تغییر بزرگی در هش میشه.

این تابع برای مقاصد مختلفی در اتریوم مفیده، اما در حال حاضر ما ازش فقط برای تولید عدد شبه تصادفی استفاده می‌کنیم.


یک نکته دیگه اینه که `keccak256` یک پارامتر از نوع `bytes` می‌گیره. و این یعنی باید قبل از صدا زدن این تابع پارامترو به این حالت دربیاریم:

مثال:

</div>
```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256(abi.encodePacked("aaaab"));
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256(abi.encodePacked("aaaac"));
```
<div dir="rtl">

همونطور که مشاهده می‌کنین با تغییر یک کاراکتر در ورودی، خروجی به کل تغییر کرده.

> نکته: تولید عدد تصادفی امن در بلاکچین یک مسئله دشواریه. روشی که الان استفاده شده ناامنه، اما چون برای تولید زامبی امنیت اولویت ما نیست این روش برای هدفمون کافیه.

## تبدیل نوع داده (Typecasting)

بعضی مواقع نیاز است که نوع داده‌ها را تبدیل کنید. مثال زیر را در نظر بگیرید:


</div>
```
uint8 a = 5;
uint b = 6;
// throws an error because a * b returns a uint, not uint8:
uint8 c = a * b; 
// we have to typecast b as a uint8 to make it work:
uint8 c = a * uint8(b); 
```
<div dir="rtl">

In the above, `a * b` returns a `uint`, but we were trying to store it as a `uint8`, which could cause potential problems. By casting it as a `uint8`, it works and the compiler won't throw an error.

# دست به کد شو

بیایین تابع `_generatePseudoRandomDna` را تکمیل کنیم! کارایی که باید انجام بدیم:

۱. اولین خط کد باید با استفاده از `keccak256` مقدار هش `abi.encodePacked(_str)` را برای تولید اعداد هگزادسیمال تصادفی تولید کند، و در نهایت نتیجه را در یک متغیر از نوع `uint` با نام `rand` ذخیره کند. 

۲. ما می‌خوایم طول DNA فقط ۱۶ رقم باشه. بنابراین دومین خط کد باید باقی‌مانده (`%`) تقسیم مقدار بالایی بر ۱۶ را برگرداند `return` و در `dnaModulus` ذخیره کند.

</div>
