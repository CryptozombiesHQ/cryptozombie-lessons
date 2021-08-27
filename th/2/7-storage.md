---
title: Storage vs. Memory
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // เริ่มที่ตรงนี้

        }
      "zombiefactory.sol": |
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
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

ใน Solidity มีพื้นที่อยู่ 2 ตำแหน่งในการจัดเก็บตัวแปรต่างๆ — ภายใน `storage` และใน `memory`

**_Storage_** หมายถึงตัวแปรที่ถูกจัดเก็บอย่างถาวรบน blokchain 
**_Memory_** หมายถึงตัวแปรที่ถูกจัดเก็บชั่วคราว และจะถูกลบออกไประหว่างที่ฟังก์ชั่นภายเรียกใช้ contract เปรียบเทียบความแตกต่างของ 2 สิ่ง ว่าเหมือนระหว่าง hard disk กับ RAM

โดยทั่วไปแล้วเราไม่จำเป็นต้องมายุ่งกับ keyword พวกนี้เนื่องจาก Solidity จะจัดการให้ตั้งแต่แรกเริ่มแล้ว โดยแรกเริ่มแล้ว State variables (ตัวแปรที่ถูกประกาศค่าจากภายนอกฟังก์ชั่น) จะอยู่ใน `storage` และถูกเขียนอย่างถาวรลงใน blockchain ในขณะที่ตัวแปรที่ถูกประกาศค่าภายในฟังก์ชั่นจะอยู่ใน `memory` และจะหายไปเมื่อการเรียกฟังก์ชั่นนั้น ๆ ได้สิ้นสุดลง

อย่างไรก็ตาม อาจมีบางกรณีที่เราจะต้องมายุ่งกับคำพวกนี้ เช่นเมื่อต้องใช้ **_structs_** และ **_arrays_** ภายในฟังก์ชั่น:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ ดูผิวเผินแล้วไม่มีอะไร แต่ Solidity จะเตือนว่าเราต้องประกาศ ณ //ตรงนี้ว่าเป็น `storage` หรือ `memory` 

    // ดังนั้นเราจึงควรประกาศด้วยคำว่า `storage` ดังต่อไปนี้:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...กรณีนี้ `mySandwich` เป็น pointer ไปยัง `sandwiches[_index]`
    // ภายใน storage และ...
    mySandwich.status = "Eaten!";
    // ...`sandwiches[_index]`จะถูกเปลี่ยนถาวรบน blockchain ณ จุดนี้

    // หากต้องการก็อปปี้ สามารถใช้คำว่า `memory` แทน:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...กรณีนี้ `anotherSandwich` จะเป็นข้อมูลก็อปปี้ของข้อมูลใน memory
    //และ ...
    anotherSandwich.status = "Eaten!";
    // ...จะเปลี่ยนแปลงตัวแปรชนิดชั่วคราวและไม่มีผลใด ๆ ต่อ `sandwiches[_index + 1]`แต่เราสามารถทำแบบนี้ได้:
    sandwiches[_index + 1] = anotherSandwich;
    // ...หากต้องการทำสำเนาของการเปลี่ยนแปลงกลับไปยังใน storage ของ blockchain
  }
}
```

ไม่ต้องกังวลใจไปหากคุณยังไม่เข้าใจแจ่มแจ้งว่าจะต้องใช้อะไรเมื่อตอนไหน — tutorial นี้จะสอนว่าเมื่อไหร่ที่จะต้องใช้ `storage` และเมื่อไหร่ต้องใช้ `memory` นอกจากนี้คอมไพล์เลอร์ของ Solidity จะเตือนเสมอว่าจะต้องใช้อะไร

ในตอนนี้ เพียงแค่นี้ก็พอแล้วที่จะทำให้เราเข้าใจว่ายังมีกรณีต่าง ๆ ที่เราต้องมาตัดสินใจว่าจะให้ข้อมูลนั้นไปอยู่บน `storage` หรือว่า `memory` กันแน่!

# มาทดสอบกันดูดีกว่า

ถึงเวลาแล้วที่จะมอบความสามารถให้ซอมบี้ของเรานั้นกินได้หลาย ๆ อย่าง!

เมื่อใดที่ซอมบี้กินสิ่งมีชีวิตเข้าไป DNA ของมันจะไปรวมกับ DNA ของเหยื่อดังกล่าวและผลิตซอมบี้ตัวใหม่ขึ้นมา

1. สร้างฟังก์ชั่นที่มีชื่อว่า `feedAndMultiply` ให้รับ parameter 2 ค่า: `_zombieId` (ชนิด `uint`) และ `_targetDna` (ชนิด `uint`) ฟังก์ชั่นนี้ควรมีค่าเป็น `public`.

2. แต่เราไม่ต้องการให้ผู้อื่นมาให้อาหารซอมบี้ของเรา! ดังนั้นในอันดับแรก ต้องทำให้แน่ใจว่าซอมบี้นี้เป็นของเราเสียก่อน โดยใส่คำสั่ง `require` เพื่อให้มั่นใจว่า `msg.sender` คือเจ้าของของซอมบี้ (คล้ายกับตอนที่ทำในฟังก์ชั่น `createPseudoRandomZombie`).

 > Note: answer-checker ของเราค่อนข้างล้าหลัง จึงควรให้ `msg.sender` มาก่อน ไม่เช่นนั้นคำตอบจะถือว่าผิด แต่ในความเป็นจริงจะเอาอะไรขึ้นก่อนก็ไม่มีปัญหาแน่นอน

3. เราจำเป็นต้องมี DNA ของซอมบี้ เพราะฉะนั้น สิ่งที่ฟังก์ชั่นของเราต้องทำต่อไปก็คือการประกาศ local `Zombie` ที่มีชื่อว่า `myZombie` (ซึ่งจะเป็น pointer ของ `storage` ) ตั้งค่าตัวแปรนี้ให้เท่ากับ index `_zombieId` ใน array ชื่อ `zombies`

ณ ตอนนี้โค้ดควรมีความยาว 4 บรรทัด โดยนับรวมแท็กปิด `}`แล้ว 

เราจะมาสร้างฟังก์ชั่นนี้ต่อในบทถัดไป
