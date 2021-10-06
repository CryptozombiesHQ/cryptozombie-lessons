---
title: "اضافه کردن: ژن های Kitty"
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // Modify function definition here:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // Add an if statement here
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // And modify function call here:
            feedAndMultiply(_zombieId, kittyDna);
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
            newDna = newDna - newDna % 100 + 99;
          }
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

      }
---

<div dir="rtl">
منطق تابع ما اکنون کامل شده است ... اما اجازه دهید یک ویژگی جدید را اضافه کنیم.

بیایید کاری کنیم تا زامبی های ساخته شده از بچه گربه ها، دارای ویژگی منحصر به فردی باشند که نشان دهد آنها زامبی گربه ای هستند.

برای انجام این کار ، می توانیم کد ویژه ای از بچه گربه ها را در DNA زامبی اضافه کنیم.

اگر از فصل 1 یادآوری کنید ، ما در حال حاضر فقط از 12 رقم اول DNA 16 رقمی خود برای تعیین شکل ظاهری زامبی استفاده می کنیم. بنابراین بیایید از 2 رقم آخر استفاده نشده برای مدیریت ویژگی های "special" استفاده کنیم.

بگوییم که زامبی های گربه ای دارای عدد `99` به عنوان دو رقم آخر DNA خود هستند (از آنجا که گربه ها 9 زندگی دارند). بنابراین در کد ما ، می گوییم `if` یک زامبی از یک گربه ایجاد شود ، سپس دو رقم آخر DNA را روی `99` تنظیم کنید.

## عبارات شرطی

عبارات شرطی در Solidity درست مثل JavaScript هستند:

```
function eatBLT(string sandwich) public {
  // Remember with strings, we have to compare their keccak256 hashes
  // to check equality
  if (keccak256(abi.encodePacked(sandwich)) == keccak256(abi.encodePacked("BLT"))) {
    eat();
  }
}
```

# دست به کد شو

بیایید ژن های گربه را در کد زامبی خود پیاده کنیم.
1. ابتدا ، اجازه دهید تعریف تابع را برای `feedAndMultiply` تغییر دهیم ، بنابراین نیاز داریم پارامتر سومی اضافه می کنیم: یک `string` به نام`_species`

2. سپس ، بعد از اینکه DNA زامبی جدید را محاسبه کردیم ، بیایید یک دستور `if` را با مقایسه هش `keccak256` `_species` و رشته `"kitty"` اضافه کنیم. نمی توانیم رشته ها را مستقیماً به `keccak256` منتقل کنیم. برای اینکار ، ما از `abi.encodePacked(_species)` به عنوان پارامتر در سمت چپ و `abi.encodePacked("kitty")` به عنوان پارامتر در سمت راست قرار خواهیم داد.

3. در داخل عبارت `if` ، می خواهیم 2 رقم آخر DNA را با`99` جایگزین کنیم. یک روش برای این کار استفاده از این منطق است: `newDna = newDna - newDna % 100 + 99;`.

  > توضیحات: فرض کنید `newDna` برابر با `334455` است. سپس `newDna % 100` برابر با `55` است ، بنابراین `newDna - newDna % 100` برابر است با `334400`. در آخر `99` را به این نتیجه اضافه کنید تا `334499` بدست آورید.

4. سرانجام ، باید فراخوانی تابع درون `feedOnKitty` را تغییر دهیم. در فراخوانی `feedAndMultiply`  ، پارامتر `"kitty"` را به انتها اضافه کنید.
</div>
