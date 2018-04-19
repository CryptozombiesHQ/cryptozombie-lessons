---
title: ทำงานกับ Structs และ Arrays
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
              // เริ่มที่ตรงนี้
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---
### การสร้าง Structs ใหม่
ย
ังจำ struct ของเราที่ชื่อว่า `Person`
ในตัวอย่างก่อนหน้าได้มั้ย?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

ตอนนี้เราก็จะมาศึกษาว่าจะสามารถสร้าง `Person`  ขึ้นมาใหม่ได้อย่างไร และจะเพิ่มลงไปใน array ที่ชื่อว่า `people` ได้อย่างไร

```
// สร้างPersonขึ้นมาใหม่:
Person satoshi = Person(172, "Satoshi");

// เพิ่ม element Person ที่เราสร้างขึ้นนั้นลงไปใน Array:
people.push(satoshi);
```

โดยเราสามาถนำมารวมกันให้เป็นคำสั่งภายในบรรทัดเดียว เพื่อความเรียบร้อยของโค้ดได้อีกด้วย:

```
people.push(Person(16, "Vitalik"));
```

สังเกตได้ว่า  `array.push()` จะเป็นคำสั่งที่เพิ่มข้อมูลลงในส่วน **ท้าย** ของ array ดังนั้นก็จะทำให้ข้อมูลที่อยู่ใน array นั้นก็จะถูกเรียงตามลำดับที่เราเพิ่มเข้าไป ดูได้จากตัวอย่างดังต่อไปนี้

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// ซึ่งจะทำให้ numbersในตอนนี้มีค่า [5, 10, 15]
```

# มาลองทดสอบ

เริ่มจากการให้ ฟังก์ชั่น createZombie ของเราทำอะไรบางอย่างดู!

1.	เติม function ในส่วนของ body โดยทำให้มันสร้าง new `Zombie` ใหม่ขึ้นมา จากนั้นก็ให้เพิ่มลงไปยัง array ที่ชื่อว่า `zombies` โดย `name` และ `dna` ที่เป็นข้อมูลของ new ‘Zombie’ นั้นควรถูกนำมาจาก function arguments
2.	ทำโค้ดให้อยู่ในบรรทัดเดียวเพื่อความเรียบร้อย
