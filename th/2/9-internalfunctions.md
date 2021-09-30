---
title: เนื้อหาเรื่อง Function Visibility เพิ่มเติม
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
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

            // แก้ไขความหมายของฟังก์ชั่นได้ที่ด้านล่าง
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
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

          function _createZombie(string _name, uint _dna) internal {
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

**โค้ดในบทที่แล้วของเรามีความผิดพลาด!**

เมื่อเราพยายามที่จะคอมไพล์มันออกมา จะเห็นได้ว่าจะเกิด error ขึ้น

สาเหตุคือเมื่อเราพยายามที่จะเรียกฟังก์ชั่น `_createZombie` จากภายใน `ZombieFeeding` แต่เนื่องจากฟังก์ชั่น `_createZombie` นั้นมีค่าเป็น `private` ซึ่งอยู่ภายใน `ZombieFactory` แปลว่า contract ใดๆ ที่มีการ inherit มาจาก `ZombieFactory` จะไม่สามารถเข้าถึงได้

## Internal และ External

นอกจาก `public` และ `private` Solidity ยังมีค่าการมองเห็น (visibility) อีก 2 ค่า: `internal` และ `external`

`internal` เหมือนกับ `private` เว้นเพียงแต่มันยังสามารถถูกเข้าถึงจาก contract อื่น ๆ ที่มีการ inherit มาจาก contract ปัจจุบัน **(เอ... เหมือนจะเป็นสิ่งที่เรากำลังต้องการอยู่ด้วยสิ!)**.

`external` นั้นคล้ายกับ `public`เพียงแต่ว่าฟังก์ชั่นต่างๆ จะสามารถถูกเรียกได้เฉพาะจากด้านนอกของ contract เท่านั้น — ฟังก์ชั่นเหล่านี้ไม่สามารถถูกเรียกโดยฟังก์ชั่นอื่นๆ ที่อยู่ภายใน contract ซึ่งจะมาคุยกันว่ากรณีใดที่จะต้องใช้ `external` หรือ `public` ในภายหลัง

ในการประกาศฟังก์ชั่น `internal` หรือ `external`  syntax ที่ใช้จะเหมือนกันกับใน `private` และ `public`ทุกประการ:

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // We can call this here because it's internal
    eat();
  }
}
```

# มาทดสอบกันดูอีก

1. เปลี่ยน `_createZombie()` จาก `private` ให้เป็น `internal` แทน เพื่อให้ contract อื่น ๆ ของเราสามารถเข้าถึงฟังก์ชั่นนี้ได้

  ยังสามารถไปเปิด tab `zombiefactory.sol`ได้เหมือนเคย หากมีข้อสงสัย
