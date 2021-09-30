---
title: 乱数
actions: ['答え合わせ', 'ヒント']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // ここから始めるのだ
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

いい感じだ！今度はバトルのロジックを理解しよう。

あるレベルのランダム性は、全ての良いゲームにとって必要だ。ではSolidityにおいてどのように乱数を生成するのだろうか。

それは不可能だ、というのがリアルな答えだ。少なくとも、それを安全に行うことはできない。

何故なのか見てみよう。

## `keccak256`経由での乱数生成

Solidityにおけるベストなランダム性のソースは、`keccak256`ハッシュ関数である。

次のようにして乱数を生成するのだ。

```
// 1から100までの乱数を生成せよ:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

このコードが行うのは、`now`のタイムスタンプと`msg.sender`、そして増加する値`nonce`(一度のみ使用される数字なので同じ入力パラメーター値を持つハッシュ関数が二度実行されることはない）の受け取りだ。 

`keccak`でこれら入力値をランダムなハッシュ値に変換、そしてそのハッシュ値を`uint`型に変換したら、その末尾２桁のみ残すように`% 100`をする。こうして0から99の間の、完全にランダムな数値を生成するのだ。

### この方法は、不誠実なノードの攻撃に対して脆弱である

イーサリアムでは、コントラクトの関数を呼び出す際、ネットワーク上の一つまたは複数のノードに **_トランザクション_** として送信し、ネットワーク上のノードはトランザクションの束を集め、Proof of Work (PoW、仕事の証明)として計算集約的数学の問題を一番速く解こうとする。そして彼らのProof of Work (PoW、仕事の証明)も併せたトランザクションのグループを **_ブロック_** としてネットワークの残りのノードに発行する。

一度あるノードがPowを解いてしまうと、他のノードはそのPowを解くのをやめ、トランザクションリストが有効であることを確認してブロックを承認し、さらに次のブロックを解くことに取り掛かる。

**これは我々の乱数関数のセキュリティーホールとなる**

例えばコイン・トスのコントラクトがあるとしよう。表ならお主のお金は２倍になり、裏なら全てのお金を失うというルールだ。表裏を決定するのに、上でやった乱数関数を使うとしよう。(`random >= 50`なら表、`random < 50`なら裏)

もしわしがノードを立てているとしたら、 **自分のノードだけに向けて** トランザクションを発行できる。そうするとコイン・トスの関数を動かして勝ち負けを見て、わしの解いている次のブロックにそのトランザクションが含まれないよう選択することができてしまう。コイン・トスに勝って次のブロックを解くまでこれを無期限で行い続け、利益を出すことが可能だ。

## ではイーサリアムではどうやって安全に乱数を生成するのだろう？

ブロックチェーンの全内容が全ての参加者に見えているため、これは難しい問題である。そしてその解決法はこのチュートリアルの範囲を超えている。 <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>このStackOverflowのスレッド</a> を読んでアイディアをいくつか見て見ると良いぞ。 そこに一つ、イーサリアムのブロックチェーン外部から乱数関数にアクセスするために **_oracle_** を使うアイディアがある。

もちろん、ネットワーク上の数万ものイーサリアム・ノードが次のブロックを解こうと競っているのだから、わしが次のブロックを解く勝率は極めて低い。これで利益があるようにするには、たくさんの時間と計算リソースが必要だからな。だがその報酬が十分に高ければ（コイン・トス関数に＄100,000,000賭けられたらといったことだ）、わしにとって攻撃する価値が出てくる。

こういうわけでこの乱数生成関数はイーサリアム上では安全ではないが、実際に我われの乱数関数が大金を危険にさらさない限りは、ゲームのユーザーは攻撃する十分なリソースを持つことはないだろう。

なぜならこのチュートリアルではデモ目的にシンプルなゲームを作っているだけだし、危険にさらされる実際のお金もない。完全に安全ではないと知っていても、乱数生成関数は実行が簡単だし、これを使うことのトレード・オフを受け入れていこう。

あとのレッスンでは、**_oracles_** （イーサリアム外部からデータをプルする安全な方法だ）を使って、ブロックチェーン外部から安全な乱数を生成するのもやっていくからな。

## さあテストだ

攻撃に対して完璧に安全ではなかったとしても、バトル結果の決定に使える乱数関数を実行しよう。

1. コントラクトに、`randNonce`という`uint`を与え、`0`に同等となるよう設定せよ。

2. `randMod` (random-modulus)という関数を作成せよ。これは`_modulus`という名の`uint`を受け取る`internal`関数であり、`uint`を返す（`returns`）。

3. この関数はまず`randNonce`を増やさなくてはならない。(`randNonce++`という構文を使うのだ)。

4. 最後に、`now`、`msg.sender`そして`randNonce`の`keccak256`ハッシュ値の型変換を`uint`に計算し、その値を`% _modulus`して`return`せよ。これはコード１行で行うこと。（ふう、説明しにくかったぞ。もしわからなかったら、上で乱数を生成した例をちょっと見てくれ。よく似たロジックだ。）
