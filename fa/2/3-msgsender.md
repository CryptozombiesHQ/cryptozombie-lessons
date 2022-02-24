---
title: Msg.sender
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
              // start here
              emit NewZombie(id, _name, _dna);
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
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---
<div dir="rtl">
حالا که mapping های خود برای پیگیری اینکه چه کسی صاحب یک زامبی است ، را داریم ، می خواهیم تابع `_createZombie` را برای استفاده از آنها به روز کنیم.

برای این کار باید از چیزی به نام `msg.sender` استفاده کنیم.

## msg.sender

در Solidity ، متغیرهای global خاصی وجود دارد که برای همه توابع در دسترس هستند. یکی از اینها `msg.sender` است که اشاره به `address` شخصی (یا قرارداد هوشمند) دارد که تابع فعلی را فراخوانی کرده است.

> توجه: در Solidity ، اجرای تابع همیشه باید با یک فراخوانی خارجی شروع شود. یک قرارداد فقط روی بلاکچین قرار می گیرد و هیچ کاری انجام نمی دهد تا اینکه کسی یکی از توابع آن را صدا بزند. بنابراین همیشه `msg.sender` وجود خواهد داشت.

در اینجا مثالی از استفاده از `msg.sender` و به روزرسانی`mapping` آورده شده است:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Update our `favoriteNumber` mapping to store `_myNumber` under `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ The syntax for storing data in a mapping is just like with arrays
}

function whatIsMyNumber() public view returns (uint) {
  // Retrieve the value stored in the sender's address
  // Will be `0` if the sender hasn't called `setMyNumber` yet
  return favoriteNumber[msg.sender];
}
```

در این مثال ساده ، هرکسی می تواند `setMyNumber` را صدا زده و `uint` را در قرارداد ما ذخیره کند ، که به آدرس این شخص اشاره خواهد کرد. سپس وقتی آنها `whatIsMyNumber` را صدا می زنند ، `uint` ذخیره شده به آنها بازگردانده حواهد شد.

استفاده از `msg.sender` امنیت بلاکچین اتریوم را به شما می دهد - تنها راهی که کسی می تواند داده های شخص دیگری را تغییر دهد دزدیدن کلید خصوصی مرتبط با آدرس اتریوم آن شخص است.

# دست به کد شو

بیایید تابع `_createZombie` خود را از فصل 1 به روز کنیم تا مالکیت زامبی را به هر کسی که این عملکرد را فراخوانی کرده اختصاص دهد.

1. ابتدا ، پس از بازگرداندن `id` جدید زامبی ، بیایید mapping `zombieToOwner` خود را برای ذخیره `msg.sender` مرتبط با `id` به روز کنیم.

2. دوم ، بیایید تعداد `ownerZombieCount` مربوط به `msg.sender` را افزایش دهیم.

در Solidity ، می توانید یک `uint` را با `++` افزایش دهید ، دقیقاً مانند جاوا اسکریپت:

```
uint number = 0;
number++;
// `number` is now `1`
```

پاسخ نهایی شما برای این درس باید 2 خط کد باشد.
</div>
