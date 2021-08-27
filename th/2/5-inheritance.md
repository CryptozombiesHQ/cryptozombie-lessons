---
title: Inheritance
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // เริ่มที่ตรงนี้

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

      contract ZombieFeeding is ZombieFactory {

      }

---

ณ ตอนนี้โค้ดเกมของเราเริ่มมีความยาวในระดับหนึ่งแล้ว แทนที่เราจะบรรจุโค้ดยาวเหยียดลงใน contract เดียว การแบ่งท่อนโค้ดเพื่อบรรจุลงในหลายๆ contract ก็สามารถทำได้ โดยจะไม่บิดเบือนความหมายใดๆ และยังเป็นการจัดการโค้ดที่ดีอีกด้วย

ยังมี contract ที่เป็น feature หนึ่งใน Solidity ซึ่งช่วยในการจัดการก็คือ **_inheritance_**:

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

`BabyDoge` **_inherits_** มาจาก `Doge` หมายถึงหากเรามีการ compile และเรียก `BabyDoge` ขึ้น จะสามารถเข้าถึงได้ทั้งฟังก์ชั่น `catchphrase()` และ `anotherCatchphrase()` (และยังสามารถเข้าถึงฟังก์ชั่นชนิด public ใดๆ ก็ตามที่เราอาจเพิ่มเข้าไปใน `Doge`).

วิธีนี้สามารถนำไปใช้ใน logical inheritance (อย่างเช่นใช้กับ subclass ว่า `Cat` นั้นเป็น `Animal`) นอกจากนี้ยังสามาถใช้เพื่อการจัดการโค้ดโดยการจัดกลุ่มให้ logic ที่มีความคล้ายคลึงกันให้อยู่ด้วยกันเป็นกลุ่มๆ

# มาทดสอบกัน

ในบทถัดไปเราจะทำการเพิ่มคุณสมบัติของซอมบี้ให้มันสามารถกินได้หลายสิ่งมากขึ้น มาใส่ logic นี้ลงไปยัง class ที่มีการรับ inherit ทุก method มาจาก `ZombieFactory`

1. สร้าง contract ชื่อว่า `ZombieFeeding` ให้อยู่ด้านล่าง `ZombieFactory` โดย contract นี้จะต้องรับ inherit มาจาก contract ชื่อ `ZombieFactory`
