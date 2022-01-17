---
title: "เนื้อหาพิเศษ!: Kitty Genes"
actions: ['checkAnswer', 'hints']
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // Modify function definition here:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // ใส่ if statement ได้ตรงนี้
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // And modify function call here:
            feedAndMultiply(_zombieId, kittyDna);
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
                randDna = randDna - randDna % 100;
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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

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

ตอนนี้ logic ในฟังก์ชั่นของเราก็เสร็จสมบูรณ์แล้ว... แต่ก็มาเพิ่ม bonus feature กันอีกหน่อยดีกว่า

ลองให้ซอมบี้ที่ถูกสร้างขึ้นมาจาก kitties มีลักษณะพิเศษที่บอกว่ามันคือ cat-zombies ซอมบี้น้องแมวนั่นเอง!

ในการที่จะทำให้เป็นเช่นนั้นได้ เราสามารถเพิ่ม kitty code เข้าไปภายใน DNA ของซอมบี้

หากยังจำบทเรียนแรกได้ ณ ตอนนี้เราใช้รหัส DNA เพียงแค่ 12 ตัวแรกจาก 16 สำหรับการวิเคราะห์หน้าตาของซอมบี้ ดังนั้นยังสามารถใช้รหัส 2 ตัวสุดท้ายในการรับมือกับลักษณะ "พิเศษ"

เราจะกำหนดให้ cat-zombies มีรหัส `99` อยู่ตรงตำแหน่ง 2 ตัวสุดท้ายใน DNA ของมัน(เพราะแมวมี 9 ชีวิต) ฉะนั้นในโค้ดจะกำหนดเงื่อนไข `if` คือถ้าหากซอมบี้เกิดจากohv'แมว เราจะให้รหัส 2 ตัวสุดท้ายเป็น `99`

## ตัวอย่าง If statements

If statements in Solidity look just like JavaScript:

```
function eatBLT(string sandwich) public {
  // เนื่องจากเราต้องนำ keccak256 hashes มาเปรียบเทียบกัน จึงต้องเก็บตัวแปรเป็นข้อมูลชนิด string
  // เอามาเปรียบเทียบกัน
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# ได้เวลาของการทดสอบ

บรรจุ cat genes ลงในโค้ดซอมบี้

1. ก่อนอื่นให้เปลี่ยน definition ของฟังก์ชั่น `feedAndMultiply` ให้สามารถรับ argument ที่ 3 ได้: ข้อมูลชนิด `string` ที่มีชื่อว่า `_species`

2. ต่อมาหลังจากเราได้คำนวณ DNA ของซอมบี้แล้ว ก็คือเวลาของการเพิ่มเงื่อนไข `if` เพื่อการเปรียบเทียบ `keccak256` hashes ระหว่าง `_species` และข้อมูล string ชื่อว่า`"kitty"`

3. ภายใต้เงื่อนไข `if` เราต้องแทนที่รหัส DNA 2 ตัวสุดท้ายด้วย `99`ในการที่จะทำได้เราต้องใช้ logic ดังนี้: `newDna = newDna - newDna % 100 + 99;`.

  > Explanation: สมมติให้ `newDna` เป็น `334455` ดังนั้น `newDna % 100` มีค่าเท่ากับ `55` ซึ่งทำให้ `newDna - newDna % 100` มีค่า `334400` สุดท้ายเพิ่ม `99` ลงไปที่ตำแหน่ง 2 ตัวสุดท้าย จะกลายเป็น `334499`.

4. ท้ายที่สุดแล้วเราจะต้องเปลี่ยนฟังก์ชั่นที่เรียกภายใน `feedOnKitty` เมื่อมีการเรียกฟังก์ชั่น `feedAndMultiply`ให้เพิ่มตัวแปรชื่อว่า `"kitty"` เข้าไปเป็นตอนสุดท้าย
