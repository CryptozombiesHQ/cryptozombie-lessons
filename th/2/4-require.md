---
title: Require
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
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
              // เริ่มที่ตรงนี้
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
---

ในบทแรกเราได้ทำให้ผู้ใช้สามารถสร้างซอมบี้ขึ้นมาจากการเรียกใช้ฟังก์ชั่น  `createPseudoRandomZombie` และใส่ชื่อซอมบี้ลงไป อย่างไรก็ตาม เกมนี้จะไม่สนุกเลยหากผู้ใช้สามารถเรียกใช้ฟังก์ชั่นได้เรื่อย ๆ แล้วสร้างซอมบี้จำนวนมากในคราวเดียวขึ้นในกองทัพ

มาทำให้ผู้เล่นสามารถเรียกฟังก์ชั่นได้เพียงแค่รอบเดียวกันเถอะ เพราะจะส่งผลให้ผู้เล่นสร้างได้เพียงซอมบี้ตัวแรกเริ่ม แค่ในตอนแรกที่เข้าเล่นเกม

เราจะต้องใช้วิธีการเช่นใดที่สามารถทำให้ฟังก์ชั่นนี้ถูกเรียกได้เพียงครั้งเดียวต่อผู้เล่นหนึ่งคนกันนะ? 

เราจะใช้ `require`  ซึ่ง `require` จะทำให้ฟังก์ชั่นมีการแสดง error และไม่ประมวลผลออกมาหากมีบางเงื่อนไขไม่ถูกต้อง:

```
function sayHiToVitalik(string _name) public returns (string) {
  // เปรียบเทียบว่าหาก _name เท่ากับ "Vitalik" จะแสดง 
  //error ออกมาและออกจากฟังก์ชั่นหากเงื่อนไขไม่ใช่ true
  // (Side note: Solidity ไม่มีการเปรียบเทียบ native string เราจึงต้อง
  // เปรียบเทียบ keccak256 hash ของมันเพื่อดูว่าข้อมูลชนิด strings 
  //มีค่าตรงกันหรือไม่)
  require(keccak256(_name) == keccak256("Vitalik"));
  // หากเงื่อนไขมีค่าเป็น true ก็จะเข้าสู่ฟังก์ชั่น:
  return "Hi!";
}
```

หากเรียกฟังก์ชั่นด้วย `sayHiToVitalik("Vitalik")` จะมีการแสดงผลว่า "Hi!" แต่การมีการเรียกใช้ด้วย input นอกเหนือจากนี้จะแสดง error ออกมาและไม่มีการประมวลโค้ด

ดังนั้น `require` ถือเป็นสิ่งสำคัญในการตรวจสอบเงื่อนไขต่าง ๆ ที่จะต้องมีค่าเป็น true ก่อนที่จะรันฟังก์ชั่นใด ๆ 

# มาลองทดสอบกัน

เกมซอมบี้ของเรานั้นไม่ต้องการให้ผู้ใช้สามารถสร้างซอมบี้ไปเรื่อย ๆ โดยไม่ที่สิ้นสุดจากการเรียกใช้ฟังก์ชั่น `createPseudoRandomZombie` ไปเรื่อย ๆ — เพราะจะทำให้เกมไม่สนุกแน่นอน

มาใช้คำสั่ง `require` เพื่อทำให้แน่ใจได้ว่าฟังก์ชั่นนี้จะถูกเรียกโดยผู้เล่น 1 คน เพียงแค่รอบเดียวในตอนที่เข้าเล่นเกมครั้งแรก

1. ใส่ statement `require` ที่ด้านหน้าของฟังก์ชั่น `createPseudoRandomZombie`โดยฟังก์ชั่นนี้จะต้องมีการตรวจสอบเพื่อความแน่ใจว่า `ownerZombieCount[msg.sender]` จะมีค่าเท่ากับ `0` และจะแสดง error หากไม่เป็นเช่นนั้น

> Note: ใน Solidity จะไม่ให้ความสำคัญกับลำดับของคำสั่งว่าอะไรต้องมาก่อน อย่างไรก็ตาม โปรแกรมตรวจสอบความถูกต้องของเรานั้นค่อนข้างไม่ซับซ้อน จึงรับคำตอบที่ถูกต้องเพียงค่าเดียว ซึ่งก็คือต้องเอา `ownerZombieCount[msg.sender]` ขึ้นมานำหน้าก่อนเท่านั้น
