---
title: Comments
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieownership.sol": |
        pragma solidity ^0.4.19;

        import "./zombieattack.sol";
        import "./erc721.sol";
        import "./safemath.sol";

        /// TODO: แทนที่ด้วย natspec descriptions
        contract ZombieOwnership is ZombieAttack, ERC721 {

          using SafeMath for uint256;

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) public view returns (uint256 _balance) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) public view returns (address _owner) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
            ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
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
      "zombiefactory.sol": |
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

      import "./zombieattack.sol";
      import "./erc721.sol";
      import "./safemath.sol";

      contract ZombieOwnership is ZombieAttack, ERC721 {

        using SafeMath for uint256;

        mapping (uint => address) zombieApprovals;

        function balanceOf(address _owner) public view returns (uint256 _balance) {
          return ownerZombieCount[_owner];
        }

        function ownerOf(uint256 _tokenId) public view returns (address _owner) {
          return zombieToOwner[_tokenId];
        }

        function _transfer(address _from, address _to, uint256 _tokenId) private {
          ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
          ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
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
---

โค้ด Solidity สำหรับ zombie game ของเราตอนนี้ก็เสร็จสมบูรณ์แล้วววว!

ในบทต่อไป เราจะมาดูวิธีของการ deploy โค้ดลงบน Ethereum และการจะ interact กับมันด้วยการใช้ Web3.js 

แต่สิ่งสุดท้ายก่อนที่เราจะจบบทที่ 5 กันไป: มาพูดเกี่ยวกับการ **เพิ่ม comment ให้โค้ด** กันก่อน

## Syntax สำหรับ comments

การเพิ่ม comment ภายใน Solidity นั้นก็เหมือนกันกับใน JavaScript เป๊ะๆ ซึ่งเราก็ได้เห็นตัวอย่างของการ comment ภายใน 1 บรรทัดผ่าน CryptoZombies lesson ไปแล้ว:

```
// นี่คือการ comment ภายใน 1 บรรทัด ซึ่งจะเหมือนกับการเขียนโน้ตไว้ให้กับตัวเอง (หรือให้ผู้อื่นก็ได้)
```

เพียงแค่เพิ่มเครื่องหมายคั่นคู่ `//` ที่ไหนก็ได้ ซึ่งจะหมายถึงว่าเรากำลัง comment อยู่นั่นเอง เป็นเรื่องง่ายๆ ที่เราควรทำตลอดเวลา

แต่ว่าเราได้ยินมาว่า — บางทีหนึ่งบรรทัดนั้นก็ไม่เพียงพอสำหรับ comment ของคุณที่ต้องถูกเรียบเรียงอย่างพิถีพิถันน่ะสิ!

ดังนั้นเรายังมีการเพิ่ม comment แบบ multi-line comments:

```
contract CryptoZombies {
  /* นี่คือ multi-lined comment ฉันต้องการที่จะขอบคุณพวกคุณทุกๆ คนที่ได้ใช้เวลาในการศึกษาคอร์สนี้อย่างจริงจัง ฉันทราบดีว่าคุณไม่จำเป็นจะต้องเสียค่าใช้จ่ายให้กับทางเรา และมันจะเป็นเช่นนี้ไปตลอด อย่างไรก็ตามเราก็ได้ใส่ใจให้กับทุกรายละเอียดในการทำให้แต่ละบทเรียนนั้นออกมาดีที่สุดเท่าที่เราจะทำได้เพื่อพวกคุณทุกคน

    ขอบอกให้ทราบก่อนว่านี่เป็นเพียงส่วนแรกเริ่มเท่านั้นในการพัฒนา Blockchain เราได้เดินหน้ากันมาไกลมากๆ แต่ก็ยังมีอีกหลายหนทางในการทำให้สังคมเหล่านี้น่าอยู่มากยิ่งขึ้น หากว่าเรามีข้อผิดพลาดประการได้ คุณสามารถช่วยเราได้และ open pull request ได้ที่นี่:
    https://github.com/loomnetwork/cryptozombie-lessons

    หากว่ามีไอเดียอะไรใหม่ๆ คอมเม้นท์ หรือเพียงแค่ต้องการทักทายกัน
     - เข้ามายัง Telegram community ของเราได้ที่ https://t.me/loomnetwork
  */
}
```

โดยส่วนใหญ่แล้วนับว่าเป็นนิสัยที่ดีในการ comment โค้ดบ่อยๆ เพื่ออธิบาย behavior ที่เราคาดว่าจะเกิดจากแต่ละฟังก์ชั่นใน contract ของเรา วิธีนี้จะทำให้นักพัฒนาท่านอื่นๆ (หรือแม้แต่ตัวคุณเองที่อาจจะห่างหายไปจากโปรเจคเป็นเวลา 6 เดือน!) สามารถมองโค้ดผ่านๆ แล้วเข้าใจได้อย่างลึกซึ้งว่าโค้ดของเราได้ทำอะไรไปบางโดยที่ไม่ต้องไปนั่งอ่านตัวโค้ดให้ลายตา

มาตรฐานภายใน Solidity community นั้นคือการใช้ format ที่เรียกว่า **_natspec_** ที่จะมีหน้าตาดังนี้:

```
/// @title A contract for basic math operations
/// @author H4XF13LD MORRIS 💯💯😎💯💯
/// @notice ตอนนี้ contract นี้ก็ได้เพิ่ม multiply function เข้าไปเป็นที่เรียบร้อย
contract Math {
  /// @notice Multiplies 2 numbers together
  /// @param x the first uint.
  /// @param y the second uint.
  /// @return z the product of (x * y)
  /// @dev ฟังก์ชั่นนี้ในตอนนี้จะยังไม่มีการตรวจสอบในเรื่องของ overflows
  function multiply(uint x, uint y) returns (uint z) {
    // ส่วนตรงนี้คือ comment ธรรมดาที่จะไม่ถูกรับไปโดย natspec
    z = x * y;
  }
}
```

ในส่วนของ `@title` และ `@author` ค่อนข้างจะเข้าใจง่าย

`@notice` ใช้อธิบายให้ **ผู้ใช้ได้เข้าใจ** ว่า contract หรือ function ทำหน้าที่อะไรบ้าง และ `@dev` จะมีไว้เพื่ออธิบายรายละเอียดอื่นๆ ปลีกย่อย

`@param` และ `@return` มีหน้าที่ในการอธิบายว่าพารมิเตอร์หรือ return value มีหน้าที่ทำอะไร

ซึ่งคุณไม่ต้องใช้ทั้งหมดนี้เสมอไปในทุกๆ function เพราะแท็กเหล่านี้เป็นเพียงตัวเลือกเท่านั้น แต่อย่างน้อยที่สุดก็ควรจะมีการแท็ก `@dev` เพื่อให้ developer ท่านอื่นได้เข้าใจ function ได้ดีขึ้น

# มาทดสอบกัน

หากไม่ได้สังเกตุ ส่วนของ CryptoZombies answer-checker จะไม่สนใน comment ต่าง ๆ เวลาเช็คคำตอบของเรา ดังนั้นเราจึงไม่สามารถเช็ค natspec โค้ดของทุกท่านได้ในบทนี้ ;)

แต่ถึงอย่างนั้นก็ตาม เราเชื่อว่าคุณเป็นถึงผู้เชี่ยวชาญในเรื่องของ Solidity ไปแล้วนี่นา — เราจะสมมติว่าคุณเข้าใจสิ่งที่เราพูดไปทั้งหมดเลยก็แล้วกัน!

ลองเพิ่ม natspec tags ไปยัง `ZombieOwnership` กันดู:

1. `@title` — ตัวอย่างเช่น นี่คือcontract ที่ช่วยจัดการการส่งต่อ ownership ต่อซอมบี้

2. `@author` — ชื่อของเรานี่ล่ะ!

3. `@dev` — ตัวอย่างเช่น ทำตามแบบในโค้ดของ OpenZeppelin ของ ERC721 spec draft
