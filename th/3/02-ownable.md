---
title: Contracts ที่สามารถเป็นเจ้าของได้
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Import here

        // 2. Inherit here:
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

          function setKittyContractAddress(address _address) external {
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
           * @dev Throw หากมีการเรียกโดยบัญชีอื่นที่ไม่ใช่ของ owner
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
              randDna = randDna - randDna % 100;
              _createZombie(_name, randDna);
          }

      }
---

จากโค้ดในบทก่อนหน้า สังเกตุมั้ยเอ่ยว่ายังมีช่องโหว่ในเรื่องของความปลอดภัยอยู่?

`setKittyContractAddress` นั้นเป็นประเภท `external` คือไม่ว่าใครก็สามารถเรียกใช้มันได้! แปลว่าใครก็ตามที่เรียกใช้ฟังก์ชั่นนี้จะสามารถเข้าไปเปลี่ยน address ของ CryptoKitties contract ได้

จริงอยู่ที่เราต้องการที่จะสามารถเข้าไปอัพเดท address ใน contract ได้ แต่! ไม่ใช่ว่าเราต้องการให้ใครก็ได้เข้าไปอัพเดทมันเสียหน่อย

มีวิธีหนึ่งที่จะเข้ามาใช้ในการรับมือต่อกรณีนี้ นั่นก็คือการตั้งค่าให้ contract เป็นแบบ `Ownable` — แปลว่าเราจะมี owner (ก็คือคุณนั่นเอง) ที่จะมีสิทธิ์พิเศษในการอัพเดทดังกล่าว

## OpenZeppelin's `Ownable` contract

ด้านล่างนี้คือ contract ชื่อ `Ownable` ที่รับมาจาก library ของ Solidity **_OpenZeppelin_** OpenZeppelin คือ library ของ secure and community-vetted smart contracts ที่สามารถนำมาใช้ใน DApps ของเรา หลังจากบทนี้เป็นต้นไป เราแนะนำว่าให้ลองไปดูเว็บไซต์นี้ได้ในขณะที่รอให้บทเรียนที่ 4 ออกมา เพื่อความเข้าใจที่มากยิ่งขึ้นของตัวคุณเอง!

ลองอ่าน contract ด้านล่างคร่าวๆ ดู คุณจะพบบางอย่างที่เรายังไม่ได้ศึกษากัน แต่ไม่ต้องเป็นห่วงไปเพราะเราจะได้เรียนรู้กันแน่ๆ ในอนาคต

```
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * ฟังก์ชั่นต่าง ๆ นี้จะบ่งบอกถึงการนำ "user permissions" มาใช้
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
```

มานั่งไล่เรียงถึงสิ่งใหม่ๆ ที่เราเพิ่งจะเห็นเป็นครั้งแรกกัน:

- Constructors: `function Ownable()` คือ **_constructor_** ซึ่งเป็นฟังก์ชั่นพิเศษทางเลือก(optional special function) สามารถมีชื่อเดียวกับ contract ได้ ฟังก์ชั่นนี้จะถูกรันโค้ด เพียงแค่ครั้งเดียวในตอนที่ contract ถูกสร้างขึ้นมาครั้งแรก
- Function Modifiers: `modifier onlyOwner()` Modifier จัดว่าเป็นฟังก์ชั่นแบบกึ่ง ที่จะถูกใช้ในการปรับแต่งฟังก์ชั่นอื่น ๆ โดยปกติจะใช้ในการเช็คลำดับของ requirement เวลาจะ execute ออกมา ในกรณีนี้ `onlyOwner` สามารถถูกใช้ในการจำกัดการเข้าใช้เพื่อให้ **เฉพาะ** แค่ **เจ้าของ หรือ owner** ของ contract จะสามารถใช้ function นี้ได้ เราจะกล่าวเพิ่มเติมเกี่ยวกับ function modifier ในบทถัดไป และประเด็นที่ว่าสัญลักษณ์ประหลาด `_;` ทำหน้าที่อะไร
- `indexed` keyword: ในตอนนี้เรายังไม่จำเป็นต้องใช้มัน ฉะนั้น ยังไม่ต้องสนใจดีกว่า

`Ownable` contract ปกติแล้วทำงานดังต่อไปนี้:

1. เมื่อ contract ได้ถูกสร้างขึ้น constructor ของมันจะตั้งค่าให้ `owner` เป็ร `msg.sender` (หรือก็คือผู้ที่นำมาใช้)

2. จะมีการเพิ่ม modifier ชื่อ `onlyOwner` ซึ่งสามารถกำจัดการเข้าใช้ฟังก์ชั่นบางตัวให้เฉพาะ `owner` เท่านั้น

3. อนุญาตให้ส่งต่อ contract ให้สู่ `owner` คนใหม่ได้

`onlyOwner` นับว่าเป็นความต้องการขั้นพื้นฐานสำหรับ contract โดยที่ Solidity DApps ส่วนใหญ่จะเริ่มจากการ copy/paste เอาส่วนของ `Ownable` contract นี้มาและทำให้ contract แรกมีการ inherit มาจากมัน

เนื่องจากเราต้องการลิมิตให้ `setKittyContractAddress`  มีค่าเป็น `onlyOwner` จึงต้องทำวิธีเดียวกันใน contract ของเรา

## มาทดสอบกัน

เราได้ทำการก็อปปี้ contract ชื่อ `Ownable` ลงในไฟล์ใหม่ชื่อว่า `ownable.sol` ต่อมาก็ได้เวลาของการทำให้ `ZombieFactory` มีการ inherit มาจาก contract นี้ดีกว่า

1. ปรับแต่งดค้ดของเราเพื่อให้ `อิมพอร์ต` เนื้อหาของ `ownable.sol` มา ถ้าหากจำไม่ได้ว่าต้องทำอย่างไร ให้เข้าไปดูได้ที่ `zombiefeeding.sol`

2. ปรับแต่ง contract `ZombieFactory` ให้มีการ inherit มาจาก `Ownable` หากจำวิธีไม่ได้ก็สามารถเข้าไปดูได้ที่ `zombiefeeding.sol` อีกเช่นกัน
