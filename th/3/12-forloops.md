---
title: เรื่อง Loops
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // เริ่มที่ตรงนี้
            return result;
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
      "zombiefactory.sol": |
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
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

บทที่แล้วเราได้กล่าวถึงการที่ต้องใช้ลูป `for` ในบางครั้งเพื่อสร้าง content ของ array ภายในฟังก์ชั่น function แทนที่จะเพียงแค่บันทึก array นั้นลงในหน่วยจัดเก็บข้อมูล

มาดูเหตุผลของมันกัน

สำหรับฟังก์ชั่น `getZombiesByOwner` การอิมพลีเมนท์แบบทื่อๆ จะเป็นเพียงการบรรจุ`mapping` ของเจ้าของลงไปยังกองทัพซอมบี้ ภายใน contract `ZombieFactory` :

```
mapping (address => uint[]) public ownerToZombies
```

ดังนั้นทุกครั้งที่เราสร้างซอมบี้ขึ้นมาใหม่ เราก็เพียงแค่ใช้ `ownerToZombies[owner].push(zombieId)` เพื่อเพิ่มมันลงไปใน array ซอมบี้ของเจ้าของนี้ และ `getZombiesByOwner` ก็จะเป็นฟังก์ชั่นที่ค่อนข้างตรงไปตรงมาอย่างมาก:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### ปัญหาของวิธีนี้

วิธีนี้น่านำมาใช้เพราะความง่ายของมัน แต่ว่าถ้ามาดูให้ดีๆ ถึงสิ่งที่จะตามมาถ้าเราได้มีการเพิ่มฟังก์ชั่น เพื่อโอนซอมบี้จากผู้ใช้หนึ่งไปยังอีกผู้ใช้หนึ่งดู (ซึ่งเราก็จะมาเพิ่มฟังก์ชั่นนี้จริงๆ ในบทเรียนต่อไป!)

ฟังก์ชั่นที่เอาไว้ transfer จำเป็นที่จะต้อง:
1. Push ซอมบี้เข้าไปยัง array `ownerToZombies` ของผู้ใช้คนใหม่
2. ลบซอมบี้นั้นออกมาจาก array`ownerToZombies` ของผู้ใช้เดิม
3. เลื่อนซอมบี้ทุกตัวใน array ของผู้ใช้เดิม 1 ตำแหน่งเพื่อไม่ให้เกิดช่องว่าง และจะต้อง
4. ลดความยาวของ array ลง 1 หน่วย

โดยในขั้นตอนที่ 3 นับว่าจะต้องใช้ gas ในปริมาณที่มากที่สุด เพราะเราต้องมาทำการเขียนซอมบี้ทุกตัวที่มีการเลื่อนตำแหน่ง ถ้าหากว่าผู้ใช้มีซอมบี้ 20 และได้ขายตัวแรกไป เราก็จะต้องมาทำการเขียน 19 ครั้งเพื่อรักษาตำแหน่งใน array เอาไว้

เมื่อการเขียนลงบนหน่วยเก็บข้อมูลนั้นเป็น operation ที่แพงที่สุดใน Solidity การเรียกใช้ฟังก์ชั่น transfer นี้จึงแพงมากขึ้นไปอีก และที่แย่ไปกว่านั้นก็คืออาจจะต้องเสียปริมาณ gas ที่แตกต่างกันไปในแต่ละครั้งที่มีการเรียกใช้ โดยขึ้นอยู่กับจำนวนของซอมบี้ที่ผู้ใช้นั้นมีและ index ของซอมบี้ที่ถูกนำไปโอน ดังนั้นผู้ใช้ก็จะไม่มีทางรู้ถึงปริมาณ gas ที่ต้องส่งได้เลย

> Note: แน่นอนว่าเราสามารถนำเอาซอมบี้ตัวสุดท้ายใน array มาแปะลงในช่องว่างได้เพื่อลดความยาวของ array ลง 1 หน่วย แต่วิธีนี้ก็จะทำให้ลำดับของกองทัพซอมบี้มีการเปลี่ยนแปลงตลอดทุกครั้งที่มีการย้ายโอน

เมื่อฟังก์ชั่น `view` ไม่ทำให้เสีย gas เมื่อถูกเรียกจากภายนอก เราจึงสามารถใช้ for-loop ภายใน `getZombiesByOwner` เพื่อทำ array ซอมบี้ขึ้นซ้ำๆ และสร้าง array ของซอมบี้ที่ขึ้นอยู่กับเจ้าของหนึ่งๆ  ดังนั้นฟังก์ชั่น `transfer` ของเราจะถูกลงอย่างมาก เมื่อเราไม่จำเป็นต้องทำการจัดลำดับ array ใหม่ภายในหน่วยจัดเก็บข้อมูล นอกจากนี้ยังค่อนข้างทำให้การนับมีความง่ายขึ้น(counter-intuitively)และถูกลงอีกด้วยในวิธีนี้

## การใช้ loop `for`

Syntax ของ loops `for` ใน Solidity ก็จะคล้าย ๆ กับใน JavaScript

มาดูตัวอย่างในการทำ array ของเลขคู่กันเลย:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // คอยเช็คค่า index ใน array ใหม่:
  uint counter = 0;
  // ทำซ้ำ 1 ถึง 10 ครั้งด้วย for-loop:
  for (uint i = 1; i <= 10; i++) {
    // ถ้าหาก `i` เป็นเลขคู่...
    if (i % 2 == 0) {
      // เพิ่มลงใน array
      evens[counter] = i;
      // เลื่อน counter ไปยัง index ถัดไปที่ว่างใน `evens`:
      counter++;
    }
  }
  return evens;
}
```

ฟังก์ชั่นนี้จะทำการรีเทิร์น array ที่ประกอบไปด้วย `[2, 4, 6, 8, 10]`

## มาทดสอบกันดู

มาทำฟังก์ชั่น `getZombiesByOwner` ให้เสร็จสมบูรณ์โดยการเขียน `for` loop ที่จะย้ำการกระทำต่อซอมบี้ทุกตัวใน DApp ของเรา เปรียบเทียบเจ้าของของมันเพื่อดูว่าตรงกับใครบ้าง และ push ลงไปยัง array  `result` ก่อนที่จะรีเทิร์นมันออกมา

1. ประกาศข้อมูล `uint` ที่มีชื่อว่า `counter` และตั้งค่าให้เท่ากับ `0` เราจะมาใช้ตัวแปรนี้ในการดูว่าถึง index ไหนแล้วภายใน array `result` ของเรา

2. ประกาศ `for` loop ที่เริ่มจาก `uint i = 0` ไปจนถึง `i < zombies.length` นี่จะทำให้เกิดการย้ำการเลือกซอมบี้ทุกตัวใน array

3. ภายใน `for` loop สร้าง statement `if` ขึ้นมาเพื่อใช้ในการเช็คว่า `zombieToOwner[i]` นั้นเท่ากับ `_owner` จะเป็นการเปรียบเทียบ 2 address เข้าด้วยกันเพื่อดูว่ามีคู่ที่ตรงหรือไม่

4. ภายใน `if` statement:
   1. เพิ่ม ID ของซอมบี้ลงใน array `result` โดยการตั้งค่า `result[counter]` ให้เท่ากับ `i`.
   2. เพิ่ม `counter` ขึ้น 1 ขั้น (ให้กลับไปดูตัวอย่างของ `for` loop ทางด้านบน).

แค่นี้เอง — ตอนนี้ฟังก์ชั่นก็จะสามารถรีเทิร์นซอมบี้ทุกตัวที่เป็นของ `_owner` ได้โดยไม่ต้องเสีย gas ใดๆ
