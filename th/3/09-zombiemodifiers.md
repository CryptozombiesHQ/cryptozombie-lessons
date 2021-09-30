---
title: Zombie Modifiers
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

          // เริ่มที่ตรงนี้

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

      }
---

ได้เวลาใช้ modifier `aboveLevel` ในการสร้างฟังก์ชั่นกันแล้ว

เกมนี้จะต้องมีแรงจูงใจบางอย่างที่จะทำให้ผู้เล่นอยากให้ซอมบี้ของตัวเองมีเลเวลเพิ่มขึ้น:

- สำหรับซอมบี้ที่มีเลเวล 2 ขึ้นไป ผู้เล่นจะสามารถเปลี่ยนชื่อของตัวเองได้

- สำหรับซอมบี้ที่มีเลเวล 20 ขึ้นไป ผู้เล่นจะสามารถปรับแต่ง DNA ได้

เราจะทำการอิมพลีเมนท์ฟังก์ชั่นด้านล่าง โดยจะให้ตัวอย่างโค้ดจากในบทที่แล้วไว้เป็นตัวอย่าง:

```
// mapping ที่จะเอาไว้เก็บอายุของผู้ใช้:
mapping (uint => uint) public age;

// ต้องการให้ผู้ใช้มีอายุมากกว่าอายุที่ได้กำหนดไว้:
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

// ต้องอายุ 16 ปีขึ้นไปถึงจะขับรถได้ (ในอเมริกา)
function driveCar(uint _userId) public olderThan(16, _userId) {
  // ใส่ function logic บางอย่างลงไป
}
```

## ได้เวลาทดสอบแล้ว

1. สร้างฟังก์ชั่นชื่อว่า `changeName` ที่จะรับ 2 argument: `_zombieId` (ชนิด `uint`) และ `_newName` (ชนิด `string`) และทำให้มันเป็นแบบ `external`ฟังก์ชั่นนี้ควรมี modifier ชื่อ `aboveLevel` และควรใส่ค่า  `2` ลงในส่วนของพารามิเตอร์ `_level` (อย่าลืมใส่พารามิเตอร์ `_zombieId`ด้วย)

2. ในฟังก์ชั่นนี้ ก่อนอื่นเราจะต้องทำการยืนยันความถูกต้องว่า `msg.sender` มีค่าเท่ากับ `zombieToOwner[_zombieId]` โดยการใช้ `require` statement

3. ต่อมาฟังก์ชั่นจะต้องตั้งค่า `zombies[_zombieId].name` ให้เท่ากับ`_newName`

3. สร้างอีกฟังก์ชั่นหนึ่งขึ้นมาโดยใช้ชื่อว่า `changeDna` ไว้ด้านล่างฟังก์ชั่น `changeName` เนื้อหาและความหมายต่างๆ เหมือนกับของใน `changeName` เว้นแต่ argument ที่ 2 นั้นจะต้องเปลี่ยนให้เป็น `_newDna` (ชนิด `uint`) แทน และควรมีค่า `20` ในส่วนของพารามิเตอร์ `_level` บน `aboveLevel` นอกจากนี้ตัวจะต้องมีการตั้งค่า`dna` ไปเป็น `_newDna`แทนที่จะเป็นการตั้งชื่อของซอมบี้
