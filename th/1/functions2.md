---
title: Private / Public Functions
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

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

ใน Solidity นั้น ค่าเริ่มต้นของฟังก์ชั่นจะเป็นรูปแบบสาธารณะ หรือ `public` ซึ่งแปลว่าใครก็ตาม (หรือสัญญาอื่นๆ) จะสามารถเรียกฟังก์ชั่นใน contract ของคุณได้และยังสามารถเรียกใช้โค้ดได้อีกด้วย

จะเห็นได้ชัดว่าการตั้งฟังก์ชั่นให้เป็น public แบบนี้ก็ไม่ได้จำเป็นเสมอไป อีกทั้งยังอาจทำให้ conract ของคุณนั้นเสี่ยงต่อการถูกโจมตีได้อีกด้วย ดังนั้นเราจึงควรตั้งค่าเริ่มแรกสำหรับฟังก์ชั่นของเราให้มีรูปแบบเป็นส่วนตัว หรือ `private` จะดีกว่า  แล้วค่อยมากำหนดอีกทีว่าฟังก์ชั่นใดที่เราต้องการให้เป็น `public` 

ในกรณีที่อยากให้โลกได้รับรู้ฟังก์ชั่นนั้นๆ การประกาศค่าฟังก์ชั่นเป็น private

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

ซึ่งแปลว่ามีแค่ฟังก์ชั่นอื่นๆ ภายใน contract ของเราเท่านั้นที่จะสามารถเรียกใช้ฟังก์ชั่นนี้ได้ และเพิ่มเข้าไปใน array ที่ชื่อว่า `numbers`

จะเห็นได้ว่าเราสามารถใช้คีย์เวิร์ด `private` วางไว้ด้านหลังของชื่อฟังก์ชั่น เหมือนกับพารามิเตอร์ต่างๆ  จะสะดวกขึ้นหากเริ่มต้นชื่อฟังก์ชั่นที่เป็นชนิด private ด้วยเครื่องหมายสัญประกาศ (`_` หรือ underscore นั่นเอง)

## ทดสอบ

ฟังก์ชั่น `createZombie` ใน contract ของเรานั้นมีค่าเป็น public ซึ่งเป็นค่าเริ่มต้น ซึ่งก็แปลว่าใครก็ตามก็สามารถที่จะเรียกฟังก์ชั่นนี้ และสามารถสร้างซอมบี้ขึ้นมาภายใน contract ของเราได้!! มาทำให้ฟังก์ชั่นนี้มีค่าเป็น private กัน

1.	ปรับแต่งฟังก์ชั่น `createZombie` ให้มีค่าเป็น private function และอย่าลืมการตั้งชื่อฟังก์ชั่นที่เป็นprivate ให้มีการนำหน้าชื่อฟังก์ชั่นด้วยเครื่องหมายสัญประกาศนะ!
