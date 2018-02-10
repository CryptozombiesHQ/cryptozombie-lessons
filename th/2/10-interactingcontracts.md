---
title: ซอมบี้กินอะไรเป็นอาหาร?
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // สร้าง KittyInterface ตรงนี้

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

        }
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

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

ได้เวลาให้อาหารซอมบี้แล้ว! อยากรู้แล้วใช่ไหมว่าซอมบี้ชอบกินอะไรมากที่สุด?

เราจะบอกให้ก็ได้ว่า CryptoZombies ชอบกิน...

**CryptoKitties!** 😱😱😱

(ไม่ได้ล้อเล่นนะจ้ะ 😆 )

ในการที่จะทำเช่นนี้ได้เราจะต้องทำการอ่าน kittyDna จาก CryptoKitties smart contract ให้ได้เสียก่อน ซึ่งสามารถทำได้เนื่องจากข้อมูลของ CryptoKitties ได้ถูกเก็บใน blockchain อย่างเปิดเผย เริ่มเห็นแล้วใช้ไหมว่า blockchain นั้นเจ๋งแค่ไหน?!

แต่ไม่ต้องห่วงนะ เกมของเราไม่ได้จะทำร้ายน้องแมว CryptoKitty ของใคร เพียงต้องการแค่จะอ่าน หรือ *reading* ข้อมูลของ CryptoKitties เฉยๆ เพราะเราลบมันไปจริงๆ ไม่ได้หรอก 😉

## การมีปฎิสัมพันธ์กับ contract อื่น

หากอยากให้ contract ของเราสามารถสื่อสารกับ contract อื่นบน blockchain ได้ ก่อนอื่นจะต้องทำการ define **_interface_** ขึ้นเสียก่อน

มาดูที่ตัวอย่างง่าย ๆ กันก่อนดีกว่า เช่น หากมี contract หนึ่งบน blockchain ที่มีหน้าตาดังนี้:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

ซึ่งนี้ก็จะเป็น contract ธรรมดาที่ใครก็สามารถเข้าไปใส่เลขที่ตัวเองชอบได้ ตัวเลขนี้จะมีความเกี่ยวข้องกับ address บน Ethereum ทำให้ใครก็ตามสามารถเข้าไปดูเลขของผู้อื่นได้โดยการใช้ address ของตัวเอง

สมมติว่าเรามี contract จากภายนอก (external contract) ที่ต้องการเข้ามาอ่านข้อมูลใน contract นี้โดยจะใช้ฟังก์ชั่น `getNum`

ก่อนอื่นเลยเราก็ต้อง define **_interface_** ของ contract ที่ชื่อ `LuckyNumber`  ซะก่อน:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

สังเกตุไหมว่ามันคล้ายกับการ define องค์ประกอบเข้าไปใน contract ซึ่งมีความแตกต่างเล็กน้อย อย่างแรกคือเราทำเพียงแค่ประกาศฟังก์ชั่นที่เราต้องการจะมีปฎิสัมพันธ์ด้วยเท่านั้น — ในกรณีนี้ก็คือ `getNum` — และเราไม่ได้กล่าวถึงฟังก์ชั่นอื่น ๆ หรือว่า state variables เลย

อย่างที่สองคือ เราไม่ได้กำหนดในส่วน body ต่าง ๆ ของฟังก์ชั่น และแทนที่จะเป็นเครื่องหมายแท็กเปิด/ปิดแบบหยัก (`{` and `}`) กลับใช้เครื่องหมาย semicolon (`;`) ในการปิดการประกาศค่าฟังก์ชั่นแทนอีกด้วย

ดังนั้นนี่จึงคล้ายกับเค้าโครงของ contract  จะทำให้คอมไพล์เลอร์รู้ได้ว่าส่วนนี้เป็น interface

จากการรวม interface เข้ากับโค้ด dapp ของเรานั้น contract จะรู้ได้ว่าฟังก์ชั่นของ contract อื่นมีหน้าตาเป็นอย่างไร จะต้องเรียกฟังก์ชั่นอย่างไร และ คาดหวังการตอบโต้กลับมาในรูปแบบไหน

ซึ่งเราจะลงรายละเอียดเรื่องการเรียกใช้ฟังก์ชั่นของคนอื่นในบทเรียนหน้า แต่สำหรับตอนนี้เอาเป็นว่าเรามาประกาศ interface สำหรับ contract น้องแมว CryptoKitties กันก่อน

# ลองทดสอบกัน

หลังจากได้เข้าไปดู source code ของ CryptoKitties เรียบร้อย และพบฟังก์ชั่นที่เรียกว่า `getKitty` ซึ่งจะรีเทิร์นข้อมูลของน้องแมวทั้งหมดออกมา ประกอบไปด้วยยีนส์ ("genes") ของมัน (เกมซอมบี้ของเราต้องการสิ่งนี้ในการสร้างซอมบี้ตัวใหม่นั้นเอง!).

The function looks like this:

```
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
) {
    Kitty storage kit = kitties[_id];

    // if this variable is 0 then it's not gestating
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

ฟังก์ชั่นจะมีความแตกต่างเล็กน้อยจากฟังก์ชั่นปกติที่เราใช้กัน สามารถเห็นได้จากการรีเทิร์น... ค่าที่แตกต่างกันไปจำนวนหนึ่ง หากคุณมีความรู้มาจากภาษา Javascript สิ่งนี้จะค่อนข้างแตกต่าง ใน Solidity เราสามารถรีเทิร์นผลลัพธ์ออกมาจากฟังก์ชั่นได้หลายค่า

ตอนนี้เราก็ทราบแล้วว่าฟังก์ชั่นหน้าตาเป็นอย่างไร ทำให้สามารถใช้ในการสร้าง interface ขึ้นมาได้:

1. กำหนด interface ที่มีชื่อว่า `KittyInterface` จงจำไว้ว่ามันก็เหมือนกับการสร้าง contract ขึ้นมาใหม่ — เราใช้ keyword คำว่า `contract`

2. ภายใน interface กำหนดฟังก์ชั่นชื่อว่า `getKitty` (สามารถ copy/paste มาจากฟังก์ชั่นด้านบนได้เลย แต่เปลี่ยนเป็นเครื่องหมาย semi-colon หลังจากคำว่า `returns` ด้วยแทนที่จะเป็น `{` และ `}`
