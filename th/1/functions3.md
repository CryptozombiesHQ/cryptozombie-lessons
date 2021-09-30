---
title: More on Functions
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {

          }

      }
---

ในบทนี้เราจะมาพูดถึงฟังก์ชั่น **_return values_** และ การเข้าถึงฟังก์ชั่น (function modifiers)

## การรีเทิร์นค่าต่างๆ

ในการที่จะรีเทิร์นค่าต่างๆออกมาจากฟังก์ชั่นจะมีการประกาศค่าที่หน้าตาดังนี้

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

โดยในSolidityนั้น การประกาศค่าจะต้องมีชนิดข้อมูลที่รีเทิร์นได้ (ในกรณีนี้ก็คือข้อมูลชนิด `string`)

## การเข้าถึงฟังก์ชั่น 

ในตัวอย่างของฟังก์ชั่นด้านบนนั้นจะไม่มีการเปลี่ยนค่าสถานะใดๆใน Solidity ยกตัวอย่างเช่น ค่าต่างๆจะไม่มีการเปลี่ยนแปลง หรือไม่มีการเขียนค่าใหม่ใดๆ ลงไป 

ทำให้ในกรณีนี้เราสามารถประกาศค่าของฟังก์ชั่นนี้ให้เป็น **_view_** ซึ่งก็หมายถึงฟังก์ชั่นนี้สามารถที่จะดูได้แต่ไม่สามารถเข้าไปปรับเปลี่ยนค่าต่างๆภายในได้:

```
function sayHello() public view returns (string) {
```

นอกจากนี้ใน Solidity ยังมีฟังชั่น **_pure_** หมายถึงเราไม่สามารถแม้แต่จะเข้าถึงข้อมูลใดๆในแอพพลิเคชั่นนี้ได้ จะมีหน้าตาดังต่อไปนี้:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

ฟังก์ชั่นนี้จะไม่สามารถแม้แต่อ่านค่าจากสถานะของแอพพลิเคชั่นได้ นั่นก็คือมันจะรีเทิร์นค่าก็ต่อเมื่อมีพารามีเตอร์ของฟังก์ชั่นเข้ามาเท่านั้น ทำให้ในกรณีนี้เราจะต้องประกาศค่าของฟังก์ชั่นเป็น **_pure_**

> โน้ต : เราอาจจะจำไม่ได้ว่าเมื่อไหร่ถึงจะต้องใส่ค่าของฟังก์ชั่นเป็น pure/view แต่โชคดีที่คอมไพล์เลอร์ของSolidity นั้นสามารถแจ้งเตือนคุณได้เสมอว่า modifier ชนิดใดที่คุณควรจะใช้ สำหรับฟังก์ชั่นที่ได้สร้างขึ้นมา

# ทดสอบ

ตอนนี้เราต้องการฟังก์ชั่นตัวช่วยที่จะสร้างเลข DNA แบบสุ่มขึ้นมาจากข้อมูลชนิด string 

1.	สร้างฟังก์ชั่นชนิด `private` ขึ้นโดยใช้ชื่อว่า `_generatePseudoRandomDna`  ซึ่งฟังก์ชั่นนี้ต้องการพารามิเตอร์ชื่อว่า `_str` (เป็น `string`) และมีการรีเทิร์นค่าออกมาเป็นข้อมูลชนิด `uint`

2.	ในฟังก์ชั่นนี้จะสามารถดูตัวแปรบางตัวใน contract ของเราได้ แต่ไม่สามารถที่จะเปลี่ยนแปลงค่าอะไรใดๆ ได้ ดังนั้นฟังก์ชั่นนี้จะมีค่าเป็น `view`

3.	ตอนนี้ปล่อยส่วน body ของฟังก์ชั่นให้ยังโล่งไปก่อน เพราะเราจะมาใส่ในภายหลัง
