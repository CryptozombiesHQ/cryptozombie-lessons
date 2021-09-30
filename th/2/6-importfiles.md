---
title: Import
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // put import statement here

        contract ZombieFeeding is ZombieFactory {

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

      }

---

โอ้ะ! เห็นไหมว่าโค้ดเพิ่งได้ถูกจัดระเบียบให้ไปอยู่ทางด้านขวา และตอนนี้ tabs ตัวเลือกต่าง ๆ ได้ถูกจัดว่าให้ไปอยู่ด้านบนของ editor ลองคลิกระหว่าง tabs  เพื่อลองใช้คำสังต่าง ๆ ดูสิ

โค้ดที่ได้สร้างขึ้นนั้นค่อนข้างมีขนาดยาว จึงได้ถูกแบ่งออกให้ไปอยู่ในหลายๆ ไฟล์เพื่อความง่ายในการจัดการ และนี่ก็คือวิธีขั้นพื้นฐานในการรับมือกับโค้ดขนาดยาวในโปรเจคบน Solidity

เมื่อมีไฟล์มากกว่า 1 เราจะต้องทำการอิมพอร์ตไฟล์ให้เข้าไปอยู่ในอีกไฟล์หนึ่ง โดย Solidity จะใช้คำว่า `import` :

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

ดังนั้น ถ้าเรามีไฟล์ที่ชื่อว่า `someothercontract.sol` อยู่ภายในไดเรคทอรี่เดียวกัน ดังเช่นใน contract นี้ (เป็นความหมายของ `./` ) compiler จะทำการอิมพอร์ตเข้ามาให้

# ลองมาทดสอบกัน

ในตอนนี้หลังจากได้ตั้งค่าโครงสร้างหลายไฟล์ขึ้นมา (multi-file structure) เราจำเป็นจะต้องใช้คำสั่ง `import` เพื่ออ่านเนื้อหาของอีกไฟล์หนึ่งด้วย:

1. อิมพอร์ต `zombiefactory.sol` เข้าไปในไฟล์ใหม่ที่ชื่อว่า `zombiefeeding.sol`
