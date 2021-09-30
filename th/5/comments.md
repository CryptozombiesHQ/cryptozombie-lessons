---
title: การสร้าง Comments
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

          // 1. ลบบรรทัดนี้ออก:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. เปลี่ยนส่วนนี้ให้เป็นเพียงแค่การประกาศค่าเท่านั้น:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. เพิ่ม method ที่ชื่อ setKittyContractAddress ตรงนี้เลยจ้า

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

โดยทั่วไปแล้วภาษาโปรแกรมมิ่งใน Solidity หรือ BlockChain เปรียบได้กับภาษาโปรแกรมมิ่งที่ใช้ในอุตสาหกรรมการบิน กล่าวคือหากมีข้อผิดพลาดขึ้นมาเพียงเล็กน้อยแล้วล่ะก็ อาจจะทำให้เครื่องบินทั้งลำตกลงมาก็เป็นได้ หรืออีกตัวอย่างก็คืออาจทำให้กระสวยอวกาศไปไม่ถึงดวงจันทร์ตามที่ตั้งใจไว้ และจะทำให้เรา [สูญเสียรายได้กันไปอย่างมหาศาลเลยทีเดียว](https://medium.com/chain-cloud-company-blog/parity-multisig-hack-again-b46771eaa838).

ความสำคัญของมันจึงสูงมากพอที่จำเป็นจะต้องมีการตรวจสอบจำนวนสอง หรือสามรอบด้วยความใส่ใจในทุกๆ องค์ประกอบเพื่อบอกได้ถึงความหมายและจุดประสงค์เบื้องหลังโค้ดในแต่ละบรรทัด

เรื่องนี้จึงได้นำมาสู่เหตุผลที่ว่าทำไมเราจึงควรให้เวลาไปกับการคอมเม้น `comments` และความสำคัญของมันภายใน Solidity programming. 

## การสร้างคอมเม้นด้วยรูปแบบต่างๆ (Commenting with Style):

```
// ส่วนนี้คือการคอมเม้นภายในหนึ่งบรรทัด ซึ่งมันก็คือการสร้างโน้ตให้กับตัวเราเองนี่ล่ะ (หรือให้คนอื่นอ่านก็ได้นะ)
```

เพียงแค่เพิ่มเครื่องหมาย `//` ณ ตรงที่ใดก็ได้ก็จะหมายถึงว่าขณะนั้นเรากำลังสร้างคอมเม้นแล้ว ซึ่งอะไรแบบนี้เป็นเรื่องที่ควรทำให้เป็นนิสัยอย่างมากเนื่องจากมันเป็นอะไรที่ง่ายสุดๆ แต่อย่างไรก็ตาม เราทราบดีว่าบางทีการคอมเม้นภายในหนึ่งบรรทัดมันก็ไม่เพียงพอสำหรับนักเขียนมือฉมังอย่างเราๆ อะเนอะ:

```
contract CryptoZombies {
  /*
    ตัวอย่างนี้คือการสร้างคอมเม้นแบบหลายบรรทัด ขอขอบคุณทุกๆ คนมากที่เสียสละเวลามาศึกษาคอร์สโปรแกรมมิ่งนี้ แม้ว่าเราจะเปิดบทเรียนนี้ให้เข้ามาศึกษากันแบบฟรีๆ และแน่นอนว่ามันจะเป็นแบบนี้เสมอ เราก็ยังยืนยันว่าจะใส่หัวใจและจิตวิญญาณในการทำมันให้ดีที่สุดเท่าที่จะทำได้เลยนะ

    ขอให้รู้ไว้ว่านี่เป็นเพียงแค่จุดเริ่มต้นในการพัฒนาบล็อกเชนเท่านั้น แม้ว่าเราอาจจะมากันไกลมากกว่าในตอนแรกเป็นที่เรียบร้อย แต่ก็ยังมีอีกหลายอย่างที่ต้องมาเรียนรู้กันเพื่อพัฒนาให้คอมมูนิตี้นี้ดีขึ้นกว่าเดิมให้ได้ หากว่าทางทีมของเราได้ทำผิดพลาดไว้ตรงไหนก็สามารถเข้ามาบอกกันได้โดยสร้าง pull request เอาไว้ที่นี่เล้ย: https://github.com/loomnetwork/cryptozombie-lessons

    ไอเดียหรือคอมเม้นใหม่ๆ ที่อยากจะมาแลกเปลี่ยนกัน หรือแม้แต่การแวะมาทักทายเฉยๆ ก็ได้ - ให้เข้ามาเยี่ยมเยียนกันที่ Telegram ของเรานะจ๊ะ
  */
}
```

แต่บางครั้งภาษาที่เราใช้เขียนก็อาจจะไม่ได้เป๊ะเท่าที่ควรนัก หรือแม้แต่กรณีที่เราต้องการให้มันอ่านง่าย ทำให้จะถึงเวลาของการเพิ่ม document จริงๆ เข้าไปแล้ว

ในคอมมูนิตี้ของเรานี้ มีเทรนด์ที่กำลังนิยมในการใช้แท็ก (tags) `Doxygen` style อยู่ โดย tags เหล่านี้ก็เป็นเพียงแค่วิธีพิเศษที่เพิ่มเข้ามาในการเขียนคอมเม้นที่จะทำมันมีความชัดเจนยิ่งขึ้นและ machine ก็สามารถอ่านได้ง่ายด้วย ซึ่งผลที่ตามมาก็คือความง่าต่อการสร้างเอกสารหรือ docimentation สำหรับผู้อื่น

```
/** @title A basic math operation. */
contract multiply {
    /** 
      * @param x the first variable.
      * @param y the second variable.
      * @return z The answer.
      */
    function multiply(uint x, uint y) returns (uint z) {
        z = x * y;
    }
}
```
