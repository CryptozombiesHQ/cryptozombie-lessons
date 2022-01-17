---
title: چمع‌بندی
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
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
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---
<div dir="rtl">
  
داریم نزدیک می‌شیم به تکمیل ایجاد یه مولد زامبی تصادفی! بیایین یک تابع عمومی بسازیم که کار رو تموم کنیم.

می‌خواهیم یک تابع عمومی ایجاد کنیم که یک ورودی می‌گیره، اسم زامبی، و با استفاده از اسم و DNA تصادفی یک زامبی می‌سازه

# دست به کد شو

۱. یک تابع عمومی به اسم `createRandomZombie` بنویسین. این تابع یک پارامتر `_name` از نوع `string` می‌گیره. _(نکته: این تابع رو با کلمه کلیدی `public`، عمومی تعریف کنید همونطور که تابع قبل رو با استفاده از کلمه کلیدی `private`، خصوصی تعریف کردین.)_

۲. اولین خط تابع باید تابع `_generateRandomDna` را روی `_name` اجرا کمه و در یک `uint` به اسم `randDna` ذخیره کنه.

۳. دومین خط باید تابع `_createZombie` اجرا شه و اسم `_name`  و DNA تصادفی  `randDna` رو تولید کنه.

۴. جواب نهایی باید ۴ خط بشه (با `}` تابع)

</div>
