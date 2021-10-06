---
title: Payable
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

          // 1. กำหนด levelUpFee ตรงนี้

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. เพิ่มฟังก์ชั่น levelUp ตรงนี้

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

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
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

จนถึงตอนนี้เราก็มีความรู้เล็กน้อยเกี่ยวกับ **_function modifiers_** แล้ว ซึ่งอาจจะยากในการที่จะสามารถจำทุก ๆ อย่างได้ ดังนั้นเรามา review กันแบบรวบรัดก็แล้วกัน:

1. เรามี visibility modifiers ในการควบคุมว่าเมื่อไหร่ หรือที่ไหนที่ฟังก์ชั่นจะถูกเรียกได้: `private` แปลว่าฟังก์ชั่นจะถูกเรียกได้จากฟังก์ชั่นอื่น ๆ ภายใน contract เท่านั้น ; `internal` เป็นเหมือนกัน `private` แต่จะสามารถถูกเรียกได้จาก contract ที่มีการ inherit มาจากตัวมัน; `external` สามารถเรียกฟังก์ชั่นนี้ได้จากภายนอก contract เท่านั้น; และสุดท้ายก็คือ `public` หมายถึงสามารถถูกเรียกจากที่ใดก็ได้ไม่ว่าจากภายในหรือภายนอกก็ตาม

2. นอกจากนี้ก็มี state modifier ที่จะบอกว่าฟังก์ชั่นมีการ interact อย่างไรกับ BlockChain: `view` บอกเราว่าเมื่อทำการรันฟังก์ชั่น จะไม่มีข้อมูลใดที่ถูกบันทึก/เปลี่ยนแปลง `pure` บอกว่านอกจากฟังก์ชั่นจะไม่ทำการบันทึกข้อมูลใด ๆ ลงไปยัง blockchain แล้ว มันยังไม่ได้อ่าน (read) ข้อมูลใด ๆ จาก blockchain อีกด้วย state modifier ทั้งสองนี้ไม่ทำให้เราต้องสูญเสีย gas ในการเรียกใช้จากภายนอก contract (จะเสีย gas ก็ต่อเมื่อมีการเรียกใช้ภายในจากฟังก์ชั่นอื่น ๆ )

3. และยังได้ปรับแต่ง `modifiers` ที่ได้เรียนรู้กันไปในบทที่ 3: `onlyOwner` และ `aboveLevel` ยกตัวอย่างเช่น การได้ปรับแต่งแนวคิดต่าง ๆ ในการดูว่ามันจะส่งผลถึงฟังก์ชั่นอย่างไร เป็นต้น

 modifier ทั้งหมดนี้สามารถนำเอามารวมด้วยกันได้ภายใน function definition ดังที่จะให้ดูต่อไปนี้:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

ในหัวข้อนี้จะแนะนำให้รู้จัก function modifier อีก 1 ตัว: `payable`.

## The `payable` Modifier

ฟังก์ชั่น `payable` เป็นส่วนหนึ่งที่ทำให้ Solidity และ Ethereum มีความเจ๋งมากเลยทีเดียว — เป็นฟังก์ชั่นชนิดพิเศษที่สามารถรับ Ether ได้

เมื่อเรียกใช้ฟังก์ชั่น API บทเว็บเซิร์ฟเวอร์ทั่ว ๆ ไป เราจะไม่สามารถส่ง US dollars ร่วมไปพร้อมกันกับการเรียกใช้ฟังก์ชั่นได้ — และไม่สามารถส่ง Bitcoin ได้เช่นกัน

แต่ใน Ethereum นั้น เนื่องจากทั้งเงิน (_Ether_), ข้อมูล (*transaction payload*), และโค้ดของ contract ได้อยู่รวม ๆ กันทั้งหมดบน Ethereum ทำให้มีความเป็นไปได้ในการที่จะเรียกฟังก์ชั่น **และ** จ่ายเงินไปยัง contract ในเวลาเดียวกัน

โดยจะทำให้เราสามารถใช้ logic บางอย่างที่น่าสนใจได้ เช่น ต้องมีการจ่ายให้กับ contract ในจำนวนหนึ่งเพื่อที่จะสามารถรันฟังก์ชั่นใด ๆ ออกมาได้

## ลองมาดูตัวอย่างก็ได้
```
contract OnlineStore {
  function buySomething() external payable {
    // เช็คเพื่อความแน่ใจว่า 0.001 ether ได้ถูกส่งไปยังการเรียกฟังก์ชั่นแล้ว:
    require(msg.value == 0.001 ether);
    // หากเป็นเช่นนั้น ให้ส่ง digital item ไปยังผู้ที่เรียกใช้ฟังก์ชั่น:
    transferThing(msg.sender);
  }
}
```

ในที่นี้ `msg.value` เป็นวิธีการที่ทำให้เราเห็นว่าได้ส่ง Ether ไปยัง contract เป็นจำนวนเท่าไหร่ และ `ether` ก็นับว่าเป็น built-in unit

สิ่งที่เกิดขึ้นในส่วนนี้ก็คืออาจจะมีบางคนเรียกใช้ฟังก์ชั่นจาก web3.js (จาก JavaScript front-end ของ DApp) ดังนี้:

```
// สมมติว่า `OnlineStore` ชี้ไปยัง contract ของเราบน Ethereum:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

ให้สังเกตในส่วนของ field `value` ที่ฟังก์ชั่น JavaScript ได้กำหนดว่าจะต้องส่ง `ether` ไปเท่าไหร่ (0.001) หากนึกถึงการถ่ายโอนในรูปแบบของจดหมาย และให้ parameter ที่ได้ส่งไปยังการเรียกใช้ฟังก์ชั่นเป็นเหมือนเนื้อหาด้านในของจดหมายแล้ว แปลว่าการเพิ่ม `value` เข้าไปก็เป็นเหมือนกับการใส่เงินเข้าไปภายในจดหมายนั่นเอง — จดหมายและเงินจะถูกส่งไปด้วยกันยังผู้รับ

>Note: หากฟังก์ชั่นไม่ได้ถูกมาร์คไว้ว่าเป็น `payable` และเรายังพยายามที่จะส่ง Ether ไปหาแบบที่เราได้ทำไว้ข้างต้น ฟังก์ชั่นก็จะทำการละทิ้งการถ่ายโอนนี้


## ทดสอบ

สร้างฟังก์ชั่น `payable` ภายในเกมซอมบี้ของเรา

เมื่ออยากให้เกมของเรามี feature ที่ผู้ใช้สามารถที่จะจ่าย ETH เพื่อให้ซอมบี้เลเวลอัพได้ ETH จะต้องถูกเก็บไว้ภายใน contract ที่ผู้ใช้เป็นเจ้าของ — ซึ่งนี่ถือเป็นตัวอย่างพื้นฐานในการที่จะมีรายได้จากเกมของคุณ!

1. กำหนดตัวแปรชนิด `uint` ที่มีชื่อว่า `levelUpFee` และตั้งให้มีค่าเท่ากับ `0.001 ether`

2. สร้างฟังก์ชั่นที่มีชื่อว่า `levelUp` โดยมันจะรับ 1 perameter, `_zombieId` เป็น `uint` ฟังก์ชั่นนี้ควรเป็นชนิด `external` และ `payable`.

3. อันดับแรกฟังก์ชั่นควร `require` ว่า `msg.value` มีค่าเท่ากับ `levelUpFee`

4. ต่อมาให้ increment `level`: `zombies[_zombieId].level++` ของซอมบี้ตัวนี้
