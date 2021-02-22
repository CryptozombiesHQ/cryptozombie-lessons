---
title: Import
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        // put import statement here

        contract ZombieFeeding is ZombieFactory {

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

      }

---
<div dir="rtl">
اوه متوجه خواهید شد که ما کدی که در سمت راست می بینید تمیز کردیم و اکنون در بالای ویرایشگر خود تب هایی دارید. بروید برای امتحان کردن ، بین تب ها کلیک کنید.

کد ما داشت طولانی می شد ، بنابراین برای مدیریت بیشتر آن را به چندین فایل تقسیم کردیم. به طور معمول شما در پروژه های Solidity خود کدهای طولانی را به این طریق مدیریت خواهید کرد.

وقتی چندین فابل دارید و می خواهید یک فایل را به فایل دیگری import کنید ، Solidity از کلمه کلیدی `import` استفاده می کند:

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

بنابراین اگر فایلی با نام `someothercontract.sol` در همان دایرکتوری این قرارداد داشته باشیم (معنی `./` همین است) ، توسط کامپایلر import می شود.

# دست به کد شو

اکنون که ساختار چند فایلی را تنظیم کردیم ، برای خواندن مطالب فایل دیگر باید از import استفاده کنیم:
1. `zombiefactory.sol` را به فایل جدید ما ، `zombiefeeding.sol` import کنید.
</div>