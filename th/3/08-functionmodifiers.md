---
title: เนื้อหาเพิ่มเติมเกี่ยวกับ Function Modifiers
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

          // Start here

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

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
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

      }
---

เจ๋งไปเลย! ซอมบี้ของเราตอนนี้มี cooldown timer เป็นที่เรียบร้อยแล้ว

ต่อมาเราจะทำการเพิ่ม helper method เข้าไปอีก ซึ่งเราได้สร้างไฟล์ขึ้นมาให้แล้ว มีชื่อว่า `zombiehelper.sol` มันจะทำการอิมพอร์ต `zombiefeeding.sol` ขึ้นมา สิ่งนี้จะทำให้โค้ดของเรามีความเป็นระเบียบมากขึ้น

มาทำให้ซอมบี้ได้รับความสามารถเพิ่มขึ้นเมื่อถึง level ต่างๆ แต่การที่จะทำเช่นนั้นได้ ก่อนอื่นเราจะต้องเรียนรู้เพิ่มเติมเกี่ยวกับ  function modifier อีกสักเล็กน้อย

## Function modifiers ที่มี arguments

ก่อนหน้านี้เราได้เห็นถึงตัวอย่างของ `onlyOwner`กันไปแล้ว แต่  function modifiers ก็สามารถรับ argument ได้ด้วยเช่นกัน ตัวอย่าง:

```
// mapping ที่เก็บค่าอายุของผู้ใช้:
mapping (uint => uint) public age;

// Modifier ที่ต้องการให้ผู้ใช้มีอายุสูงกว่าอายุที่ได้กำหนดไว้:
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

// ต้องมีอายุมากกว่า 16 ปีถึงจะขับรถได้(เฉพาะใน US).
// เราสามารถเรียกใช้ modifier `olderThan` ที่มี argumentsช ได้แบบนี้:
function driveCar(uint _userId) public olderThan(16, _userId) {
  // function logic ที่้ต้องการ
}
```

จะเห็นได้ว่า modifier `olderThan` จะรับ argument ด้วยวิธีเช่นเดียวกันกับฟังก์ชั่นเลย และฟังก์ชั่น `driveCar` ก็จะส่งต่อ argument เข้าไปยัง modifier

ลองมาสร้าง `modifier` ของเราเองที่ใช้คุณสมบัติ `level` ของซอมบี้ในการจำกัดความสามารถในแต่ละ level กันเถอะ

## ได้เวลาทดสอบแล้ว

1. ใน `ZombieHelper` ให้สร้าง `modifier` ที่ชื่อว่า `aboveLevel` โดยให้รับค่า 2 argument ได้แก่ `_level` (ชนิด `uint`) แล้ว `_zombieId` (ก็ยังเป็น `uint` เช่นกัน)

2. ในส่วนของ body ควรสามารถเช็คว่า `zombies[_zombieId].level` จะต้องมีค่ามากกว่าหรือเท่ากับ `_level` ได้

3. อย่าลืมว่าบรรทัดสุดท้ายของ modifier จะต้องเรียกฟังก์ชั่นที่เหลือด้วย `_;`
