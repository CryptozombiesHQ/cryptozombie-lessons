---
title: การจัดการ Return Values จำนวนมาก
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

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

          // กำหนดฟังก์ชั่นไว้ตรงนี้

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

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
                NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

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

ฟังก์ชั่น `getKitty` นี้เป็นตัวอย่างแรกที่แสดงการรีเทิร์นค่าออกมาหลายค่า มีดูถึงวิธีการจัดการค่าดีกว่า:

```
function multipleReturns() internal returns(uint a, uint b, uint c) {
  return (1, 2, 3);
}

function processMultipleReturns() external {
  uint a;
  uint b;
  uint c;
  // หากเราต้องการรับมือกับหลายตัวแปร:
  (a, b, c) = multipleReturns();
}

// หรือหากในกรณีที่เราสนใจเพียงแค่ค่าเดียว:
function getLastReturnValue() external {
  uint c;
  // เราสามารถปล่อย field อื่นไว้ว่าง ๆ ก็ได้:
  (,,c) = multipleReturns();
}
```

# ลองมาทดสอบกันดู

มาถึงช่วงของการ interact กับ contract ชื่อ CryptoKitties แล้ว!

การสร้างฟังก์ชั่นที่จะรับ kitty genes มาจาก contract:

1. สร้างฟังก์ชั่นที่มีชื่อว่า `feedOnKitty` โดยฟังก์ชั่นนี้จะรับข้อมูลชนิด `uint` 2 พารามิเตอร์ ได้แก่ `_zombieId` และ `_kittyId` โดยฟังก์ชั่นนี้ควรมีค่าเป็น `public` 

2. โดยแต่แรกนั้นฟังก์ชั่นควรมีการประกาศตัวแปรชนิด `uint` ชื่อว่า `kittyDna`.

  > Note: ใน `KittyInterface` ตัวแปร `genes` มีชนิดเป็น `uint256` — แต่หากเรายังไม่ลืมบทเรียนแรกจะจำได้ว่า `uint` ไม่ได้ต่างจาก `uint256` — เรียกว่าเหมือนกันเลยก็ว่าได้

3. ฟังก์ชั่นนี้จะต้องสามารถเรียกฟังก์ชั่นที่ชื่อว่า `kittyContract.getKitty` โดยใช้ `_kittyId` และเก็บค่า `genes` ให้อยู่ไว้ใน `kittyDna` อย่าลืมว่า — `getKitty` จะรีเทิร์นตัวแปรออกมาหลายค่า (ก็คือ 10 ตัวนั่นเอง — จริงๆ เราแอบนับให้เรียบร้อยแล้ว!) แต่ตัวแปรสุดท้ายจะเป็นตัวที่เราสนใจจริงๆ ซึ่งก็คือ  `genes` นับ comma ให้ดีๆ ด้วยนะ!

4. ท้ายที่สุดแล้วฟังก์ชั่นนี้ควรสามารถเรียก `feedAndMultiply` โดยรับค่า `_zombieId` และ `kittyDna`ได้
