---
title: ガス（燃料）
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

            struct Zombie {
                string name;
                uint dna;
                // ここに新しいデータを追加せよ
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
---

見事だ！これでDAppの重要な部分の更新を可能にしつつ、他の誰かが我々のコントラクトをめちゃくちゃにするのを防ぐ方法が理解できただろう。

Solidityが他のプログラミング言語と比べて、かなり違う部分についてさらに教えてやろう：

## ガス — イーサリアムDAppの燃料

Solidityでは、ユーザーが関数を使用するたびに、**_ガス_**と呼ばれる通貨を支払うことになっている。ユーザーはEther（イーサと呼ぶ。イーサリアムの通貨だ）でガスを買い、アプリの関数を実行するのだ。

関数を実行するために必要なガスの量は、関数のロジックの複雑さによるのだ。個々の操作には、その操作を実行するためにどれくらいの計算資源が必要になるのかを計算したものに基づいて、**_ガスのコスト_**が決まっている（例えば、storageへの書き込みは整数の足し算に比べてずっと高いぞ）

各操作に必要なガスの価格の合計が、関数の **_ガスのコスト_**になる。

ユーザーは実際にお金を使って関数を動かすことになるから、イーサリアムは他のプログラミング言語よりもずっとコードの最適化が重要になるのだ。お主のコードがお粗末だと、ユーザーは余分にお金を支払わなければならなくなる。結果的には数千人のユーザーの数百万ドルを無駄にすることになるのだ。

## なぜガスが必要なのか？

イーサリアムは、大きくて、遅いけれども、極めて安全なコンピューターのようなものだ。関数を実行する時には、ネットワーク上で必要になるすべてのノードで同じ関数が実行されて、出力が正しいことを検証するのだ。何千ものノードが関数の実行を検証する仕組みこそが、イーサリアムを分散型にして、データを不変で検閲耐性の強いものにしているのだ。

イーサリアムの作成者は、誰かが無限ループを起こしてネットワークを詰まらせたり、非常に重い処理でネットワークの計算資源を食いつぶしたりしないようにしたいと願っていたのだ。だからこそ、トランザクションを無料にすることを避け、ユーザーに計算時間とストレージについて支払うようにしたのだ。

> 注：CryptoZombiesの作者がLoom Networkで構築しているようなサイドチェーンの場合は話は別です。 World of Warcraftのようなゲームをイーサリアムのメインのネットワーク上で直接動かすことは、ガスのコストが高額になることから、ありえない話です。しかし、別のコンセンサスアルゴリズムで動作するサイドチェーン上で実行することは十分考えられることです。後のレッスンで、どのようなタイプのDAppをイーサリアムのメインネットワークではなくサイドチェーン上に構築すべきかについて解説します。

## ガスを節約するためのstruct構造

レッスン 1では、`uint`には様々なタイプがあることを教えたな。 `uint8`、 `uint16`、 `uint32`とかだ。

普通はこのサブタイプを使うメリットはない。なぜならSolidityは`uint`のサイズに関わらず256ビットのストレージを確保するからだ。例えば`uint` (`uint256`) の代わりに`uint8` を使ってもガスの節約にはならない。

しかしこれには例外がある。それは`struct`の中だ。

structの中に複数の `uint`がある場合、できる限り小さい単位の `uint`を使うことで、Solidityが複数の変数をまとめて、ストレージを小さくすることが可能だ。例をあげるぞ：

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// 複数の変数がまとめられるため、`mini` は`normal`に比べてガスコストが低くなる。
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30);
```

このため、structの中ではできる限り小さな整数のサブタイプを使うようにすることだ。

また、同じデータ型の変数を一箇所にまとめることで（つまり、structの中で隣り合わせることで）、Solidityのstorageスペースを最小限に抑えることも可能だ。例えば、`uint c; uint32 a; uint32 b;`は、`uint32 a; uint c; uint32 b;`よりもコストが低くなる。なぜなら2つの`uint32`変数をまとめることできるからだ。

## それではテストだ

ここではゾンビに新たに2つの特徴を加えたい。`level` と`readyTime`だ。`readyTime`はゾンビに餌を与える間隔を設定するクールダウンタイマーに使用する。

では、`zombiefactory.sol`に戻るぞ。

1. `Zombie` structに2つのプロパティを追加せよ。プロパティは `level` (`uint32`)と、`readyTime` (`uint32`)である。このデータ型をまとめることができるようにstructの最後に設定せよ。

ゾンビのレベルとタイムスタンプの格納は32 bitsで十分だ。そこで、通常の`uint` (256ビット)ではなく、よりタイトにデータを格納することでガスコストを節約するのだ。
