---
title: مدیریت چند مقدار برگشتی
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

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

          // define function here

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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna);
        }

      }
---

<div dir="rtl">
تابع `getKitty` اولین مثالی است که دیدیم مقادیر متعددی را برمی گرداند. بیایید نحوه مدیریت آنها را بررسی کنیم:

```
function multipleReturns() internal returns(uint a, uint b, uint c) {
  return (1, 2, 3);
}

function processMultipleReturns() external {
  uint a;
  uint b;
  uint c;
  // This is how you do multiple assignment:
  (a, b, c) = multipleReturns();
}

// Or if we only cared about one of the values:
function getLastReturnValue() external {
  uint c;
  // We can just leave the other fields blank:
  (,,c) = multipleReturns();
}
```

# دست به کد شو

زمان تعامل با قرارداد CryptoKitties است!

بیایید تابعی را ایجاد کنیم که ژن های گربه را از قرارداد دریافت کند:

1. تابعی به نام `feedOnKitty` ایجاد کنید. این تابع 2 پارامتر `uint` ،`_zombieId` و `_kittyId` را دریافت حواهد کرد و باید یک تابع`public` باشد.

2. تابع در ابتدا باید یک `uint` به نام `kittyDna` را تعریف کند.

  > توجه: در `KittyInterface` ما ، `genes` از نوع `uint256` است - اما اگر فصل یک را به یاد آورید ، `uint` یک نام مستعار برای `uint256` است - این دو شبیه هم هستند.

3. سپس این تابع باید تابع `kittyContract.getKitty` را با `_kittyId` فراخوانی کند و `genes` را در `kittyDna` ذخیره کند. بخاطر داشته باشید - `getKitty` تعداد زیادی متغیرها را برمی گرداند. (دقیقاً 10 تا - تعدادشان را برای شما حساب کردم!). اما تنها متغیری که برای ما مهم است آخرین مورد است ، `genes`. ویرگولهای خود را با دقت بشمارید!

4. سرانجام ، تابع باید `feedAndMultiply` را فراخوانی کند ، و مقادیر `_zombieId` و `kittyDna` ارسال کند.
</div>
