---
title: تفاوت Storage و Memory
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Start here

        }
      "zombiefactory.sol": |
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
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

<div dir="rtl">
در Solidity ، دو مکان وجود دارد که می توانید متغیرها را ذخیره کنید - در `storage` و `memory`.

**_Storage_** به متغیرهایی گفته می شود که به طور دائمی در زنجیره بلوک ذخیره می شوند. **_Memory_** متغیرها موقتی هستند و بین فراخوانی های خارجی توابع قرارداد شما، پاک می شوند. به آن مانند دیسک سخت و RAM در کامپیوترتان فکر کنید.

بیشتر اوقات نیازی به استفاده از این کلمات کلیدی نیست زیرا Solidity به طور پیش فرض آنها را کنترل می کند. متغیرهای State (متغیرهای اعلام شده در خارج از توابع) بصورت پیش فرض `storage` هستند و برای همیشه در بلاکچین نوشته می شوند ، در حالی که متغیرهای اعلام شده در داخل توابع `memory` هستند و با پایان دادن به فراخوانی تابع از بین می روند.

با این حال ، مواردی وجود دارد که شما مجبور به استفاده از این کلمات کلیدی هستید ، به عنوان مثال در هنگام برخورد با **_structs_** و **_arrays_** در توابع:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Seems pretty straightforward, but solidity will give you a warning
    // telling you that you should explicitly declare `storage` or `memory` here.

    // So instead, you should declare with the `storage` keyword, like:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...in which case `mySandwich` is a pointer to `sandwiches[_index]`
    // in storage, and...
    mySandwich.status = "Eaten!";
    // ...this will permanently change `sandwiches[_index]` on the blockchain.

    // If you just want a copy, you can use `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...in which case `anotherSandwich` will simply be a copy of the 
    // data in memory, and...
    anotherSandwich.status = "Eaten!";
    // ...will just modify the temporary variable and have no effect 
    // on `sandwiches[_index + 1]`. But you can do this:
    sandwiches[_index + 1] = anotherSandwich;
    // ...if you want to copy the changes back into blockchain storage.
  }
}
```

اگر هنوز به درستی نمی دانید که از کدام یک استفاده کنید ، نگران نباشید - در طول این آموزش ما به شما می گوییم که چه زمانی از `storage` استفاده کنید و چه زمانی از `memory` استفاده کنید ، و کامپایلر Solidity نیز به شما هشدارهایی در این مورد به شما می دهد که چه زمانی باید از یکی از این کلمات کلیدی استفاده کنید.

در حال حاضر ، کافی است بدانید که مواردی وجود دارد که شما باید صریحاً `storage` یا `memory` را اعلام کنید!

# دست به کد شو

وقت آن است که به زامبی های خود توانایی تغذیه و تکثیر را بدهیم!

وقتی یک زامبی از برخی از شکل های زندگی دیگر تغذیه کند ، DNA آن با DNA شکل زندگی دیگر ترکیب می شود و یک زامبی جدید ایجاد می کند.

1. تابعی به نام `feedAndMultiply` ایجاد کنید. این تابع دو پارامتر ورودی خواهد داشت: `_zombieId` (از نوع`uint`) و `_targetDna` (همچنین`uint`). این تابع باید `public` باشد.

2. ما نمی خواهیم اجازه دهیم شخص دیگری با استفاده از زامبی ما تغذیه کند! بنابراین اول ، بیایید مطمئن شویم که مالک این زامبی هستیم. برای اطمینان از اینکه `msg.sender` برابر با صاحب این زامبی است ، عبارت`require` را اضافه کنید (شبیه کاری که در عملکرد `createRandomZombie` انجام دادیم).

 > توجه: مجدداً ، به دلیل اینکه بررسی جواب ما ابتدایی است ، انتظار می رود که ابتدا `msg.sender` بیاید و در صورت تغییر ترتیب ، آن را اشتباه علامت گذاری می کند. اما به طور معمول هنگام کدگذاری ، می توانید از هر ترتیبی که ترجیح می دهید استفاده کنید - هر دو درست هستند.

3. لازم است DNA این زامبی را بدست آوریم. بنابراین کار بعدی که تابع ما باید انجام دهد این است که یک `Zombie` محلی به نام`myZombie` اعلام کنید (که یک اشاره گر `storage` خواهد بود). این متغیر را در آرایه `zombies` ما برابر با index `_zombieId` قرار دهید.

شما باید 4 خط کد داشته باشید ، که شامل علامت `}` برای بسته شدن تابع است.

ما در درس بعدی به کارگیری این تابع ادامه خواهیم داد!
</div>