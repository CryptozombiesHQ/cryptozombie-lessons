---
title: ساختارها و آرایه‌ها
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

          function createZombie (string _name, uint _dna) {
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

          function createZombie (string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

<div dir="rtl">  
  
۱.داخل تابع یه زامبی جدید با عنوان `Zombie`بسازین و اونو به آرایه`zombies` اضافه کنین. اسم `name` و دی‌ان‌ای `dna` زامبی جدید از آرگومان‌های تابع‌مونه.
۲. بیایین کدمونو تو یه خط بنویسیم تا تمیزتر باشه.

  
### ایجاد ساختار جدید

ساختار `Person` از مثال قبل رو یادتونه؟

</div>

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```


<div dir="rtl">     

حالا می‌خوایم یاد بگیریم چطوری `Person`های جدید بسازیم و اونا رو به آرایه `people` (مردم) اضافه کنیم.

</div>

```
// یک شخص جدید ایجاد کنید
Person satoshi = Person(172, "Satoshi");

// این شخص را به آرایه اضافه کنید
people.push(satoshi);
```


<div dir="rtl">     

همچنین می‌تونیم این دو مرحله رو با هم تو یه خط کد بنویسیم تا کدمون تمیزتر باشه:

</div>

```
people.push(Person(16, "Vitalik"));
```


<div dir="rtl">  
   
توجه کنین که `array.push()` عنصر جدید رو به **انتها**ی آرایه اضافه می‌کنه، پس عناصر به ترتیبی که اضافه شدند در آرایه ذخیره می‌شن. مثال زیر رو ببینین:

</div>

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// آرایه number در نهایت به این ترتیب می‌شه [5, 10, 15]
```



<div dir="rtl">  

# دست به کد شو

بیاین کدی بنویسیم که تابع createZombie کاری انجام بده!


۱.داخل تابع یه زامبی جدید با عنوان `Zombie`بسازین و اونو به آرایه`zombies` اضافه کنین. اسم `name` و دی‌ان‌ای `dna` زامبی جدید از آرگومان‌های تابع‌مونه.

۲. بیایین کدمونو تو یه خط بنویسیم تا تمیزتر باشه.

</div>
