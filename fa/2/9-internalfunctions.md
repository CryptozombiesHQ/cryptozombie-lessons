---
title: اطلاعات بیشتر در مورد Visibility تابع
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
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

            // edit function definition below
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
      "zombiefeeding.sol": |
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

          function _createZombie(string _name, uint _dna) internal {
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
---

<div dir="rtl">
**کد درس قبلی ما اشتباه دارد!**

اگر سعی کنید آن را کامپایل کنید ، کامپایلر خطایی ایجاد می کند.

مسئله این است که ما سعی کردیم تابع `_createZombie` را از درون `ZombieFeeding` فراخوانی کردیم ، اما `_createZombie` یک تابع `private` در داخل `ZombieFactory` است. این بدان معناست که هیچ یک از قراردادهایی که از `ZombieFactory` به ارث برده اند نمی توانند به آن دسترسی داشته باشند.

## Internal و External

علاوه بر `public` و `private` ، Solidity دارای دو نوع visibility دیگر برای توابع است: `internal` و `external`.

`internal` همان `private` است ، با این تفاوت که در قراردادهایی که از این قرارداد ارث بری دارند نیز قابل دسترسی است. **(به نظر می رسد همان چیزی است که ما در اینجا می خواهیم!)**.

`external` شبیه به `public` است ، با این تفاوت که این توابع را فقط خارج از قرارداد می توان فراخوانی کرد - آنها را نمی توان با توابع دیگر آن قرارداد فراخوانی کرد. ما در مورد اینکه چرا بعداً ممکن است بخواهید از `external` در مقابل `public` استفاده کنید صحبت خواهیم کرد.

برای اعلام توابع `internal` یا`external` ، syntax شبیه همان `private` و `public` است:

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // We can call this here because it's internal
    eat();
  }
}
```

# دست به کد شو

1. `_createZombie()` را از `private` به `internal` تغییر دهید تا قرارداد دیگر ما بتواند به آن دسترسی پیدا کند.

  ما قبلاً شما تب مناسب ، `zombiefactory.sol` برای شما انتخاب کرده ایم.
</div>
