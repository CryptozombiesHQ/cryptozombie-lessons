---
title: SafeMath, Часть 2
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieownership.sol": |
        pragma solidity ^0.4.25;

        import "./zombieattack.sol";
        import "./erc721.sol";
        import "./safemath.sol";

        contract ZombieOwnership is ZombieAttack, ERC721 {

          using SafeMath for uint256;

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) external view returns (uint256) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) external view returns (address) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            // 1. Замените на `add` SafeMath
            ownerZombieCount[_to]++;
            // 2. Замените на `sub` SafeMath
            ownerZombieCount[_from]--;
            zombieToOwner[_tokenId] = _to;
            emit Transfer(_from, _to, _tokenId);
          }

          function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
            require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
            _transfer(_from, _to, _tokenId);
          }

          function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _approved;
            emit Approval(msg.sender, _approved, _tokenId);
          }

        }
      "zombieattack.sol": |
        pragma solidity ^0.4.25;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          uint randNonce = 0;
          uint attackVictoryProbability = 70;

          function randMod(uint _modulus) internal returns(uint) {
            randNonce++;
            return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
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
        pragma solidity ^0.4.25;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            address _owner = owner();
            _owner.transfer(address(this).balance);
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
        pragma solidity ^0.4.25;

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
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
        pragma solidity ^0.4.25;

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
            emit NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
            uint rand = uint(keccak256(abi.encodePacked(_str)));
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
        pragma solidity ^0.4.25;

        /**
        * @title Ownable
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
          address private _owner;

          event OwnershipTransferred(
            address indexed previousOwner,
            address indexed newOwner
          );

          /**
          * @dev The Ownable constructor sets the original `owner` of the contract to the sender
          * account.
          */
          constructor() internal {
            _owner = msg.sender;
            emit OwnershipTransferred(address(0), _owner);
          }

          /**
          * @return the address of the owner.
          */
          function owner() public view returns(address) {
            return _owner;
          }

          /**
          * @dev Throws if called by any account other than the owner.
          */
          modifier onlyOwner() {
            require(isOwner());
            _;
          }

          /**
          * @return true if `msg.sender` is the owner of the contract.
          */
          function isOwner() public view returns(bool) {
            return msg.sender == _owner;
          }

          /**
          * @dev Allows the current owner to relinquish control of the contract.
          * @notice Renouncing to ownership will leave the contract without an owner.
          * It will not be possible to call the functions with the `onlyOwner`
          * modifier anymore.
          */
          function renounceOwnership() public onlyOwner {
            emit OwnershipTransferred(_owner, address(0));
            _owner = address(0);
          }

          /**
          * @dev Allows the current owner to transfer control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function transferOwnership(address newOwner) public onlyOwner {
            _transferOwnership(newOwner);
          }

          /**
          * @dev Transfers control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function _transferOwnership(address newOwner) internal {
            require(newOwner != address(0));
            emit OwnershipTransferred(_owner, newOwner);
            _owner = newOwner;
          }
        }
      "safemath.sol": |
        pragma solidity ^0.4.25;

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
        pragma solidity ^0.4.25;

        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

          function balanceOf(address _owner) external view returns (uint256);
          function ownerOf(uint256 _tokenId) external view returns (address);
          function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
          function approve(address _approved, uint256 _tokenId) external payable;
        }
    answer: |
      pragma solidity ^0.4.25;

      import "./zombieattack.sol";
      import "./erc721.sol";
      import "./safemath.sol";

      contract ZombieOwnership is ZombieAttack, ERC721 {

        using SafeMath for uint256;

        mapping (uint => address) zombieApprovals;

        function balanceOf(address _owner) external view returns (uint256) {
          return ownerZombieCount[_owner];
        }

        function ownerOf(uint256 _tokenId) external view returns (address) {
          return zombieToOwner[_tokenId];
        }

        function _transfer(address _from, address _to, uint256 _tokenId) private {
          ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
          ownerZombieCount[_from] = ownerZombieCount[_from].sub(1);
          zombieToOwner[_tokenId] = _to;
          emit Transfer(_from, _to, _tokenId);
        }

        function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
          require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals [_tokenId] == msg.sender);
          _transfer(_from, _to, _tokenId);
        }

        function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
          zombieApprovals[_tokenId] = _approved;
          emit Approval(msg.sender, _approved, _tokenId);
        }

      }
---

Давайте посмотрим на код SafeMath:

```
library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}
```

Сначала у нас есть ключевое слово `library` — библиотеки похожи на `contract`, но с некоторыми отличиями. Для наших целей библиотеки позволяют нам использовать ключевое слово `using`, которое автоматически привязывает все методы библиотеки к другому типу данных:

```
using SafeMath for uint;
// Теперь мы можем использовать эти методы c любым uint
uint test = 2;
test = test.mul(3); // test теперь равняется 6
test = test.add(5); // test теперь равняется 11
```

Обратите внимание, что функции `mul` и `add`, требуют по 2 аргумента, но когда мы объявляем `using SafeMath for uint`, то `uint`, на котором мы называем функцию (в нашем случае `test`) автоматически передается в качестве первого аргумента.

Давайте посмотрим на код `add`, чтобы увидеть, что делает SafeMath:

```
function add(uint256 a, uint256 b) internal pure returns (uint256) {
  uint256 c = a + b;
  assert(c >= a);
  return c;
}
```

По сути, `add` просто складывает 2 `uint`a, но она также содержит оператор `assert`, чтобы убедиться, что сумма больше, чем `a`. Это защищает нас от переполнений.

`assert` похож на `require`, по той части, что выдаст ошибку, если ложь. Разница между `assert` и `require`заключается в том, что `require` вернет пользователю оставшуюся часть его газа в случае когда функция не выполняется, а `assert` не вернет. Поэтому большую часть времени вы будете использовать `require` в своем коде; `assert` обычно используется, когда с кодом что-то пошло не так (например, переполнение `uint`).

Так, попросту говоря, SafeMath `add`, `sub`, `mul`, и `div`это функции, которые выполняют 4 основные математические операции, но выдают ошибку, если происходит переполнение или потеря значимости.

### Использование SafeMath в нашем коде.

Для предотвращения переполнения и потери значимости, мы можем найти места в коде, где мы используем `+`, `-`, `*`, или `/`, и заменить их на `add`, `sub`, `mul`, `div`.

Например, вместо того, чтобы делать:

```
myUint++;
```

Мы бы сделали:

```
myUint = myUint.add(1);
```

## Проверь себя

У нас есть 2 места в `ZombieOwnership` где мы использовали математические операции. Давайте поменяем их на методы SafeMath.

1. Замените `++` на метод SafeMath.

2. Замените `--` на метод SafeMath.
