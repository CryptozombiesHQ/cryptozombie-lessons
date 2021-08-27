---
title: 時間の単位
actions: ['答え合わせ', 'ヒント']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. `cooldownTime` をここに定義せよ。

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
                // 2. 次の行を更新せよ：
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
---

`level` プロパティは見ればわかるだろう。あとで開発するバトルシステムで勝つことでレベルアップして、より多くの能力にアクセスできるようになる。


`readyTime`プロパティは少し説明が必要になる。目的は”冷却期間”を追加することで、一度ゾンビが何かを攻撃・捕食したあとで、次の攻撃・捕食までどれくらい待たなければならないかを規定するものだ。これがないと１日に何千回でも攻撃して増殖できるから、ゲームが成り立たないからだ。

次の捕食までどれだけ待たなければならないかを計算するには、Solidityの時間の単位を使用することができる。

## 時間の単位

Solidityには時間を扱うための固有の単位がいくつか用意されている。

`now`変数は、現在のunixタイムスタンプ（1970年1月1日から経過した秒数のことだ）を返す。これを書いている時のunixタイムスタンプは`1515527488`だ。

>注：unixタイムスタンプは歴史的に32ビットの数値として格納されています。これは"2038年"問題、つまり、32ビットのunixタイムスタンプがオーバーフローすることによりたくさんの古いシステムが壊れる問題、の原因になります。もしDAppを今から20年以上稼働させたいなら、64ビットの数値を使う必要がありますが、ユーザーはその間ずっとガスコストを多めに支払うことになります。設計上の決断が必要になります！

Solidityには `seconds`、 `minutes`、 `hours`、 `days`、`weeks` 、`years`という単位も用意されている。それぞれ`uint`の秒数に変換されて使用される。つまり、`1 minutes` は `60`になり、`1 hours` は `3600` (60 秒 x 60 分)になり、`1 days` は`86400` (24時間 x 60 分 x 60 秒)となる。

時間単位がかなり役立つことを理解するための例をあげるぞ：

```
uint lastUpdated;

//  `lastUpdated` を `now`に設定する
function updateTimestamp() public {
  lastUpdated = now;
}

// `updateTimestamp`が呼ばれてから5分経っていれば、`true`が返る。
// 5分経っていなければ、`false`が返る。
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

ゾンビの`cooldown`機能にはこの時間の単位を使用するのだ。

## それではテストだ

DAppにクールダウンタイマー機能を追加し、ゾンビが一度捕食したら、**1 day**待たなければならないようにしたい。

1. `cooldownTime`という`uint`を宣言し、`1 days`に設定せよ。(英語の文法的には"1 day"が正しいが、それではコンパイルされないので、ここでは気をつけるようにな。)

2. 前のチャプターですでに`Zombie` structに`level`と `readyTime`を追加してある。そこで新しい`Zombie` structを作る場合、正しい引数を使うために`_createZombie()`を更新する必要がある。

   `zombies.push`の行を変更し、`1` (`level`用)と、`uint32(now + cooldownTime)`(`readyTime`用)の2つの引数を追加せよ。

>注：デフォルトで`now` は `uint256` を返すため、`uint32(...)`が必要になります。そこで明示的に `uint32`に変換します。

`now + cooldownTime` は、現在のunixタイムスタンプ（秒)と、１日分の秒数を足した数字になる。つまり１日後のunixタイムスタンプとなる。ゾンビの捕食に十分な時間が経ったかを判定するために、あとでゾンビの`readyTime` が `now`よりも大きくなっているかを確認することになる。

`readyTime`でアクションを制限する機能については、次のチャプターで教えてやるから、しばし待つのだ。
