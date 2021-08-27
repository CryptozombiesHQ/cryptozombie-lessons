---
title: Saving Gas ด้วยฟังก์ชั่น 'View'
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

          // สร้างฟังก์ชั่นขึ้นมาตรงนี้เลย

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

        }

      }
---

เก่งมากเลย! ตอนนี้เราก็มีความสามารถพิเศษเพิ่มเข้ามา สำหรับซอมบี้ที่มีเลเวลเพิ่มขึ้นเพื่อที่จะให้เจ้าของมีแรงกระตุ้นในการที่จะอัพเลเวลของเจ้าซอมบี้แล้ว และยังสามารถมาเพิ่มรายละเอียดเล็กๆ น้อยๆ ได้อีกในภายหลังตามที่เราต้องการเลย

ตอนนี้ก็ถึงเวลาที่จะมาเพิ่มอีก 1 ฟังก์ชั่นเข้าไปแล้ว: DApp ของเราต้องการ method ที่เอาไว้ดูภาพรวมของกองทัพซอมบี้ทั้งหมดของผู้ใช้ด้วย — มาเรียกมันว่า `getZombiesByOwner` ก็แล้วกัน

ฟังก์ชั่นนี้ต้องการแค่จะอ่านข้อมูลออกมาจาก blockchain เท่านั้น ดังนั้นเราก็สามารถสร้างฟังกั่น `view` ให้มันได้เลย ซึ่งจะพาเราเข้าสู่หัวข้อสำคัญเกี่ยวกับ gas optimization อีกด้วย:

## View function จะไม่ทำให้เราต้องเสีย gas

ฟังก์ชั่น `view` จะไม่เสีย gas ในการเรียกจากภายนอกโดยผู้ใช้

ทั้งนี้ก็เพราะฟังก์ชั่น `view` ไม่ได้ทำให้เกิดการเปลี่ยนแปลงใดๆ บน blockchain – ทำเพียงแค่การอ่านค่าอย่างเดียว เพราะฉะนั้นการเพิ่ม `view` ลงในฟังก์ชั่นจะเป็นการไปบอก `web3.js` ว่ามันต้องการเพียงแค่ค้นหาข้อมูลใน local Ethereum node เพื่อรันฟังก์ชั่นเท่านั้น และก็ไม่จำเป็นจะต้องสร้างการถ่ายโอนขึ้นมาจริงๆ บน blockchain (ซึ่งการถ่ายโอนจริงๆ นั้นจะต้องรันบนทุก node และทำให้เราต้องเสีย gas)

เราจะมากล่าวถึงการตั้งค่า web3.js ด้วย node ของคุณเองในภายหลัง แต่ในตอนนี้ยังมีสิ่งที่สำคัญกว่านั้นก็คือเราสามารถเพิ่มประสิทธิภาพให้กับการใช้ gas ใน DApp ได้สำหรับผู้ใช้ โดยการเพิ่มฟังก์ชั่น read-only `external view` เมื่อใดก็ตามที่เป็นไปได้

> Note: ถ้าฟังก์ชั่น `view` ถูกเรียกจากภายในโดยฟังก์ชั่นอื่นๆ ใน contract เดียวกันนั้นจะ **ไม่ถือว่า** เป็นฟังก์ชั่น `view` แปลว่าก็จะต้องเสีย gas เมื่อทำเช่นนี้ เนื่องจากฟังก์ชั่นอื่นๆ จะสร้างการโอนถ่ายขึ้นบน Ethereum และยังคงต้องได้รับการยืนยันความถูกต้องจากทุกๆ node ดังนั้นฟังก์ชั่น `view` จะไม่ต้องเสียค่าใช้จ่ายใดๆ ก็ต่อเมื่อมันถูกเรียกจากภายนอกเท่านั้น

## มาทดสอบกัน

เราจะมาทำการอิมพลีเมนท์ฟังก์ชั่นที่จะรีเทิร์นภาพรวมกองทัพซอมบี้ของผู้ใช้ออกมา เราสามารถเรียกฟังก์ชั่นนี้ได้ในภายหลังจาก `web3.js` หากว่าเราต้องการให้มีการแสดงหน้าโปรไฟล์ของผู้ใช้พร้อมๆ กับกองทัพซอมบี้ทั้งหมดของเขา

function's logic ในส่วนนี้จะค่อนข้างซับซ่อนอยู่บ้าง เพราะฉะนั้นอาจจะต้องเรียนรู้การอิมพลีเมนท์เพิ่มเติมในอีกหลายๆ บทข้างหน้า อย่าเพิ่งท้อกันนะ

1. สร้างฟังกืชั่นชื่อว่า `getZombiesByOwner` โดยจะรับ 1 argument ก็คือ `address` ชื่อว่า `_owner`.

2. ทำให้ฟังก์ชั่นนี้เป็นแบบ `external view` ทำให้เราสามารถเรียกใช้มันได้จาก `web3.js` โดยที่ไม่ต้องใช้ gas ใดๆ 

3. ฟังก์ชั่นควรรีเทิร์นค่า `uint[]` ออกมา (เป็น array ของ `uint`).

ปล่อยให้ส่วน body ของฟังก์ชั่นโล่งๆ ไว้ก่อนในตอนนี้ เราจะมาแก้ไขกันภายหลังในบทต่อไป
