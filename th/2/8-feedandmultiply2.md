---
title:  DNA ซอมบี้
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // start here
          }

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

            function _createZombie(string _name, uint _dna) private {
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

มาทำฟังก์ชั่น `feedAndMultiply` ให้สำเร็จกันเถอะ

สูตรสำหรับการคำนวณ DNA ในซอมบี้ตัวใหม่นั้นไม่ยุ่งยากเลย: คือการใช้ค่าเฉลี่ยระหว่าง DNA ของซอมบี้ตัวที่กิน กับ DNA ของเหยื่อ 

เช่น:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ จะมีค่าเท่ากับ 3333333333333333
}
```

หลังจากนั้นเราสามารถทำให้สูตรมีความซับซ้อนมากขึ้นตามที่ต้องการได้ ยกตัวอย่างเช่น เพิ่มการสุ่ม DNA ของซอมบี้ตัวใหม่เข้าไปอีก แต่ในตอนนี้จะขอทำให้เรียบง่ายที่สุดไปก่อน — สามารถกลับมาในส่วนนี้ภายหลังได้ตามต้องการ

# ทดสอบ

1. อันดับแรกต้องมั่นใจว่า `_targetDna` มีความยาวไม่เกิน 16 ตัว ในการทำเช่นนั้น สามารถตั้งค่า `_targetDna` ให้เท่ากับ `_targetDna % dnaModulus` เพื่อให้รับ input ที่มีความยาวไม่เกิน 16 ตัว

2. ต่อมาฟังก์ชั่นของเราควรประกาศข้อมูลชนิด `uint` ที่มีชื่อว่า `newDna`และ set ให้เท่ากับค่าเฉลี่ยระหว่าง DNA ของ `myZombie` และ `_targetDna` (เหมือนในตัวอย่างทางด้านบน)

  > Note: สามารถเข้าถึง property ของ `myZombie` โดยการใช้ `myZombie.name` และ `myZombie.dna`

3. เมื่อได้ DNA ใหม่ขึ้นมาแล้ว ก็ถึงเวลาของการเรียกฟังก์ชั่น `_createZombie` โดยสามารถเข้าไปดูได้ที่ tab `zombiefactory.sol` หากลืมว่าฟังก์ชั่นนี้ต้องเรียก parameter ตัวใดบ้าง อย่าลืมว่าเราต้องการชื่อของซอมบี้อีกด้วย ดังนั้นให้ตั้งชื่อว่า `"NoName"` ไปก่อน — สามารถมาเขียนฟังก์ชั่นสำหรับการเปลี่ยนชื่อซอมบี้ในภายหลังได้

> Note: ผู้ที่เชี่ยวชาญ Solidity บางท่านอาจสังเกตเห็นปัญหาของโค้ดตรงส่วนนี้ ! อย่ากังวลไป เพราะเราจะเข้ามาแก้ไขแน่นอนในบทถัดไป ;)
