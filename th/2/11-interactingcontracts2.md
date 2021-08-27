---
title: การใช้ Interface
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
          // Initialize kittyContract here using `ckAddress` from above

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

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

มาต่อกันในส่วนของตัวอย่างที่ได้ทำไว้ก่อนหน้า `NumberInterface` หลังจากที่เราได้สร้าง interface หน้าตาดังนี้แล้ว:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

ซึ่งทำให้สามารถนำไปใช้ได้ใน contract ได้ดังต่อไปนี้:

```
contract MyContract {
  address NumberInterfaceAddress = 0xab38... 
  // ^ address ของ contract ที่ชื่อว่า FavoriteNumber ซึ่งอยู่บน Ethereum
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress)
  // ตอนนี้ `numberContract` ก็จะมี pointer ชี้ไปยัง contract อื่น

  function someFunction() public {
    // เราสามารถเรียกฟังก์ชัน `getNum` จาก contract อื่นได้แล้ว:
    uint num = numberContract.getNum(msg.sender);
    // ...and do something with `num` here
  }
}
```

ด้วยวิธีนี้จะทำให้ contract ของเราสามารถมีปฎิสัมพันธ์กับ contract อื่น ๆ ที่อยู่บน blockchain ของ EthereumIn ได้ตราบใดที่ฟังก์ชั่นเหล่านั้นมีค่าเป็น `public` หรือ `external`

# มาทดสอบกันเถอะ

มาสร้าง contract ที่เอาไว้อ่าน smart contract ของน้องแมว CryptoKitties กันดีกว่า!

1. เราได้บันทึก address ที่เป็นของ contract ชื่อว่า CryptoKitties ไว้ให้แล้ว โดยจะอยู่ในส่วนของตัวแปรที่ชื่อ `ckAddress` ในโค้ดบรรทัดต่อไป ให้สร้าง `KittyInterface` ที่มีชื่อว่า `kittyContract` และตั้งค่าเริ่มต้นของ interface นี้โดยใช้ `ckAddress` — ทำแบบเดียวกันกับใน `numberContract` ที่แสดงไว้ข้างต้น
