---
title: زامبی DNA
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // start here
          }

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
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

<div dir="rtl">
بیایید نوشتن تابع `feedAndMultiply` را به پایان برسانیم.

فرمول محاسبه DNA یک زامبی جدید ساده است: فقط میانگین بین DNA زامبی تغذیه کننده و DNA هدف است.

مثلا:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ will be equal to 3333333333333333
}
```

بعداً اگر بخواهیم می توانیم فرمول خود را پیچیده تر کنیم ، مقلا می توانیم ایجاد DNA زامبی را تصادفی تر کنیم. اما در حال حاضر ما آن را ساده نگه می داریم - همیشه بعداً می توانیم آن را تغییر دهیم.

# دست به کد شو

1. ابتدا باید اطمینان حاصل کنیم که `_targetDna` از 16 رقم بیشتر نباشد. برای این کار می توانیم `_targetDna` را برابر با `_targetDna % dnaModulus` قرار دهیم تا فقط 16 رقم آخر را بگیرد.

2. بعد تابع ما باید یک `uint` به نام `newDna` را تعریف کند و آن را برابر با میانگین DNA `myZombie` و `_targetDna` قرار دهد (مانند مثال بالا).

  > توجه: می توانید با استفاده از `myZombie.name` و`myZombie.dna` به خصوصیات `myZombie` دسترسی پیدا کنید

3. هنگامی که DNA جدید را بدست آوردیم ، بیایید `_createZombie` را صدا بزنیم. اگر فراموش کردید که این تابع برای فراخوانی به چه پارامترهایی نیاز دارد ، می توانید به تب `zombiefactory.sol` نگاه کنید. توجه داشته باشید که فراخوانی این تابع به یک نام نیاز دارد ، بنابراین بیایید فعلا نام زامبی جدید خود را `"NoName"` بگذاریم - بعداً می توانیم یک تابع بنویسیم تا نام زامبی ها را تغییر دهیم.

> توجه: در Solidity ، ممکن است در اینجا مشکلی با کد ما مشاهده کنید! نگران نباشید ، ما این مشکل را در درس بعدی رفع خواهیم کرد ؛)
</div>