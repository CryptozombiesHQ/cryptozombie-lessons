---
title: رویدادها
actions: ['بررسی پاسخ', 'راهنمایی']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          // declare our event here

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // and fire it here
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
  
قراردادمون تقریبا تمومه! حالا بیایین یه **_event(رویداد)_** بهش اضافه کنیم.

رویدادها راهی برای براقراری ارتباط بین قرارداد و فرانت اند اپلیکیشن شماست.

مثال:
</div>
```
// declare the event
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // fire an event to let the app know the function was called:
  emit IntegersAdded(_x, _y, result);
  return result;
}
```
<div dir="rtl">
  
فرانت اپ شما منتظر رویداد می‌مونه. پیاده‌سازی جاوااسکریپتش یه چیزی شبیه این می‌شه:
</div>
```
YourContract.IntegersAdded(function(error, result) { 
  // do something with result
}
```
<div dir="rtl">
  
# دست به کد شو


رویدادی می‌خوایم که هر بار یک زامبی جدید ایجاد می‌شه، در فرانت نمایش داده بشه.

۱. رویدادی به اسم `NewZombie` تعریف کنید. باید این مقادیر رو بفرسته: `zombieId` (از نوع `uint`)، `name` (از نوع `string`) و `dna` (از نوع `uint`).

۲. تابع `_createZombie` را طوری تغییر بدید که وقتی به آرایه `zombies` اضافه می‌شه رویداد `NewZombie` رو اجرا کنه.

۳. بعدا `id` زامبی‌ها نیاز می‌شه. `array.push()` طول آرایه رو به `uint` یک برمی‌گردونه و چون شماره اولین خونه آرایه صفره، `array.push() - 1` شماره زامبی جدید می‌شه. نتیجه `array.push() - 1` در `id`از نوع `uint` ذخیره کنید، تا در رویداد در خط بعد ازش استفاده کنید.

</div>
