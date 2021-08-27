---
title: Gas
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

            struct Zombie {
                string name;
                uint dna;
                // เพิ่มข้อมูลใหม่ตรงนี้
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

เก่งมากๆ เลย! ตอนนี้ก็ได้รู้ถึงการอัพเดท key portion ของ DApp ในช่วงที่จะป้องกันผู้ใช้อื่นไม่ให้เข้ามายุ่งวุ่นวายกับ contract ของเราแล้ว

ลองมาดูในส่วนของความแตกต่างระหว่าง Solidity กับภาษาโปรแกรมอื่น ๆ ดีกว่า:

## Gas — เชื้อเพลิงที่ Ethereum DApps ต้องใช้

ใน Solidity ผู้ใช้จะต้องมีการชำระเงินทุกครั้งที่มีการรันโค้ดฟังก์ชั่น โดยเรียกสกุลเงินที่ใช้แลกเปลี่ยนว่า **_gas_** ผู้ใช้ต้องซื้อ gas ด้วย Ether (เป็นสกุลเงินบน Ethereum) นั่นหมายถึงผู้ใช้ของคุณจะต้องจ่าย ETH เพื่อที่จะรันโค้ดฟังก์ชั่นบน DApp

จำนวน gas ที่จำเป็นต้องใช้ในการรันฟังก์ชั่นนั้นขึ้นอยู่กับความซับซ้อนของ logic ซึ่งแต่ละโอเปอร์เรชั่นต่างก็มี **_gas cost_** ซึ่งมีค่าโดยคร่าวๆ ขึ้นกับปริมาณ resource ที่ต้องใช้ในการคำนวณของโอเปอเรชั่นนั้นๆ  (ยกตัวอย่างเช่น การ write ลงบน storage จะมีค่ามากกว่าเพียงแค่การบวกข้อมูลชนิด integer สองตัว เป็นต้น)  จำนวน **_gas cost_** รวมทั้งหมดในฟังก์ชั่นมาจากผลรวมระหว่าง gas cost รวมทั้งหมดของแต่ละโอเปอร์เรชั่น

เนื่องจากการรันฟังก์ชั่นจะทำให้ผู้ใช้ต้องเสียค่าใช้จ่ายจริงๆ ดังนั้นการเขียนโค้ดอย่างมีประสิทธิภาพ (code optimization) นับว่าเป็นสิ่งสำคัญอันดับต้นๆ บน Ethereum มากกว่าในภาษาโปรแกรมมิ่งอื่นๆ ถ้าหากว่าโค้ดของคุณไม่เป็นระเบียบเละเทะ ผู้ใช้ก็จะต้องเสียค่าใช้จ่ายมากขึ้นในการที่จะรันโค้ดฟังก์ชั่นออกมา — อาจจะมีมูลค่าถึงล้านดอลล่าร์ก็เป็นได้หากมีผู้ใช้จำนวนมหาศาล

## ทำไม gas จึงสำคัญ?

Ethereum เปรียบเสมือนกับคอมพิวเตอร์ขนาดใหญ่ที่ชำงานช้าแต่ว่ามีความปลอดภัยสูง ทุกๆ node ในเนตเวิร์คจะต้องทำการรันฟังก์ชั่นเดียวกันเพื่อเช็คความถูกต้องของผลลัพธ์ เมื่อทำการรันโค้ดฟังก์ชั่นหนึ่งๆ ออกมา — การที่มีการเช็คความถูกต้องโดย node จำนวนมากต่อการรันแต่ละฟังก์ชั่นจะเป็นสิ่งที่ทำให้ Ethereum นั้นมีการกระจายการคำนวนผล (decentralize) และทำให้ข้อมูลไม่สามารถเปลี่ยนแปลงได้ อีกทั้งยังไม่สามารถถูกตรวจจับได้ง่ายอีกด้วย (immutable and censorship-resistant)

ผู้สร้าง Ethereum ต้องการแน่ใจว่าจะไม่มีใครเข้ามาทำให้เน็ตเวิร์คหยุดชะงักด้วยการทำให้โค้ดติดอยู่ในลูป หรือว่าเข้ามากอบโกยผลประโยชน์จาก network resource โดยการนำไปใช้ในการคำนวณที่ซับซ้อน ดังนั้นจึงได้ใช้วิธีการเก็บค่าใช้จ่ายเมื่อมีการถ่ายโอนใดๆ และผู้ใช้จะต้องเสียค่าใช้จ่ายสำหรับการคำนวณต่างๆ รวมทั้งสำหรับ storage อีกด้วย

> Note: ในกรณีของ sidechain อาจจะไม่ได้เป็นเช่นนี้เสมอไป เช่น  เหมือนกับในกรณีของ sidechain ที่กำลังสร้างอยู่โดยผู้เขียนเนื้อหา CryptoZombies ณ Loom Network คือไม่จำเป็นที่การรันเกมที่เหมือนกับ World of Warcraft โดยตรงบน mainnet ของ Ethereum จะดีเสมอไป— ราคาของ gas อาจถูกกำหนดให้มีราคาแพงได้ แต่มันสามารถรันลงบน sidechain ด้วยอัลกอริทึ่มที่แตกต่างออกไปแทน เราจะมากล่าวถึงประเด็นที่ว่าจะใช้ DApps ชนิดไหนบน sidechain หรือ Ethereum mainnet ในบทถัดไป

## สร้าง packing เพื่อเอาไว้เก็บ gas

ในบทเรียนที่ 1 ได้มีการกล่าวถึงข้อมูลชนิด `uint` ในชนิดต่าง ๆ: `uint8`, `uint16`, `uint32`, เป็นต้น

โดยทั่วไปเราไม่จำเป็นต้องมานั่งสนใจการใช้ชนิดของข้อมูลย่อยๆ พวกนี้ก็ได้เพราะ Solidity ได้ทำการสำรองพื้นที่ไว้ 256 bits อยู่แล้วไม่ว่าจะเป็น `uint` ชนิดใดก็ตาม เช่น การใช้ `uint8` แทนที่จะเป็น `uint` (`uint256`) ก็ไม่ได้ทำให้คุณใช้ gas น้อยลงแต่อย่างใด

แต่ก็อาจจะมีข้อยกเว้นในบางกรณีเช่นกัน: ภายใน `struct` ต่าง ๆ

หากว่ามีหลาย `uint`ภายใน struck 
การใช้ `uint` ที่มีขนาดเล็กลงเมื่อเป็นไปได้จะช่วยให้ Solidity สามารถบรรจุตัวแปรต่างๆ (pack) ให้อยู่รวมกันเพื่อลดขนาดของหน่วยความจำได้ ยกตัวอย่างเช่น:

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` จะใช้ gas น้อยกว่า `normal` เนื่องจากมีการ pack ส่วน struct เข้าไว้ด้วยกัน
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

เพราะฉะนั้นแล้ว เราจึงอยากให้ภายใน struct ใช้ข้อมูล integer ชนิดที่มีขนาดเล็กที่สุดเท่าที่จะทำได้

อาจจำเป็นจะต้องใช้การรวมกลุ่ม (cluster) ข้อมูลชนิดที่่เหมือนกันเข้าด้วยกันอีกด้วย (เช่น นำข้อมูลที่เหมือนกันมาวางไว้ใกล้ ๆ กันภายใน struct) ซึ่งจะทำให้ Solidity สามารถลดพื้นที่จัดเก็บข้อมูลลงไปได้ ยกตัวอย่าง struct ที่มี
field แบบ `uint c; uint32 a; uint32 b;` จะใช้ gas ในปริมาณที่น้อยกว่า field แบบ `uint32 a; uint c; uint32 b;`
เนื่องจาก field `uint32` ได้ถูกนำมาวางไว้ให้อยู่ด้วยกัน


## ลองมาทดสอบกัน

ในบทเรียนนี้ เราจะมาทำการเพิ่ม 2 คุณสมบัติเข้าไปในเจ้าซอมบี้ของเรากัน: นั่นก็คือ `level` และ `readyTime` — คุณสมบัติอันที่สองเอาไว้เพื่อการอิมพลิเมนท์เวลา cooldown ที่จะเอาไว้จำกัดความถี่ในการให้อาหารซอมบี้ได้

ดังนั้นให้กลับไปที่ `zombiefactory.sol`กันเลย

1. ให้เพิ่ม 2 คุณสมบัติเข้าไปใน struct  `Zombie` : ได้แก่ `level` (ชนิด `uint32`) และ `readyTime` (ชนิด`uint32` เช่นกัน) เนื่องด้วยเราต้องการให้สองคุณสมบัตินี้อยู่ด้วยกัน ดังนั้นก็ให้วางทั้งคู่ในส่วนท้ายของ struct เลย

จำนวน 32 bit เพียงพอแล้วต่อการเก็บ level ของซอมบี้ และ timestamp ทำให้เราสามารถใช้ gas costs ได้น้อยลงโดยการ pack ข้อมูลเข้าด้วยกันให้แน่นมากขึ้นโดยการใช้ `uint` (256-bits) แบบทั่ว ๆ ไป
