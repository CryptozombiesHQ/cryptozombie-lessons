---
title: Function Declarations การประกาศค่าฟังก์ชั่น
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // เริ่มตรงนี้

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

การประกาศฟังก์ชั่นใน Solidity จะมีหน้าตาดังนี้

```
function eatHamburgers(string _name, uint _amount) {

}
```

โดยตัวอย่างดังกล่าวจะเป็นฟังก์ชั่นที่ชื่อว่า `eatHamburgers` ที่จะรับตัวแปร 2 ค่า ได้แก่ ข้อมูลชนิด `string` และ `uint` โดยในตอนนี้ภายในฟังก์ชั่นจะยังไม่มีอะไร

> โน้ต: การเริ่มต้นชื่อของตัวแปรต่างๆ ภายในฟังก์ชั่นด้วยเครื่องหมายสัญประกาศ (`_`) จะทำให้มีความสะดวก (แต่ก็ไม่ได้จำเป็น) ในการที่จะแยกความแตกต่างตัวแปรเหล่านี้ออกจากตัวแป global โดยเดี๋ยวเราจะสอนวิธีการใช้ดังกล่าวในบทนี้ด้วย 

คุณสามารถเรียกฟังก์ชั่นได้ดังนี้

```
eatHamburgers("vitalik", 100);
```

# ทดสอบ

ในแอพพลิเคชั่นของเรานั้นต้องการฟังก์ชั่นที่เอาไว้สร้างซอมบี้ขึ้นมา เราจะมาสร้างฟังก์ชั่นนี้กัน

1.	สร้างฟังก์ชั่นขึ้นโดยใช้ชื่อว่า `createZombie`  โดยควรสามารถรับตัวแปรได้ดังนี้ **__name_** (เป็น `string`) และ **__dna_** (เป็น `uint`) 

และปล่อยส่วน body ของฟังก์ชั่นให้ว่างไปก่อนเพราะเราจะมาเขียนในภายหลัง
