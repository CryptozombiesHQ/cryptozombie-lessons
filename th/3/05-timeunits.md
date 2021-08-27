---
title: หน่วยของเวลา
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. ตั้ง `cooldownTime` ตรงนี้

            struct Zombie {
                string name;
                uint dna;
                uint32 level;
                uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                // 2. อัพเดทบรรทัดต่าง ๆ ดังนี้:
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }

        }
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev Ownable contract มี address ของ owner และได้มีฟังก์ชั่นที่ไว้ใช้ควบคุมการยืนยันตัวตนขั้นพื้นฐานเอาไว้
         * สิ่งนี้บ่งบอกถึงการนำ "user permissions"มาใช้นั่นเอง
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev constructor ประเภท ownable ได้ตั้งค่า `owner` ดั้งเดิมของ contract ไปยังบัญชีของผู้ส่ง
           * (sender account)
           */
          function Ownable() public {
            owner = msg.sender;
          }

          /**
           * @dev throwหากมีการเรียกโดยบัญชีอื่นที่ไม่ใช่ของ owner
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }

          /**
           * @dev อนุญาตให้ owner คนปัจจุบันสามารถโอนการควบคุม contract ไปยัง newOwnerได้
           * @param newOwner คือ address ที่จะเอาไว้รับ ownership ที่ถูกโอนมาให้
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./ownable.sol";

      contract ZombieFactory is Ownable {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;
          uint cooldownTime = 1 days;

          struct Zombie {
            string name;
            uint dna;
            uint32 level;
            uint32 readyTime;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) internal {
              uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
              randDna = randDna - randDna % 100;
              _createZombie(_name, randDna);
          }

      }
---

คาดว่าไม่จำเป็นต้องอธิบายถึงคุณสมบัติ `level` เท่าไหร่แล้วแล้วเนอะ เพราะมันค่อนข้างมีความหมายตรงตัวอยู่แล้ว หลังจากนี้เมื่อเราได้ทำการสร้างระบบสมรภูมิรบขึ้นมาแล้ว ซอมบี้ตัวไหนที่มีอัตราชนะสูงกว่าก็จะได้เพิ่ม level ไปเรื่อยๆ และจะได้รับความสามารถที่เพิ่มขึ้นนั่นเอง

จะมาอธิบายถึงคุณสมบัติ `readyTime` แทนดีกว่า จุดประสงค์หลักของมันคือเพื่อต้องการเพิ่ม "ช่วงเวลา cooldown" คือเป็นระยะเวลาที่ซอมบี้ต้องใช้ในการรอ หลังจากได้ทำการกินอาหารหรือว่าต่อสู้ไปแล้ว ก่อนที่จะสามารถกินได้ใหม่อีกครั้ง เพราะไม่อย่างนั้นเกมนี้คงไม่สนุกเท่าไหร่ถ้าซอมบี้จะโจมตีกี่ครั้งต่อวันก็ได้อ่ะเนอะ

ในการที่เราจะมานับช่วงเวลาที่ซอมบี้จะต้องรอก่อนที่มันจะสามารถเริ่มออกล่าได้อีกครั้ง เราสามารถที่จะใช้หน่วยเวลาของ Solidity ได้

## Time units หรือ หน่วยเวลา

Solidity ได้มีหน่วยของมันให้เราไว้จัดการในเรื่องของเวลาเอาไว้ให้แล้ว

ตัวแปร `now` จะรีเทิร์นค่า unix timestamp ณ ตอนนั้น (เป็นจำนวนของวินาทีที่ได้ผ่านไปแล้ว ตั้งแต่วันที่ 1 มกราคม 1970) ทำให้ได้ unix time เป็น`1515527488`

>Note: Unix time ตั้งแต่เดิมแล้วจะถูกเก็บไว้ในรูปของตัวเลขจำนวน 32 bit ทำให้อาจเกิดปัญหาในกรณีของ "ปีที่ 2038" เพราะว่าจะเกินขีดจำกัดที่ unix timestamp จำนวน 32 bit จะรับไหว ดังนั้นหากต้องการให้ DApp ของเราสามารถใช้งานได้จนถึงอีก 20 ปีข้างหน้า เราจำเป็นจะต้องใช้ตัวเลขจำนวน 64 bit ในการเก็บแทน — แต่นั่นก็แปลว่าผู้ใช้จะต้องเสีย gas เพิ่มขึ้นด้วยในขณะเดียวกัน เพราะงั้นก็ต้องมาตัดสินใจกันดีๆ เลยล่ะ!

Solidity ยังมีหน่วยเวลาอื่น ๆ อีกด้วย ได้แก่ `seconds`, `minutes`, `hours`, `days`, `weeks` และ `years` หน่วยเวลาเหล่านี้จะถูกแปลงตรงตัวให้เป็นตัวเลขวินาทีในรูปแบบ `uint` อธิบายให้เข้าใจง่าย ๆ ก็คือ `1 minutes` จะมีค่าเท่ากับ `60`, `1 hours` ก็คือ `3600` (60 seconds x 60 minutes), `1 days` มีค่าเท่ากับ `86400` (24 hours x 60 minutes x 60 seconds),เป็นต้น

ต่อไปนี้จะเป็นตัวอย่างว่าเราจะเอาหน่วนเวลามาใช้ให้เกิดประโยชน์ได้อย่างไรกันแล้วล่ะ:

```
uint lastUpdated;

// ให้ตั้งค่า `lastUpdated` เป็น `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// จะรีเทิร์นค่า `true` หากผ่านไปแล้ว 5 นาที หลังจากได้มีการเรียก `updateTimestamp`
// และรีเทิร์น `false` หากเวลายังผ่านไปไม่ถึง 5 นาที
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

สามารถประยุกต์ใช้หน่วยเวลาเข้ากับคุณสมบัติ `cooldown` ของเจ้าซอมบี้ได้เลยจ้า


## มาทดสอบกันได้แล้วล่ะนะ

เพิ่มช่วงเวลา cooldown เข้าไปใน DApp และกำหนดให้ซอมบี้จะต้องรอ **1 วัน** หลังจากได้จู่โจมและกินอาหารไปแล้ว ถึงจะสามารถกินต่อได้

1. ประกาศข้อมูล `uint` ชื่อว่า `cooldownTime` แล้วตั้งค่าให้เท่ากับ `1 days`. (ณ จุดนี้ต้องขออภัยสำหรับแกรมม่าร์กันสักหน่อยน้า — เพราะหากเราใช้คำว่า "1 day", มันจะรันโค้ดไม่ออกเอาน่ะสิ!)

2. หลังจากที่เราได้เพิ่มคุณสมบัติ `level`และ `readyTime` ให้กับ struct `Zombie` ในบทที่แล้ว ก็จะเป็นที่จะต้องอัพเดท `_createZombie()` ให้ใช้จำนวน argument ที่ถูกต้องเมื่อทำการสร้าง struct `Zombie` ขึ้นมาใหม่

  อัพเดทบรรทัดที่มี `zombies.push` เพื่อให้สามารถรับ argument อีก 2 ค่าได้: `1` (สำหรับ `level`) และ `uint32(now + cooldownTime)` (สำหรับ `readyTime`).

>Note: `uint32(...)` เป็นสิ่งจำเป็นเพราะ `now` จะรีเทิร์นข้อมูลชนิด `uint256` ออกมาในตอนแรกเริ่ม เราจึงต้องแปลงมันซะให้เป็น `uint32`

`now + cooldownTime` เท่ากับ unix timestamp ตอนปัจจุบัน (โดยมีหน่วยเป็นวินาที) รวมกับจำนวนของวินาทีที่ใช้ไปภายในวันนั้น — ทำให้เท่ากับ unix timestamp นับจากนี้ไปอีก 1 วัน หลังจากนั้นเลยทำให้เราสามารถเปรียบเทียบเพื่อเช็คว่า `readyTime` ของเจ้าซอมบี้ จะมากกว่า `now` หรือไม่ เพราะเราต้องดูว่าเราจะใช้ซอมบี้ได้อีกครั้งเมื่อไหร่ยังไงล่ะ!

จะมาทำการใส่ฟังก์ชั้นเพิ่มเติ่มเพื่อจำกัด action ต่าง ๆ ซึ่งขึ้นอยู่กับ `readyTime` ในบทต่อไป
