---
title: การสร้างอีเวนท์
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // เราจะทำการประกาศอีเวนท์ตรงนี้

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // and fire it here
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
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

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

contract ของเราก็จะใกล้เสร็จแล้ว จนถึงตอนนี้ก็ได้ถึงเวลาของการเพิ่ม **_event_** เข้าไป

**_Events_** คือวิธีหนึ่งสำหรับ contract ของเราที่จะสามารถสื่อสารได้ว่า มีบางสิ่งเกิดขึ้นบนบล็อคเชนของด้านหน้าแอพพลิเคชั่นของเรา (front-end) ซึ่งจะสามารถถูกฟัง (‘listening’) สำหรับบางเหตุการณ์และอาจจะมีการกำหนดให้สร้าง action ขึ้นมาเพื่อนรองรับอีเว้นท์ที่เกิดขึ้น

ตัวอย่าง:

```
// ประกาศอีเว้นท์
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // สร้าง event ขึ้นมาเพื่อให้แอพพลิเคชั่นรู้ว่าฟังก์ชั่นได้ถูกเรียกแล้ว:
  IntegersAdded(_x, _y, result);
  return result;
}
```

ด้านหน้าแอพพลิเคชั่นของคุณในตอนนี้ก็จะสามารถรับฟังอีเว้นท์ที่จะเกิดได้แล้ว ส่วนใน JavaScript การเขียนโค้ดจะหน้าตาดังนี้ :

```
YourContract.IntegersAdded(function(error, result) { 
  // ทำบางอย่างกับ result
}
```

## ทดสอบ

เราต้องการ event ที่สามารถบอก front-end รู้ทุกๆ ครั้งที่มีการสร้างซอมบี้ใหม่ขึ้นมา เพื่อให้แอพพลิเคชั่นของเราแสดงผลออกมาได้

1.	ประกาศ `event` โดยใช้ชื่อว่า `NewZombie`  ซึ่งควรสามารถใส่ค่า `zombieId`(เป็น `uint`), `name` (เป็น `string`), และ `dna` (เป็น `uint`)

2.	ปรับแต่งฟังก์ชั่น `_createZombie` เพื่อให้สามารถเตือนอีเว้นท์ `NewZombie` หลังจากเพิ่มซอมบี้ใหม่ เข้าไปใน array `zombies`

3.	นอกจากนี้คุณยังต้องใช้คำสั่ง  `id` `array.push()` ของซอมบี้ โดยให้ return ค่าออกมาเป็นข้อมูลชนิด `uint` ซึ่งจะเป็นความยาวของ array ใหม่หลังจากมีการเพิ่มซอมบี้เข้าไปแล้ว และเนื่องจากข้อมูลตัวแรกใน array มี index 0 ดังนั้น `array.push()-1` ก็จะเป็น index ของซอมบี้ที่เราเพิ่งเพิ่มเข้าไป โดยจะทำการเก็บค่า `zombies.push()-1` ในข้อมูลชนิด `uint` และเรียกว่า `id` เพื่อที่จะสามารถนำไปใช้ต่อในอีเว้นท์ชื่อ `NewZombie` ในบรรทัดต่อไป
