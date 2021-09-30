---
title: Zombie Cooldowns
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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          // 1. ตั้งฟังก์ชั่น `_triggerCooldown` ตรงนี้

          // 2. ตั้งฟังก์ชั่น `_isReady` ตรงนี้

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

ตอนนี้คุณสมบัติ `readyTime` ก็ได้ถูกสร้างแล้วใน struct `Zombie` ของเรา ขยับมาที่ `zombiefeeding.sol` กันดีกว่าเพื่อที่จะได้เพิ่ม cooldown timer เข้าไป

เราจะมาปรับแต่ง `feedAndMultiply` ให้มีลูกเล่นดังนี้:

1. หลังการออกล่าจะทำให้เกิดช่วงเวลา cooldown ของซอมบี้ และ

2. ซอมบี้จะไม่สามารถออกล่าน้องแมว ได้จนกว่าจะหมดช่วงเวลา cooldown 

ทำให้ซอมบี้จะไม่สามารถออกล่าแบบต่อเนื่องและเจริญเติบโตแบบไม่สิ้นสุดไปได้ทั้งวัน ในอนาคตเมื่อเราได้ทำการเพิ่มลูกเล่นให้กับการประลอง ก็จะทำให้มีระยะเวลา cooldown เมื่อจะทำการประลองกับซอมบี้ตัวอื่นๆ ด้วยเช่นกัน

อันดับแรก เราจะมาทำการเพิ่มตัว helper function ที่จะช่วยให้เราสามารถตั้งค่าและดู `readyTime` ของเจ้าซอมบี้ได้

## Passing structs ในรูปของ arguments

สามารถที่จะเพิ่ม storage pointer เข้าไปยัง struct ในรูปแบบของ argument เข้าไปยังฟังก์ชั่นชนิด `private` หรือ `internal` โดยสิ่งนี้ถือว่ามีประโยชน์มาก เช่น กรณีที่ต้องการเพิ่ม struct `Zombie` ไปมาระหว่างฟังก์ชั่น

หน้าตาของ syntax ก็จะประมาณนี้:

```
function _doStuff(Zombie storage _zombie) internal {
  // ทำอะไรบางอย่างกับ _zombie
}
```

ด้วยวิธีการแบบนี้จะทำให้เราสามารถเพิ่ม reference เข้าไปให้ซอมบี้ภายในฟังก์ชั่น แทนที่จะต้องมานั่งเพิ่มเข้าไปยัง zombie ID และคอยปรับไปเรื่อยๆ 

## ถึงช่วงการทดสอบแล้ว

1. เริ่มจากการ define ฟังก์ชั่น `_triggerCooldown` ขึ้นมา โดยให้มีการรับค่า 1 argument ก็คือ `_zombie` ซึ่งจะเป็นตัว pointer ของ `Zombie storage` และชนิดของฟังก์ชั่นควรเป็น `internal`.

2. ในส่วน body ของฟังก์ชั่น ให้ตั้งค่า `_zombie.readyTime` เป็น `uint32(now + cooldownTime)`.

3. ต่อมา สร้างฟังก์ชั่นที่ชื่อว่า `_isReady` ซึ่งฟังก์ชั่นนี้ก็จะรับ argument `Zombie storage` ที่ชื่อว่า `_zombie`ด้วยเช่นกัน ควรเป็นฟังก์ชั่น `internal view` และมีการรีเทิร์นผลลัพธ์ออกมาเป็นชนิด `bool`

4. ส่วน body ของฟังก์ชั่นควรรีเทิร์น `(_zombie.readyTime <= now)` ออกมา ซึ่งจะถูกคำนวณว่าเป็น `true` หรือ `false` ฟังก์ชั่นนี้จะเป็นตัวที่บอกเราว่าครบกำหนดเวลา cooldown แล้วหรือยังหลังจากที่ซอมบี้นั้นได้ออกล่าไปครั้งล่าสุด
