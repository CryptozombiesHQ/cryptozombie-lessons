---
title: Storage แพงจัง...
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
            // เริ่มที่ตรงนี้
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

          return result;
        }

      }
---

หนึ่งในโอเปอร์เรชั่นที่แพงขึ้นมาใน Solidity ก็คือ `storage` — เดี๋ยวเราจะมาแยกเล่าทีละประเด็นกัน

ทั้งนี้ก็เนื่องจากในทุกครั้งที่มีการเขียน หรือเปลี่ยนแปลงข้อมูลในบางส่วน จะเป็นการเขียนอย่างถาวรลงบน blockchain และมันเป็นเช่นนี้เสมอ! node เป็นพันๆ จากหลายซีกโลกจะต้องเก็บข้อมูลนั้นๆ ลงใน hard drive และขนาดของข้อมูลก็เติบโตขึ้นตลอดตามระยะเวลาที่ blockchain ก็มีการเติบโต ซึ่งทำให้มีค่าใช้จ่ายในส่วนนั้นนั่นเอง

เพื่อที่จะให้ค่าใช้จ่ายลดน้อยลง ควรจะต้องเลี่ยงการเขียนข้อมูลลงบนหน่วยความจำ เว้นเสียแต่ว่าจะเป็นเหตุจำเป็น บางครั้งประเด็นนี้ก็เกี่ยวกับการใช้  programming logic ที่ไม่มีประสิทธิภาพด้วยเช่นกัน — ยกตัวอย่างการสร้าง array ขึ้นใหม่ภายใน `memory` ทุกๆ ครั้งที่เรียกใช้ฟังก์ชั่น แทนที่จะทำการบันทึก array นั้นเอาไว้ในตัวแปรเพื่อความรวดเร็วในการกลับเข้ามา

ในภาษาโปรแกรมส่วนใหญ่ การทำให้กลุ่มของข้อมูลขนาดใหญ่ต้องมีการวนลูปขึ้นจะมีราคาแพง แต่ใน Solidity จะมีวิธีที่ถูกลงหากทำภายในฟังก์ชั่นชนิด `external view` มากกว่าการใช้ `storage` เพราะฟังก์ชั่น `view` จะไม่ทำให้ผู้ใช้ต้องเสีย gas (และผู้ใช้ต้องเสียเงินจริงๆ ในการใช้ gas!)

เราจะมาเก็บตกเกี่ยวกับลูป `for` ในบทต่อไป แต่ก่อนอื่นขอกล่าวถึงการประกาศ array ภายใน memory ก่อนดีกว่า

## Declaring arrays ใน memory

สามารถใช้คีย์เวิร์ด `memory` กับ array เพื่อสร้าง array ใหม่ขึ้นภายในฟังก์ชั่นโดยไม่ต้องเขียนอะไรลงไปในหน่วยจัดเก็บข้อมูล array นั้นจะปรากฏอยู่เพียงแค่ถึงตอนจบของการเรียกใช้ฟังก์ชั่นเท่านั้น ซึ่งทำให้ใช้ปริมาณ gas ได้น้อยลงอย่างชาญฉลาดมากกว่าการอัพเดท array ภายใน `storage` — และยังฟรีหากเป็นฟังก์ชั่น `view` ที่ถูกเรียกจากภายนอกด้วย

ต่อไปนี้จะแสดงการประกาศ array ภายใน memory:

```
function getArray() external pure returns(uint[]) {
  // ตั้งค่าให้ array ภายใน memory มีความยาวเท่ากับ 3
  uint[] memory values = new uint[](3);
  // เพิ่ม value บางค่าเข้าไป array
  values.push(1);
  values.push(2);
  values.push(3);
  // รีเทิร์นไปยัง array
  return values;
}
```

นี่เป็นตัวอย่างเพียงเล็กน้อยในการแสดงให้เห็นถึง syntax ที่จะใช้ แต่ในบทถัดไปเราจะมาดูถึงการรวมมันเข้ากับลูป `for` กันเพื่อนำไปใช้ในเคสจริง

>Note: memory array **ต้อง** ถูกสร้างมาพร้อมกับ length argument (ในตัวอย่างนี้ก็คือ `3`) ณ ตอนนี้ความยาวจะไม่สามารถถูกเปลี่ยนได้เหมือนกับที่ storage arrays ทำได้โดยใช้ `array.push()` แต่ในอนาคตเราอาจจะทำได้ใน version ใหม่ๆ ของ Solidity

## ทดสอบ

ภายในฟังก์ชั่น `getZombiesByOwner` เราต้องการที่จะรีเทิร์น array ชนิด `uint[]` ด้วยซอมบี้ทั้งหมดที่ผู้ใช้แต่ละคนมี

1. ประกาศตัวแปร `uint[] memory` ใช้ชื่อว่า `result`

2. ตั้งให้มีค่าเท่ากับ array `uint` ใหม่ ความยาวของ array นี้จะขึ้นอยู่กับว่ามีจำนวนซอมบี้อยู่เท่าไหร่ที่ `_owner` นี้มีอยู่ โดยเราสามารถเข้าไปดูได้โดยการ `mapping` เข้ากับ: `ownerZombieCount[_owner]`

3. ในตอนท้ายของฟังก์ชั่นให้รีเทิร์น `result` ซึ่งจะเป็นแค่ array ว่างๆ ในตอนนี้ เราจะมาทำให้มันสมบูรณ์กันในบทถัดไป
