---
title: Public Functions & Security
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

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          // 1. ทำฟังก์ชั่นนี้ให้เป็นแบบ internal
          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // 2. ทำการสร้างตัวเช็คสำหรับ `_isReady` ตรงนี้
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            // 3. เรียกใช้ `_triggerCooldown`
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
---

ถึงเวลาของการปรับแต่ง `feedAndMultiply` เพื่อให้มีการรับค่า cooldown timer เข้าไปกันแล้วล่ะ

เมื่อกลับไปปดูที่ตัวฟังก์ชั่นนี้จะพบว่าเราได้ตั้งค่าให้มันเป็น `public` ในบทที่แล้ว ซึ่งเราควรฝึกการมองถึงความปลอดภัยเอาไว้สักหน่อย โดยการเข้าตรวจสอบทุกๆ ฟังก์ชั่นที่เป็นแบบ `public` และ `external` ว่าอาจจะเกิดการล่วงละเมิดจากผู้ใช้ได้โดยทางใดบ้าง จำไว้ว่า — แม้ว่าฟังก์ชั่นนี้จะไม่มีตัว modifier เช่น `onlyOwner` แต่ผู้ใช้ก็ยังสามารถเรียกและเพิ่มข้อมูลต่างๆ เข้าไปได้อยู่ดี

ลองมาตรวจสอบฟังก์ชั่นแบบนี้ดูอีกครั้งก็จะพบว่า ผู้ใช้จะสามารถเรียกใช้ฟังก์ชั่นได้ด้วยตัวเอง และทำการใส่ค่า `_targetDna` หรือ `_species` ใดๆ ก็ตามที่ตัวเองอยากจะได้ลงไป —ซึ่งเราไม่ต้องการเช่นนั้น พวกเธอต้องทำตามกฎสิ!

พิจารณาลงไปอีกจะเห็นว่า ฟังก์ชั่นนี้จำเป็นจะต้องถูกเรียกเพียงแค่ `feedOnKitty()`เพราะฉะนั้นวิธีที่ง่ายที่สุดในการป้องกันก็คือการตั้งให้มันมีค่าเป็น `internal`.

## ทดสอบกันเถอะ

1. ในตอนนี้ `feedAndMultiply` เป็นฟังก์ชั่น `public` อยู่ เราจึงต้องมาทำให้มันเป็น `internal` เพื่อให้ contract นั้นมีความปลอดภัยมากขึ้น เราไม่ต้องการให้ผู้ใช้สามารถใส่ค่า DNA เองได้ตามใจชอบนั่นเอง

2. มาทำให้ `feedAndMultiply` มีการรับค่า `cooldownTime` เข้าไปกัน อันดับแรกให้ไปดูที่ `myZombie` ให้ทำการเพิ่ม `require` statement ที่จะสามารถเช็ค `_isReady()` และเพิ่ม `myZombie` เข้าไป วิธีนี้จะทำให้ผู้ใช้ execute ฟังก์ชั่นได้แค่หลังจากที่หมดช่วงเวลา cooldown ไปแล้ว

3. ในตอนท้ายสุดของฟังก์ชั่นให้เรียกใช้ `_triggerCooldown(myZombie)` เพื่อให้การออกล่านั้นส่งผลต่อ cooldown time ของเจ้าซอมบี้
