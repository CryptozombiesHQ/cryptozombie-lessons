---
title: Require
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

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              // start here
              uint randDna = _generateRandomDna(_name);
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
              zombieToOwner[id] = msg.sender;
              ownerZombieCount[msg.sender]++;
              emit NewZombie(id, _name, _dna);
          }

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---
<div dir="rtl">
در فصل 1 ، ما کاری کردیم تا کاربران بتوانند با فراخوانی `createRandomZombie` و وارد کردن نام ، زامبی های جدید ایجاد کنند. با این حال ، اگر کاربران بتوانند برای ایجاد زامبی های نامحدود در ارتش خود این تابع را صدا بزنند، بازی خیلی سرگرم کننده نخواهد بود.

بیایید کاری کنیم تا هر بازیکن فقط یک بار بتواند این تابع را صدا بزند. با این کار هر بازیکن جدید با شروع بازی برای ایجاد اولین زامبی خود می تواند این تابع را صدا بزند.

چگونه می توانیم کاری کنیم تا این تابع فقط یک بار توسط هر بازیکن فراخوانی شود؟

برای این کار ما از `require` استفاده می کنیم. `require` کاری می کند تا اگر یک شرط درست نباشد ، تابع خطایی ایجاد  کند و اجرای تابع متوقف می شود:

```
function sayHiToVitalik(string _name) public returns (string) {
  // Compares if _name equals "Vitalik". Throws an error and exits if not true.
  // (Side note: Solidity doesn't have native string comparison, so we
  // compare their keccak256 hashes to see if the strings are equal)
  require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
  // If it's true, proceed with the function:
  return "Hi!";
}
```

اگر این تابع را با `sayHiToVitalik("Vitalik")` فراخوانی کنید ،"Hi!"برمی گردد. اگر با ورودی دیگری آن را صدا کنید ، خطایی ایجاد می کند و اجرا نمی شود.

بنابراین `require` برای تأیید شرایط خاصی که باید قبل از اجرای یک تابع درست باشد کاملاً مفید است.

# دست به کد شو

در بازی زامبی ما نمی خواهیم کاربر با فراخوانی مکرر `createRandomZombie` بتواند در ارتش خود زامبی نامحدود ایجاد کند - در این حالت بازی خیلی سرگرم کننده نخواهد بود.

برای اطمینان از اینکه این تابع فقط یک بار برای هر کاربر ، آن هم زمانی که اولین زامبی خود را ایجاد می کنند ، از `require` استفاده کنیم.

1. در ابتدای `createRandomZombie` دستور `require` را قرار دهید. این تابع باید بررسی کند که `ownerZombieCount[msg.sender]` برابر است با `0` ، و در غیر اینصورت خطایی ایجاد می کند.

> توجه: در Solidity مهم نیست که کدام عبارت را در ابتدا قرار دهید - هر دو ترتیب معادل هستند. با این حال ، از آنجا که جستجوگر پاسخ ما واقعاً ساده است ، فقط یک پاسخ را به عنوان پاسخ صحیح می پذیرد - و انتظار دارد که `ownerZombieCount[msg.sender]` در ابتدا قرار گیرد.
</div>
