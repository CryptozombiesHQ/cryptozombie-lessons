---
title: State Variables & Integers
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

ยอดเยี่ยม! ตอนนี้เราก็จะได้ส่วน shell ของ contractแล้ว ต่อจากนี้เราก็จะมาเรียนรู้กันว่า Solidity จะจัดการกับตัวแปรต่างๆ ได้อย่างไรบ้าง

**_State variables_** จะถูกจัดเก็บถาวรลงในส่วนจัดเก็บของ contract  ซึ่งนั่นก็หมายความว่ามันก็จะถูกเขียนลงในบล็อคเชนของ Ethereum เช่นกัน

##### ตัวอย่าง:
```
contract Example {
  // ในส่วนนี้จะถูกจัดเก็บถาวรลงในบล็อคเชน
  uint myUnsignedInteger = 100;
}
```

ในตัวอย่างของ contract  เราจะสร้าง `uint` โดยใช้ชื่อว่า `myUnsignedInteger` และตั้งให้มีค่าเท่ากับ 100

## Unsigned Integers: `uint`

ข้อมูลชนิด `uint` หรือ unsigned integer มีความหมายว่า**ค่าของมันจะต้องไม่ติดลบ**  ซึ่งนอกจากนี้ก็ยังมีข้อมูลชนิด int สำหรับ signed integers เช่นกัน

> โน้ต: ใน Solidity นั้น `uint` จริงๆ แล้วก็คือนามแฝงสำหรับ `uint256` หรือ 256-bit unsigned integer นั่นเอง คุณสามารถประกาศข้อมูล uints เป็นจำนวนบิทที่น้อยกว่าได้ เช่น `uint8`, `uint16`, `uint32` เป็นต้น แต่โดยปกติแล้วก็จะใช้แค่ `uint` เท่านั้น เว้นเพียงแต่ในบางกรณีซึ่งเราจะกล่าวในบทต่อๆ ไป

# ทดสอบ

Zombie DNA ของเรานั้นจะถูกกำหนดโดยตัวเลขจำนวน 16 ตัว

ประกาศข้อมูลชนิด `uint` โดยใช้ชื่อว่า `dnaDigits` และตั้งให้มีค่าเท่ากับ `16`
