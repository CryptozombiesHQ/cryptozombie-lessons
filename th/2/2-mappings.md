---
title: Mappings and Addresses
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

          // ประกาศ mapping ตรงนี้

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
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
              NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

ถึงเวลาในการสร้างเกมส์แบบ multi-player ของเรา โดยการเพิ่มเจ้าของให้กับซอมบี้ที่อยู่ใน database

ในการที่จะทำเช่นนั้นได้ เราต้องใช้ข้อมูลอยู่ 2 ชนิด ได้แก่ `mapping` และ `address`.

## Addresses

blockchain ของ Ethereum ถูกสร้างขึ้นมาจาก **_accounts_** ซึ่งสามารถเปรียบเทียบได้กับบัญชีธนาคารที่เราใช้กันทั่วๆ ไป บัญชีนี้จะมียอดของ **_Ether_** (เป็นค่าเงินที่ใช้ภายใน blockchain บน Ethereum)และสามารถแลกเปลี่ยนการใช้จ่าย Ether payment ไปยังบัญชีอื่น ๆ ได้อีกด้วย ซึ่งเหมือนกับการโอนเงินผ่านบัญชีธนาคารไปยังบัญชีของผู้อื่นในโลกความเป็นจริงนั่นเอง

แต่ละบัญชีจะมี `address` ที่เปรียบเสมือนกับเลขบัญชีธนาคาร โดยจะมีความจำเพาะต่อบัญชีหนึ่งบัญชี เท่านั้น หน้าตาจะเป็นดังนี้้:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(address นี้เป็นของทีม CryptoZombies หากชอบบทเรียน CryptoZombies ก็สามารถส่ง Ether มาให้เราได้! 😉 )

โดยเราจะลงรายละเอียดเกี่ยวกับ addresses ในบทหลังจากนี้ ณ ตอนนี้ขอเพียงแค่เข้าใจว่า **address จะจำเพาะเจาะจงต่อผู้ใช้เพียงคนเดียวเท่านั้น** (หรือว่าเป็น smart contract นั่นเอง).

จึงสามารถใช้ address เป็น unique ID สำหรับเจ้าของซอมบี้ของเราได้ เมื่อผู้ใช้สร้างซอมบี้ตัวใหม่ขึ้นจากการเล่นแอพพลิคเคชั่นของเรา ซอมบี้เหล่านั้นจะถูกสร้างความเป็นเจ้าของ (ownership) ต่อ Ethereum address ซึ่งเรียกอีกอย่างหนึ่งว่าฟังก์ชั่น

## Mappings

ในบทเรียนที่ 1 เราให้ความสนใจกับ **_structs_** และ **_arrays_** **_Mappings_** เป็นอีกทางหนึ่งในการจัดเก็บข้อมูลที่เตรียมไว้ลงใน Solidity

การให้นิยาม `mapping` จะมีหน้าตาดังนี้:

```
// สำหรับแอพพลิเคชั่นทางด้านการเงิน การเก็บข้อมูลชนิด uint ที่เก็บยอดคงเหลื่อในบัญชีของผู้ใช้:
mapping (address => uint) public accountBalance;
// หรือสามารถใช้ในการเก็บ / แสดงผล username ที่ขึ้นอยู่กับ userId
mapping (uint => string) userIdToName;
```

mapping เป็นหัวใจสำคัญหลัก ๆ ในการเก็บหรือแสดงผลของข้อมูล ในตัวอย่างแรก จะมีส่วนสำคัญ (key) คือ `address` ซึ่งมีชนิดเป็น `uint`แล key ในตัวอย่างที่สองได้แก่  `uint` ซึ่งมีชนิดเป็น `string`

# มาทดสอบกัน

ในการเก็บค่าความเป็นเจ้าของแก่ซอมบี้ จะต้องใช้ mappings 2 อย่าง: อันแรกสำหรับการติดตามค่า address ที่จำเพาะต่อซอมบี้ และอันที่สองไว้ใช้ติดตามค่าจำนวนของซอมบี้ที่เจ้าของมี
1. สร้าง mapping ที่มีชื่อว่า `zombieToOwner`ซึ่งมี key เป็น `uint` (ซึ่งจะจัดเก็บและแสดงผลซอมบี้ขึ้นอยู่กับค่า id ของมัน) โดยจะมีค่าเป็น`address` เราจะทำให้ mapping นี้มีค่าการเข้าถึงเป็นชนิด `public`.

2. สร้าง mapping ที่มีชื่อว่า `ownerZombieCount` ซึ่งมี key เป็น `address` โดยจะมีค่าเป็น `uint`
