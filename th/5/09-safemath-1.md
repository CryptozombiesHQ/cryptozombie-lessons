---
title: การป้องกัน Overflows
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";
        // 1. Import ตรงนี้เลย

        contract ZombieFactory is Ownable {

          // 2. ประกาศค่าโดยใช้ safemath ตรงนี้

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;
          uint cooldownTime = 1 days;

          struct Zombie {
            string name;
            uint dna;
            uint32 level;
            uint32 readyTime;
            uint16 winCount;
            uint16 lossCount;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) internal {
            uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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
      "zombieownership.sol": |
        pragma solidity ^0.4.19;

        import "./zombieattack.sol";
        import "./erc721.sol";
        
        contract ZombieOwnership is ZombieAttack, ERC721 {

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) public view returns (uint256 _balance) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) public view returns (address _owner) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to]++;
            ownerZombieCount[_from]--;
            zombieToOwner[_tokenId] = _to;
            Transfer(_from, _to, _tokenId);
          }

          function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            _transfer(msg.sender, _to, _tokenId);
          }

          function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _to;
            Approval(msg.sender, _to, _tokenId);
          }

          function takeOwnership(uint256 _tokenId) public {
            require(zombieApprovals[_tokenId] == msg.sender);
            address owner = ownerOf(_tokenId);
            _transfer(owner, msg.sender, _tokenId);
          }
        }
      "zombieattack.sol": |
        pragma solidity ^0.4.19;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          uint randNonce = 0;
          uint attackVictoryProbability = 70;

          function randMod(uint _modulus) internal returns(uint) {
            randNonce++;
            return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
          }

          function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            Zombie storage enemyZombie = zombies[_targetId];
            uint rand = randMod(100);
            if (rand <= attackVictoryProbability) {
              myZombie.winCount++;
              myZombie.level++;
              enemyZombie.lossCount++;
              feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
            } else {
              myZombie.lossCount++;
              enemyZombie.winCount++;
              _triggerCooldown(myZombie);
            }
          }
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

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
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

          modifier onlyOwnerOf(uint _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            _;
          }

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal onlyOwnerOf(_zombieId) {
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
      "safemath.sol": |
        pragma solidity ^0.4.18;

        /**
         * @title SafeMath
         * @dev Math operations with safety checks that throw on error
         */
        library SafeMath {

          /**
          * @dev Multiplies two numbers, throws on overflow.
          */
          function mul(uint256 a, uint256 b) internal pure returns (uint256) {
            if (a == 0) {
              return 0;
            }
            uint256 c = a * b;
            assert(c / a == b);
            return c;
          }

          /**
          * @dev Integer division of two numbers, truncating the quotient.
          */
          function div(uint256 a, uint256 b) internal pure returns (uint256) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint256 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          /**
          * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
          */
          function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            assert(b <= a);
            return a - b;
          }

          /**
          * @dev Adds two numbers, throws on overflow.
          */
          function add(uint256 a, uint256 b) internal pure returns (uint256) {
            uint256 c = a + b;
            assert(c >= a);
            return c;
          }
        }
      "erc721.sol": |
        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

          function balanceOf(address _owner) public view returns (uint256 _balance);
          function ownerOf(uint256 _tokenId) public view returns (address _owner);
          function transfer(address _to, uint256 _tokenId) public;
          function approve(address _to, uint256 _tokenId) public;
          function takeOwnership(uint256 _tokenId) public;
        }
    answer: |
      pragma solidity ^0.4.19;

      import "./ownable.sol";
      import "./safemath.sol";

      contract ZombieFactory is Ownable {

        using SafeMath for uint256;

        event NewZombie(uint zombieId, string name, uint dna);

        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
        uint cooldownTime = 1 days;

        struct Zombie {
          string name;
          uint dna;
          uint32 level;
          uint32 readyTime;
          uint16 winCount;
          uint16 lossCount;
        }

        Zombie[] public zombies;

        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;

        function _createZombie(string _name, uint _dna) internal {
          uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
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

ยินด้วยจ้า ตอนนี้ทุกคนในที่นี้ก็โค้ด ERC721 สำเร็จกันไปเป็นที่เรียบร้อยแล้วนะ!

ไม่เห็นจะยากเลยใช่มั้ยล่ะ? หลายๆ เรื่องเกี่ยวกับ Ethereum นั้นฟังดูซับซ้อนมากๆ เมื่อเราได้ยินผู้คนพูดถึงเกี่ยวกับมัน แต่หากเราได้ลองมาโค้ดมันดูจริงๆ ย่อมจะเป็นวิธีที่ดีที่สุดที่ทำให้เราสามารถเข้าใจได้มากขึ้นแน่นอน

อย่างไรก็ตาม จำไว้ว่าตรงส่วนนี้เป็นเพียงแค่การเขียนโค้ดแบบง่ายๆ เท่านั้น จริง ๆ แล้วยังมี feature อื่นอีกมากมายที่เราอาจจะต้องเพิ่มลงไป เช่น การตรวจสอบขั้นที่สูงขึ้นในการป้องกันไม่ให้ผู้ใช้บังเอิญโอน ซอมบี้ของพวกเขาไปยัง address `0` (ซึ่งมันจะถูกเรียกว่า "การผลาญ" token — ปกติแล้ว token จะถูกส่งไปยัง address ที่ไม่มีใครมี private key ซึ่งเป็นส่วนสำคัญที่ทำให้มันไม่สามารถถูกเรียกคืนกลับมาได้) หรือว่าให้เพิ่มบาง basic auction logic ลงใน DApp ได้ด้วยตัวมันเอง (นึกช่องทางอื่นในการโค้ดมันได้หรือเปล่า?)

แต่เพราะเราต้องการให้บทเรียนนี้ยังคงความเรียบง่ายไว้อยู่ จึงขอพูดถึงการโค้ดสุดง่ายก่อนก็แล้วกัน หากต้องการดูตัวอย่างของการ implementation ที่ลึกมากขึ้น สามารถเข้าไปดูได้ที่ OpenZeppelin ERC721 contract หลังจาก tutorial นี้ได้เลย

### การเพิ่มความปลอดภัยให้กับ contract (Contract security enhancements): Overflows และ Underflows

เราจะมาดู feature เกี่ยวกับความปลอดภัยหลักๆ ที่จำเป็นจะต้องคำนึงถึงในการเขียน smart contract ใดๆ ก็ตาม: นั่นคือการป้องกัน overflows และ underflows

แล้ว **_overflow_** คืออะไรกันล่ะเนี่ย?

ให้สมมติว่าเรามี `uint8` ซึ่งจะสามารถมีได้เพียง 8 bit แปลว่าหากจำนวนที่สูงที่สุดที่เราสามารถเก็บได้คือเลข binary `11111111` (หากเป็นในรูปของ decimal ก็คือ 2^8 - 1 = 255)

ลองดูโค้ดด้านล่างนี้ ในตอนสุดท้าย `number` นั้นจะมีค่าเท่ากับเท่าไหร่กัน?

```
uint8 number = 255;
number++;
```

กรณีนี้เราได้ทำให้มันเกิด overflow ขึ้น — ดังนั้น `number` จะโดนนับให้เป็น `0` โดยอัตโนมัติแม้ว่าเราจะบอกให้มันเพิ่มจำนวนขึ้นจาก 255 ก็ตาม (ถ้าเราเพิ่ม 1 ไปยัง binary อีก จาก `11111111` จะถูกรีเซ็ตกลับไปเป็น `00000000` ก็เหมือนกับนาฬิกาที่เดินจาก `23:59` ไป `00:00` นั่นเอง)

ส่วน underflow นั้นก็เป็นในรูปแบบเดียวกัน คือหากลบ `1` ออกจาก `uint8` ที่มีค่า `0` มันจะมีค่าเท่ากับ `255` ทันที (เนื่องจากข้อมูลชนิด `uint` นั้นเป็น unsigned ทำให้ไม่สามารถติดลบได้)

แม้ว่าเราจะไม่ได้ใช้ `uint8` ในส่วนนี้ และเป็นไปไม่ได้เลยที่ `uint256` จะ overflow เมื่อมีการเพิ่มจำนวนด้วย `1` ในแต่ละครั้ง (2^256 เป็นจำนวนที่สูงมากๆ) แต่การเพิ่มการป้องกันลงไปใน contract ของเราก็ยังถือเป็นการดีกว่าเพื่อป้องกันไม่ให้ DApp เกิด behavior ที่ไม่คาดคิดในอนาคตได้

### การใช้ SafeMath

ในการป้องกันเหตุการณ์ดังกล่าว OpenZeppelin จึงได้สร้าง **_library_** ที่มีชื่อว่า SafeMath ซึ่งช่วยในการป้องกันกรณีต่างๆ ตั้งแต่แรกเริ่ม

แต่ก่อนที่เราจะไปถึงเรื่องราวตรงส่วนนั้น... library นั้นคืออะไร?

 **_library_** คือ contract ชนิดพิเศษใน Solidity โดย library จะมีประโยชน์มากๆ ในการ attach ฟังก์ชั่นต่างๆ ให้กับ native data type นั่นเอง

ยกตัวอย่างการใช้ SafeMath library เราจะใช้ syntax `using SafeMath for uint256` SafeMath library มีฟังก์ชั่นอยู่ 4 ฟังก์ชั่น ได้แก่ — `add`, `sub`, `mul`, และ `div` และเราสามารถใช้ฟังก์ชั่นดังกล่าวนี้จาก `uint256` ดังนี้:

```
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```

ใน chapter ต่อไปจะกล่าวถึงหน้าที่ของฟังก์ชั่นพวกนี้้ ในระหว่างนี้ก็มาเพิ่ม SafeMath library ไปยังcontract ขอวงเราก่อนดีกว่า

## ได้เวลาทดสอบแล้ว

เราได้เพิ่ม `SafeMath` library ของ OpenZeppelin ไว้ให้เป็นที่เรียบร้อยแล้วภายใน `safemath.sol` อันที่จริงเราสามารถเข้าสู่ขั้นตอนที่ลึกซึ้งขึ้นได้ตั้งแต่ตรงนี้ แต่เอาเป็นว่าค่อยไปดูกันในบทต่อไปดีกว่าเนอะ

อันดับแรกคือการให้ contract ของเราใช้ SafeMath ก่อน โดยเราจะทำภายใน contract ZombieFactory ซึ่งเป็น contract สุดพื้นฐานนั่นเอง — วิธีนี้จะทำให้สามารถใช้มันได้ใน sub-contract ใด ๆ ก็ได้ที่มีการ inherit มาจากเจ้า ZombieFactory นี้

1. ทำการ import `safemath.sol` ไปยัง `zombiefactory.sol`

2. เพิ่มการประกาศค่า `using SafeMath for uint256;`
