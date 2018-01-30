---
title: Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

      }
---

ในบางครั้งเราอาจจะต้องการชนิดของข้อมูลที่มีความซับซ้อนมากขึ้น โดยใน Solidity ได้เตรียมคำสั่ง **_structs_** ไว้ให้

```
struct Person {
  uint age;
  string name;
}

```

Structs จะทำให้เราสามารถสร้างชนิดข้อมูลที่มีความซับซ้อนขึ้นได้ กล่าวคือข้อมูลจะสามารถมีคุณสมบัติได้หลายแบบขึ้น

> โน้ต: เราได้ทำการแนะนำข้อมูลชนิด `string` ซึ่งใช้สำหรับข้อมูลarbitrary-length UTF-8 ยกตัวอย่างเช่น `string greeting = “Hello world!”`

# ทดสอบ

ในแอพพลิเคชั่นของเรานั้น ต้องการที่จะสร้างซอมบี้ขึ้นมาจำนวนหนึ่ง และซอมบี้ก็จะต้องมีหลายๆคุณสมบัติอีกด้วย เราจึงจะใช้กรณีนี้เป็นตัวอย่างในการใช้คำสั่ง struct

1.	สร้าง `struct` ขึ้นมาโดยใช้ชื่อว่า `Zombie`

2.	ซอมบี้ของเรานั้นจะมี struct ที่มี 2 คุณสมบัติ ได้แก่: `name` (เป็น `string`) และ `dna` (เป็น `uint`)
