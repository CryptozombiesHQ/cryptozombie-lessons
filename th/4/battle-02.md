---
title: Random Numbers
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // เขียนโค้ดใหม่ตรงนี้
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
          }

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
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
      import "./zombiehelper.sol";

      contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
      }

---

ดีมาก! ตอนนี้ก็มาหาวิธีการต่อสู้กันเถอะ

เกมที่ดีส่วนใหญ่ควรจะมีเรื่องของการสุ่มประกอบอยู่ด้วย แล้วเราจะมาสุ่มเลขใน Solidity ยังไงกันดี ?

คำตอบก็คือเราไม่สามารถทำได้น่ะสิ หรือจริง ๆ ก็คือเราไม่สามารถจะสุ่มขึ้นมาอย่างปลอดภัยได้ต่างหาก

มาดูเหตุผลกัน

##  Random number generation via `keccak256`

ในเรื่องของการสุ่มภายใน Solidity เรามีแหล่งที่ดีอยู่แล้ว ซึ่งก็คือ `keccak256` hash function นั่นเอง

โดยสามารถทำตามตัวอย่างที่กำลังจะกล่าวถึงนี้ได้เมื่อต้องการที่จะสุ่มเลขขึ้นมา:

```
// สุ่มเลขระหว่าง 1 ถึง 100:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

สิ่งที่มันทำก็คือรับ timestamp ของ `now`, `msg.sender`, และ `nonce` ที่เป็นส่วนของ increment (เป็นเลขที่จะถูกใช้เพียงครั้งเดียว ดังนั้นเราจะไม่รัน hash function เดิมด้วย input parameter เดิมอีกเป็นครั้งที่สอง)

เราจึงจะใช้ `keccak` ในการแปลงอินพุทเหล่านี้ให้ไปเป็น random hash และแปลง hash ให้ไปอยู่ในรูปของ `uint` จากนั้นก็ใช้การ `% 100` ในการรับข้อมูลเพียงแค่ 2 ตัวสุดท้ายเท่านั้น ซึ่งจะทำให้เราได้มาซึ่งเลขสุ่มระหว่าง 0 ถึง 9 ในที่สุด

### วิธีดังกล่าวจะค่อนข้างเสี่ยงต่อการถูกคุกคามโดย node อื่นที่ไว้ใจไม่ได้

ใน Ethereum ถ้าหากมีการเรียกใช้ฟังก์ชั่นใน contract จะหมายถึงการ broadcast ออกไปยังหนึ่งหรือหลาย node บนเน็ตเวิร์คในรูปแบบของ **_transaction_** โดย node บนเน็ตเวิร์คก็จะทำการเก็บข้อมูลของ transaction ไว้เพื่อที่จะเป็นหน่วยแรกในการคำนวณต่าง ๆ - ปัญหาทางคณิตศาสตร์ขั้นสูงในรูปแบบของ "Proof of Work" และจากนั้นก็จะปล่อยกลุ่มข้อมูล transaction ออกมาร่วมกันกับ Proof of Work (PoW) นั้น ๆ ของมันซึ่งเป็นในรูปแบบ **_block_** ไปยังเน็ตเวิร์คที่เหลือ

เมื่อ node หนึ่งได้ทำการแก้ PoW จะทำให้ node อื่น ๆ ไม่เข้ามายุ่งเกี่ยวในการแก้ PoW นั้น ๆ ต่อมาจึงตรวจสอบว่าลิสต์ข้อมูล transaction ของ node อื่น มีความถูกต้องหรือไม่ แล้วสุดท้ายจึงจะทำการรับ block และเข้ามาและทำการแก้ block ถัดไปเรื่อย ๆ

**วิธีนี้จะทำให้ฟังก์ชั่นสุ่มเลข (random number function) ถูกใช้ในการเอาเปรียบได้**

ขออธิบายในรูปแบบของการโยนเหรียญก็แล้วกันเนอะ — หากเหรียญออกหัวจะทำให้เราได้รับเงินเป็น 2 เท่า และเราจะเสียทุกอย่างไปหากโยนเหรียญออกมาเป็นก้อย ซึ่งเราจะทำการใช้ฟังก์ชั่นสุ่มข้างต้นในการสุ่มกำหนดว่าเหรียญจะออกหัวหรือก้อย (`random >= 50` เป็นหัว และ `random < 50` เป็นก้อย)

ยกตัวอย่างเช่น หากกำลังรัน node หนึ่งอยู่ โดยสามารถที่จะ publish transaction **มายัง node ของเราได้เพียงอันเดียว** และไม่ทำการแชร์มัน จะทำให้สามารถรันฟังก์ชั่นโยนเหรียญได้เพื่อจะดูว่าชนะหรือไม่ — หากว่าแพ้ก็จะสามารถเลือกว่าจะไม่ให้ transaction นั้นมาปรากฎอยู่ใน block ถัดไปที่เรากำลังแก้ได้ ซึ่งสามารถทำแบบนี้ไปได้ไม่จำกัดจำนวนครั้งจนกว่าจะชนะการโยนเหรียญนี้ แล้วค่อยไปแก้ block ถัดไป อีกทั้งยังทำให้ได้กำไรอีกด้วย

## แล้วจะทำอย่างไรเพื่อการสุ่มเลขอย่างปลอดภัยใน Ethereum กันดีล่ะ?

เนื่องจากผู้เข้าร่วมสามารถเห็นเนื้อหาทั้งหมดใน blockchain ได้ ทำให้นี่ถือว่าเป็นปัญหาที่ยากพอสมควร และการแก้ปัญหาก็นอกเหนือไปจากขอบเขตเนื้อหาที่เราจะสอนกันอีกด้วย ลองเข้าไปอ่านเนื้อหาใน <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>this StackOverflow thread</a> ดูได้นะ หนึ่งในนั้นจะเป็นไอเดียของการใช้ **_oracle_** ในการเข้าถึงฟังก์ชั่นสุ่มเลขจากภายนอกของ Ethereum blockchain

และเนื่องจากมีอีกหลาย node บน Ethereum ภายในเน็ตเวิร์คที่ก็พยายามจะเข้ามาแก้ block ต่อไปเช่นกัน ความแตกต่างที่เราจะเข้าไปแก้ block ถัดไปเมื่อเทียบกับ node อื่น ๆ นั้นถือว่าน้อยมาก ซึ่งก็จะกินเวลาหรือทำให้เราสูญเสียกำไรไปในการคำนวณเป็นจำนวนมาก  — แต่หากว่าผลลัพธ์ที่ได้มีสูงมากพอ(ยกตัวอย่างเช่นเราสามารถพนัน $100,000,000 ในฟังก์ชั่นโยนเหรียญได้) ก็ถือว่าคุ้มค่าในการที่จะเข้าโจมตี

ดังนั้นเมื่อการสุ่มเลขบน Ethereum นี้ไม่มีความปลอดภัยแต่อย่างใด และในความเป็นจริงหากฟัง
ก์ชั่นของเราไม่มีเงินที่มากพอ ก็อาจทำให้ผู้ใช้ไม่มี resource เพียงพอต่อการโจมตี

เนื่องจากตอนนี้สิ่งที่เรากำลังสร้างยังเป็นแค่เกมง่าย ๆ สำหรับจะเป็น demo เท่านั้น และไม่ได้ใช้เงินจริง ๆ จึงอาจจะต้องยอมรับข้อเสียของการใช้ random number generator ซึ่งง่ายต่อการเขียนโค้ดไปก่อน ขอให้เป็นที่รู้กันนะว่าวิธีนี้ยังไม่ปลอดภัยเท่าไหร่นัก

บทเรียนในอนาคตนั้น เราจะสอนไปจนถึงการใช้ **_oracles_** (เป็นวิธีการที่ปลอดภัยในการดึงข้อมูลเข้ามาจากภายนอก Ethereum) ในการที่จะสร้างเลขสุ่มขึ้นมาอย่างปลอดภัยจากภายนอก blockchain

## มาทดสอบกันเถอะ

ได้เวลาเขียนโค้ดฟังก์ชั่นสุ่มเลข โดยเราจะใช้เพื่อการวิเคราะห์ผลที่จะได้จากการต่อสู้ที่จะสร้างขึ้น แม้ว่าการต่อสู้จะยังไม่มีความปลอดภัยก็ตาม

1. ตั้งตั้วแปรใน contract ของเราที่เป็นข้อมูลชนิด `uint` ใช้ชื่อว่า `randNonce`และตั้งให้มีค่าเท่ากับ `0`

2. สร้างฟังก์ชั่นที่มีชื่อว่า `randMod` (random-modulus) ซึ่งจะเป็นฟังก์ชั่นชนิด `internal` ที่จะรับข้อมูลชนิด `uint` ที่มีชื่อว่า `_modulus`และ `returns` ข้อมูลชนิด `uint`ออกมา

3. ฟังก์ชั่นควรเริ่มจากการ increment ค่า `randNonce` (โดยใช้ syntax `randNonce++`)

4. ในที่สุด (ภายในโค้ด 1 บรรทัด) ควรสามารถคำนวณ `uint` typecast ของ hash `keccak256` ของตัวแปร `now`, `msg.sender`, และ `randNonce` — รวมทั้ง `return` ค่าที่เกิดจากการ `% _modulus` (เฮ้อ! เยอะใช่มั้ยล่ะ หากว่าตามไม่ทันสามารถเข้าไปดูตัวอย่างข้างต้นที่เราได้สร้างเลขสุ่มเอาไว้ก็แล้วกัน  — ตรรกะของมันก็จะคล้าย ๆ กัน)
