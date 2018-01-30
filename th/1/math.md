---
title: Math Operations การดำเนินการทางคณิตศาสตร์
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //เริ่มที่ตรงนี้

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

คณิตศาสตร์ใน Solidity นั้นค่อนข้างที่จะตรงตัว โดยโอเปอร์เรชั่นด้านล่างนี้จะเป็นได้ว่าจะคล้ายๆกับในภาษาโปรแกรมทั่วๆ ไป :

* Addition (การบวก): `x + y`
* Subtraction (การลบ): `x - y`,
* Multiplication (การคูณ): `x * y`
* Division (การหาร): `x / y`
* Modulus / remainder (การหารเอาเศษ): `x % y`  (ตัวอย่างเช่น`13 % 5` จะได้ `3` ออกมาเป็นเศษและคำตอบของโอเปอร์เรชั่นนี้)_

นอกจากนี้ Solidity ยังรองรับ **_exponential operator_**  อีกด้วย (เช่น x ยกกำลังy ,x^y):

```
uint x = 5 ** 2; // เท่ากับ 5^2 = 25
```

# ทดสอบ

เพื่อทำให้มั่นใจว่า DNA ซอมบี้ของเรานั้นจะมีความยาวแค่ 16 ตัว ลองมาทำการให้ `uint` มีค่าเท่ากับ 10^16 วิธีนี้จะทำให้เราสามารถนำ Modulus operator `%` มาใช้ทำให้ข้อมูลสั้นลงเป็น 16 ตัวได้

1. สร้างข้อมูลชนิด `uint` โดยใช้ชื่อว่า `dnaModulus` และกำหนดค่าให้เท่ากับ **10ยกกำลังด้วย `dnaDigits`**

