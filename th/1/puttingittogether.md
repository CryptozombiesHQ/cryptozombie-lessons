---
title: Putting It Together นำทุกอย่างมารวมเข้าไว้ด้วยกัน
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
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
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

มาถึงตอนนี้เราก็ใกล้สำเร็จกับการสร้างตัวสุ่มซอมบี้แล้ว! มาสร้างฟังก์ชันชนิด public ที่จะรวมทุกๆ อย่างเข้าด้วยกันดีกว่า

ในตอนนี้เราก็กำลังจะสร้างฟังก์ชั่นชนิด public ที่จะรับเอาค่า input ต่างๆเช่น ชื่อซอมบี้ และใช้ชื่อซอมบี้นี้ในการสร้างซอมบี้ด้วย DNA ที่สุ่มได้มา

# ทดสอบ

1.	สร้างฟังก์ชั่นชนิด `public` โดยใช้ชื่อว่า `createPseudoRandomZombie` โดยฟังก์ชั่นนี้จะรับค่าพารามิเตอร์ชื่อว่า `_name` (เป็น `string`)  (โน้ต: ประกาศฟังก์ชั่นนี้ให้เป็นชนิด `public` ด้วยวิธีที่เหมือนกับการประกาศค่าฟังก์ชั่นในตัวอย่างก่อนหน้าให้เป็น `private`)

2.	ในบรรทัดแรกของฟังก์ชันจะต้องทำการรันฟังก์ชัน `_generatePseudoRandomDna` บนพารามิเตอร์ `_name` และเก็บค่าไว้ในรูปของ `uint` ใช้ชื่อว่า `randDna`

3.	บรรทัดที่2 ควรจะรันฟังก์ชัน `_createZombie` โดยเพิ่ม `_name` และ `_randDna` เข้าไป

4.	โค้ดควรประกอบไปด้วย4บรรทัด (รวมsyntax ปิด `}` ของฟังก์ชันแล้ว)
