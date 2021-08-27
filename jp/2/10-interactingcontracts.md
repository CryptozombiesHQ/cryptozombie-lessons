---
title: ゾンビは何を食べるのか？
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        //  KittyInterface をここに作成せよ

        contract ZombieFeeding is ZombieFactory {

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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

さて、いよいよゾンビに餌をやるぞ！なに？ゾンビはいつも何を食べるのかだと？

CryptoZombiesの大好物はな...

**クリプトキティーズ（暗号子猫）だ！** 😱😱😱

(マジだぜ 😆 )

クリプトキティスマートコントラクトから、kittyDnaを読み込むんだよ。クリプトキティーズのデータはブロックチェーン上に公開されているからな。なに、ブロックチェーンはやばい？

心配はいらんぞ。このゲームで誰かのクリプトキティを傷つけるつもりはない。ただクリプトキティーズのデータを*読み込む*だけだ。そのデータは消せないものだから、なんの問題もない。 😉

## 別のコントラクトとのやりとり

ブロックチェーン上の他人のコントラクトとやりとりするには、最初に**_interface_**を定義すればいい。

簡単な例を出すぞ。例としてこんなコントラクトがブロックチェーン上にあったとする。

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

この簡単なコントラクトでは、だれでも自分のラッキーナンバーを格納してそれをイーサリアムアドレスと関連づけることができるものだ。そのアドレスを使えば、だれでもその人間のラッキーナンバーを探し出すことが可能だ。

では、ここで仮に我々が外部コントラクトを持っていたとして、`getNum`関数でコントラクトのデータを読みたいとする。

その場合、まずは`LuckyNumber`コントラクトの**_interface_**を定義するのだ。

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

コントラクト自体を定義しているようにも見えるが、少し違うぞ。ここではやりとりしたい関数（ここでは`getNum`）のみを宣言していて、他の関数とか状態変数には触れていないのだ。

次に、関数自体を定義していないことがわかるかな。括弧(`{` や `}`)ではなく、関数宣言の終わりにセミコロン (`;`)を使っているだろう。

見た目はコントラクトの骨格みたいなものだ。コンパイラはこれを見てinterfaceだと理解するのだ。

このinterfaceをdappのコードに組み込むことで、我々のコントラクトから、他人のコントラクトの関数がどのようなもので、どのように呼び出すか、どんな応答が返るかを知ることができるのだ。

次のレッスンでは実際に他のコントラクトを使った演習を行うが、ここではクリプトキティーズコントラクトのためのinterfaceを宣言するだけにしておくぞ。

# それではテストだ

君のためにクリプトキティーズのソースコードを見つけておいてやったぞ。ここには`getKitty`という関数があり、"genes"（新しいゾンビを作り出すために我々が必要としているのはこれだ）を含む全てのキティのデータを返すようになっている。

関数はこのようになっている：

```
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
) {
    Kitty storage kit = kitties[_id];

    // if this variable is 0 then it's not gestating
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

この関数はこれまで学んできたものと少し違うように見えるだろう。returnの部分を見てみるのだ...たくさん色々な値があるだろう。JavaScriptのような言語を知っているなら、その違いははっきりわかるはずだ。Solidityは関数から複数の値を返すことが可能なのだ。

これでこの関数がどういうものかわかった。そこでこれを使ってinterfaceを作るぞ。

1. `KittyInterface`というinterfaceを定義せよ。これは新しいコントラクトを作るのと同じようなものだ。`contract` キーワードを使用せよ。

2. interface内に、`getKitty`関数を定義せよ。（上記の関数をコピーペーストするものを作成せよ。ただし、括弧の中に書くのではなく、`returns` ステートメントの後にセミコロンをつけよ。）
