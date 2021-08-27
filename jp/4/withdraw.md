---
title: Withdraw関数
actions: ['答え合わせ', 'ヒント']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 1. ここにwithdraw関数を作成するのだ

          // 2. ここにsetLevelUpFee関数を作成せよ

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
---

前のチャプターで、Etherをコントラクトにどうやって送るかを学んだ。では送ったあとに何が起こるのか？

コントラクトに送られたEthは、コントラクトのイーサリアム・アカウントに貯められる。コントラクトからEtherを引き出す関数を追加しない限りはそこに閉じ込められたままになってしまうのだ。 

Etherをコントラクトから引き出す関数は、次のように書くぞ。

```
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    owner.transfer(this.balance);
  }
}
```

インポートされていることを想定して、`owner`と`onlyOwner`修飾子を`Ownable`コントラクトから用いていることに注目してくれ。

`transfer`関数を使ってEtherをあるアドレスに送ることができ、`this.balance`はコントラクトに溜まっている残高の総量を返す。なのでもし100人のユーザーが１Etherを我々のコントラクトに支払ったとしたら、`this.balance`は100Etherに等しくなるはずだ。

`transfer`を使えば、どんなイーサリアムのアドレスにも送金可能だ。例えば下にあるように、あるアイテムに対する支払いが多すぎた場合に、Etherを`msg.sender`に送り返す関数を作ることだってできるのだ。

```
uint itemFee = 0.001 ether;
msg.sender.transfer(msg.value - itemFee);
```

または購入者と販売者間のコントラクトにおいて、販売者のアドレスをストレージに保存しておいて、誰かが販売者のアイテムを購入する際に、購入者が支払った料金を販売者に送金することも可能となる。やり方はこうだ。`seller.transfer(msg.value)`

これらは、イーサリアムのプログラミングを本当にクールにしている一例だ。こんな感じで、誰にもコントロールされない分散型マーケットプレイスが持てるんだからな。

## さあテストだ

1. 我々のコントラクト内に、上記の`GetPaid`の例と同一の`withdraw`の関数を作成せよ。

2. Etherの価格は昨年で１０倍以上上昇した。この問題作成時0.001 ETHはおよそ1＄だが、もしまたEtherが１０倍の価格になったとしたら、0.001 ETHは10＄になり我々のゲームはかなり高価になる。

  そこで一ついいアイディアがある。コントラクトの所有者として、我々が`levelUpFee`を設定できるような関数を作成するのだ。

  a. 一つの引数`uint _fee`を受け取る`setLevelUpFee`という名の関数を作成せよ。これは`external`であり、`onlyOwner`修飾子を用いることとする。

  b. 作成した関数に`levelUpFee`を設定し、`_fee`と同等となるようにせよ。
