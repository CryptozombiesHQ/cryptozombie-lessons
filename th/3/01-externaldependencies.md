---
title: Contracts ที่ไม่สามารถเปลี่ยนแปลงได้
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

          // 1. ลบส่วนนี้ออก:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. เปลี่ยนส่วนนี้ให้เป็นเพียงแค่การประกาศค่าอย่างเดียว:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. เพิ่ม method ที่ชื่อ setKittyContractAddress ตรงนี้

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
---

ถึงตอนนี้ Solidity ก็มีหน้าตาไม่ต่างกับภาษาอื่นๆ เลย เช่น JavaScript แต่จริงๆ แล้วก็มีอีกหลายจุดที่ทำให้ Ethereum DApps ค่อนข้างจะแตกต่างจากแอพพลิเคชั่นทั่วไป

อันดับแรกขอกล่าวถึงการเริ่มต้นด้วย **_immutable_** หลังจากเราได้สร้าง contract ขึ้นมาบน Ethereum แล้ว ซึ่งนั้นก็แปลว่าเราไม่สามารถแก้ไขหรืออัพเดท contract ได้แล้ว

โค้ดตัวแรกเริ่มที่ได้บรรจุลงไปใน contract จะอยู่อย่างนั้นแบบถาวร ถือว่าเป็นปัจจัยด้านความปลอดภัยอย่างหนึ่งที่เราจะต้องใส่ใจในการเขียน Solidity เพราะถ้าหากว่ามีข้อผิดพลาดในโค้ดของ contract แม้เพียง 1 จุด แน่นอนว่าคุณไม่สามารถกลับไปแก้ไขอะไรมันได้เลย และอาจจะต้องบอก users ไปตามตรงว่าให้ใช้ smart contract อื่นที่ได้แก้แล้วแทน

แต่นี่ก็นับว่าเป็นคุณสมบัติหนึ่งของ smart contract โค้ดคือทรัพสินทางปัญญาชนิดหนึ่ง เมื่อได้อ่าน smart contract และยืนยันความถูกต้องแล้วเรียบร้อย คุณจะสามารถมั่นใจได้เลยว่าคุณจะสามารถเรียกใช้ฟังก์ชั่น และได้ฟังก์ชั่นที่ทำงานตรงตามที่โค้ดได้บอกเอาไว้ จะไม่มีใครสามารถเข้ามาเปลี่ยนฟังก์ชั่นต่างๆ ได้ ซึ่งเป็นเรื่องที่คุณไม่อยากให้เกิดขึ้น

## External dependencies

ในบทเรียนที่ 2 เราได้ทำการ hard-code เพื่อสร้าง address ของ contract ที่ชื่อว่า CryptoKitties ลองมาคิดกันดูว่าจะเกิดอะไรขึ้นหาก CryptoKitties contract เกิดมี bug ขึ้นมาและมีบางคนลบ kitties ออกไปทั้งหมด?

เหตุการณ์ดังกล่าวอาจเกิดขึ้นได้ยากก็จริง แต่หากมันเกิดขึ้นมา แล้วล่ะก็อาจจะทำให้ DApp ของเรานั้นเละเทะไปเลยก็ได้ — DApp จะมุ่งเป้าไปยัง hardcoded address ที่ไม่รีเทิร์น kitty ตัวใดออกมาอีกต่อไป ทำให้ซอมบี้ไม่สามารถจะกิน kitty ได้ เพราะมันไม่มีให้กินนั่นเอง ที่แย่ที่สุดคือเราก็ไม่สามารถเปลี่ยนแปลงอะไรบน contract เพื่อแก้ไขมันเหตุการณ์นี้ได้ด้วย

ด้วยเหตุนี้ ฟังก์ชั่นที่จะยอมให้เราเข้าไปอัพเดท key portions ของ DApp ควรถูกสร้างขึ้นมา

ยกตัวอย่าง เช่น แทนที่เราจะใช้วิธีการ hard code ลงใน address บน contract ที่ชื่อ CryptoKitties ใน DApp เราควรจะต้องมีฟังก์ชั่นที่ชื่อ `setKittyContractAddress` ซึ่งยอมให้เราสามารถเปลี่ยนแปลง address ได้ในอนาคตกรณีที่มีเหตุการณ์แปลกๆ เกิดขึ้นกับ contract CryptoKitties 

## ได้เวลาทดสอบแล้ว

การอัพเดทโค้ดจากบทที่ 2 ให้สามารถเปลี่ยนแปลง address ของ CryptoKitties contract ได้

1. ลบโค้ดในบรรทัดที่เราได้ทำการ hard-code `ckAddress`ไว้

2. เปลี่ยนแปลงบรรทัดที่เราได้สร้าง `kittyContract` เอาไว้ให้เป็นเพียงแค่การประกาศค่าตัวแปรเท่านั้น — เช่น ไม่ต้องกำหนดว่าตัวแปรนั้นต้องมีค่าเท่ากับอะไร

3. สร้างฟังก์ชั่นที่ชื่อ `setKittyContractAddress` โดยจะให้ทำการรับค่า 1 argument ซึ่งก็คือ `_address` (an `address`) และฟังก์ชั่นนี้ควรเป็นประเภท `external` 

4. ภายในฟังก์ชั่นให้เพิ่มโค้ดอีก 1 บรรทัดที่ตั้งค่า  `kittyContract` ให้เท่ากับ `KittyInterface(_address)`.

> Note: หากคุณสงสัยในประเด็นของความปลอดภัยในฟังก์ชั่นนี้แล้วล่ะก็ไม่ต้องกังวลไป — เราจะทำการปรับปรุงมันในบทถัดไป ;)
