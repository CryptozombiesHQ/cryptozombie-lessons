---
title: وراثت
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // Start here

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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      contract ZombieFeeding is ZombieFactory {

      }

---
<div dir="rtl">
کد بازی ما در حال زیاد شدن است. به جای ساخت یک قرارداد بسیار طولانی ، گاهی اوقات منطقی است که منطق کد خود را در چندین قرارداد برای سازماندهی کد تقسیم کنید.

یکی از ویژگی های Solidity که این قابلیت را بیشتر کنترل می کند ، **_inheritance_** یا وراثت قرارداد است:

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

`BabyDoge` از`Doge` ارث بری می کند. این بدان معناست که اگر `BabyDoge` را کامپایل و deploy کنید ، این تابع به هردو `catchphrase()` و `anotherCatchphrase()` (و سایر توابع عمومی دیگری که ممکن است در `Doge` تعریف کنیم) دسترسی خواهد داشت.

از این قابلیت می توان برای وراثت منطقی استفاده کرد (مثلا با یک subclass ،یک `Cat` یک `Animal` است). همچنین این قابلیت می تواند به سادگی برای سازماندهی کد شما با گروه بندی منطق مشابه در قراردادهای مختلف مورد استفاده قرار گیرد.

# دست به کد شو

در درس های بعدی ، ما می خواهیم عملکردی را برای تغذیه و تکثیر زامبی های خود اجرا کنیم. بیایید این منطق را در قرارداد خودش قرار دهیم که تمام توابع را از `ZombieFactory` به ارث می برد.

1. قراردادی با عنوان `ZombieFeeding` در زیر`ZombieFactory` بسازید. این قرارداد باید از قرارداد `ZombieFactory` ما ارث بری کند.
</div>
