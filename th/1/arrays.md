---
title: Arrays
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
              string name;
              uint dna;
          }

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

          Zombie[] public zombies;

      }
---

เมื่อคุณต้องการชุดข้อมูลของอะไรบางอย่าง คุณสามารถใช้ **_array_** มาช่วยในการจัดการได้ ซึ่งใน Solidity นั้นเราจะมี arrays อยู่2 ชนิด ได้แก่: **_fixed_** arrays และ **_dynamic_** arrays:

```
// fixed Array จำกัดความยาวให้มีแค่2 elements :
uint[2] fixedArray;
// หรือจะเป็น fixed Array ที่สามารถมีข้อมูลชนิด Strings ได้ 5 ตัวก็จะเขียนได้ว่า:
string[5] stringArray ;
// Dynamic Array – จะไม่จำกัดขนาดที่แน่นอน ซึ่งแปลว่า array ชนิดนี้สามารถมีขนาดเพิ่มได้เรื่อยๆ :
unit[] dynamicArray;
```

เราสามารถที่จะสร้าง array ของ **_structs_** โดยใช้ `Person`‘ struct ที่อยู่ในบทก่อนหน้าได้เลย

```
Person[]people; // แปลว่าเป็น dynamic Array ซึ่งเราสามารถเพิ่มค่าลงไปใน array ได้เรื่อยๆ
```

จำได้ไหมว่าตัวแปรที่บอกสถานะ จะต้องถูกบรรจุถาวรอยู่ใน blockchain ดังนั้นการสร้างdynamic array ของ structs ในรูปแบบนี้จะมีประโยชน์มากสำหรับการบรรจุข้อมูลต่างๆ ในสัญญา (contract) ของคุณ สามารถเทียบได้ว่าเป็นฐานข้อมูลอย่างหนึ่งก็ว่าได้

## Public Arrays 

เราสามารถประกาศ array ให้มีค่าเป็น `public` และ Solidity ก็จะสร้าง **_getter_** method ขึ้นมาโดยอัตโนมัติสำหรับ array นี้  โดยหน้าตาของ syntax จะเป็นดังต่อไปนี้: 

```
Person[]public people;
```

ทำให้ contract อื่นๆ จะสามารถอ่านค่าได้ (แต่ไม่สามารถเขียนได้) ลงใน array นี้  ดังนั้นpattern นี้จึงเหมาะสำหรับการบรรจุข้อมูลที่เป็นสาธารณะหรือว่า public ใน contract ของคุณ

# ลองมาทดสอบดู

ตอนนี้เรากำลังต้องการที่จะบรรจุค่าของกองกำลังซอมบี้ ลงในแอพพลิเคชั่นของเรา และต้องการที่จะให้จำนวนของซอมบี้ทั้งหมดนั้น ไปปรากฏอยู่ในแอพพลิเคชั่นอื่นๆ เช่นกัน ซึ่งนั่นก็แปลว่าเราต้องการให้กองกำลังของซอมบี้นั้นมีค่าเป็นสาธารณะ(public)

1. สร้าง public array ของ `Zombie` **_structs_** แล้วตั้งชื่อว่า `zombies`
