---
title: onlyOwner Function Modifier
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
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

          // ปรับแต่งฟังก์ชั่นนี้:
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
---

ตอนนี้ contract พื้นฐานที่ชื่อ `ZombieFactory` ก็ได้ inherit มาจาก `Ownable` แล้ว ทำให้สามารถใช้ฟังก์ชั่น modifier `onlyOwner` ภายใน `ZombieFeeding` ได้เช่นกัน

ทั้งนี้ก็เป็นเพราะ contract inheritance นี้สามารถใช้การได้ ให้จำไว้ว่า:

```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```

ดังนั้น `ZombieFeeding` ก็จะต้องเป็นประเภท `Ownable` เช่นกัน และจะสามารถเข้าถึง ฟังก์ชั่น / event / modifier ได้จาก contract ชื่อ `Ownable` การเข้าถึงนี้จะถูกนำไปใช้โดย contract ใด ๆ ก็ตามที่ inherit มาจาก `ZombieFeeding` ในอนาคตด้วยเช่นกัน

## ตัวปรับแต่งฟังก์ชั่น (Function Modifiers)

Function modifier ก็เหมือนกับฟังก์ชั่นทั่วไป แตกต่างกันตรงที่การใช้คำว่า `modifier` แทนการใช้คำว่า `function` แต่มันยังไม่สามารถถูกเรียกได้โดยตรงแบบในกรณีของฟังก์ชั่น — จะต้องมีการพ่วงชื่อของ modifier นั้นๆ เข้าในตอนท้ายของการให้ความหมายของฟังก์ชั่น (function definition) เพื่อทำให้การกระทำของฟังก์ชั่นนั้นๆ เกิดความเปลี่ยนแปลง

มาดูกันแบบละเอียดโดยใช้กรณีของ `onlyOwner` เป็นตัวอย่าง:

```
/**
 * @dev ใช้บรรทัดนี้หากถูกเรียกโดยบัญชีอื่นที่ไม่ใช่ของ owner
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

เราสามารถใช้ modifier ได้ตามตัวอย่างต่อไปนี้:

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // ให้จำการใช้ `onlyOwner` ตามด้านล่างนี้:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

ให้สังเกตุว่ามีการใช้ modifier `onlyOwner` เข้าในฟังก์ชั่น `likeABoss` เมื่อใดก็ตามที่รัน `likeABoss` โค้ดภายใน `onlyOwner` จะถูกประมวลผล **ก่อน** และเมื่อเจอกับเครื่องหมาย `_;` ภายใน `onlyOwner` เมื่อใด ถึงจะค่อยกลับไปรันโค้ดภายในฟังก์ชั่น `likeABoss` ต่อ

การใช้ modifier มีอีกหลายวิธี แต่วิธีที่ใช้บ่อยที่สุดก็คือการเพิ่มระบบตรวจสอบโดยการใส่ `require` เข้าไปก่อนที่ฟังก์ชั่นจะถูกรันออกมา

ในกรณีของการเพิ่ม modifier ชื่อ `onlyOwner` เข้าไปในฟังก์ชั่นจะทำให้ผู้ที่สามารถเรียกใช้ฟังก์ชั่นได้มี **เพียงแค่** เฉพาะ **owner** ของ contract เท่าน้ั้น(ก็คือคุณนั่นแหละ เพราะคุณเป็นคนสร้าง)

>Note: การให้อำนาจพิเศษกับ owner ต่อการใช้ contract เช่นนี้เป็นเรื่องสำคัญ แต่ก็อาจถูกนำไปใช้ในทางที่ผิดได้เช่นกัน ยกตัวอย่างเช่น หาก owner เพิ่มฟังก์ชั่นซ้อนไว้ด้านหลังทำให้เขาสามารถส่งซอมบี้จากใครก็ได้เข้าสู่กองทัพซอมบี้ของตนเอง

>ดังนั้น จึงเป็นเรื่องสำคัญที่ควรจำไว้ว่าแม้ DApp จะอยู่บน Ethereum ก็ไม่ได้แปลว่ามันจะแตกแยกออกมาจากส่วนกลางเท่าใดนัก — ให้เข้าไปอ่าน source code ฉบับเต็มได้เพื่อให้ดูแน่ใจว่ามันไม่ได้มีการควบคุมพิเศษโดยเจ้าของโค้ด ที่อาจจะทำให้คุณกังวลในภายหลังเลย ในมุมมองของนักพัฒนาก็ยังมีประเด็นในเรื่องความสมดุลย์ระหว่างเรื่องของการรักษาไว้ซึ่งการควบคุม DApp ไว้ ซึ่งจะทำให้คุณยังสามารถเข้าไปแก้ bug ต่างๆ ที่อาจจะเกิดได้ เป็นต้น และการสร้าง platform ที่ owner จะมีส่วนเกี่ยวข้องด้วยน้อยลงเพื่อให้ผู้ใช้สามารถเชื่อถือว่าข้อมูลของพวกเขาจะปลอดภัย

## ทดสอบ

ตอนนี้เราสามารถจำกัดการเข้าถึง `setKittyContractAddress` ได้แล้ว ซึ่งจะทำให้ผู้อื่นนอกเหนือจากพวกเราไม่สามารถเข้าไปปรับเปลี่ยนอะไรได้ในอนาคต

1. เพิ่ม modifier `onlyOwner` เข้าไปยัง `setKittyContractAddress`
