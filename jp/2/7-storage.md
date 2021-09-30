---
title: ストレージ vs メモリ
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // ここから開始せよ

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

            function _createZombie(string _name, uint _dna) private {
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

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

さて、Solidityには変数を格納できる場所が2つ用意されている。`storage` と`memory`だ。

**_Storage_** はブロックチェーン上に永久に格納される変数だ。それとは対照的に**_Memory_**は一時的な変数で、外部関数をコントラクトに呼び出す際に消去されるものだ。まぁ、コンピューターのハードディスクとRAMみたいなイメージでいい。

ほとんどの場合にはSolidityが判定して処理するから使う必要はない。状態変数（関数外で宣言された変数のことだ）の場合はデフォルトで `storage`で、ブロックチェーン上に永久に格納される。一方、関数内で宣言された変数は`memory`として扱われて関数の呼び出しが終われば消えるように設定されている。

そうはいっても、関数で**_structs_** や **_arrays_**を使用するときには必要になるのだ。下に例をあげるぞ：

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ かなり簡単に見えるが、この場合Solidityが明示的に`storage` や `memory`を
    // 宣言するように警告が出るはずだ。
 
    // そこで、`storage`と宣言してみるぞ：
    Sandwich storage mySandwich = sandwiches[_index];
    //...この場合`mySandwich`がstorage内の`sandwiches[_index]`を
    // 示すポインタだから...
    mySandwich.status = "Eaten!";
    // ...これで`sandwiches[_index]`をブロックチェーン上でも永久に変更することになる。

    // コピーしたいだけなら、`memory`の方が便利だ：
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...この場合`anotherSandwich`は memory内のデータを
    // コピーすることになり...
    anotherSandwich.status = "Eaten!";
    // ...一時的な変数を変更するだけで、`sandwiches[_index + 1]`には
    // なんの影響もない。次のようにすることも可能だ： 
    sandwiches[_index + 1] = anotherSandwich;
    // ...ブロックチェーンのstorageに変更したい場合はこうだ。
  }
}
```

どっちを使えばいいのかわからなくなっても、完全に理解できなくても、心配することはない。このチュートリアル内ではどこで `storage`を使うべきか、`memory`を使うべきか、その都度指示を出すようにするからな。それに、使う必要がある場合には、Solidityのコンパイラが教えてくれるから心配はいらないぞ。

今は、`storage` か `memory`を明示的に宣言する必要がある時があるのだな、とだけ覚えておけばそれで十分だ！

# それではテストだ

さて、ゾンビ達が獲物を捕まえたり増えたりする力を身につける時だ！

ゾンビが他の人間達を捕食すると、そのDNAが人間DNAと結合して新しいゾンビを生み出すようにしたい。

1. `feedAndMultiply`という関数を作成せよ。そこに `_zombieId` (`uint`)と `_targetDna` (`uint`)の2つのパラメーターを設定せよ。この関数は `public`で作成せよ。

2. 我々のゾンビに他の誰かが餌を与えるのは見たくない！そこでまずゾンビが我々のものだと確認するようにしたい。そこで、`require`ステートメントを追加して`msg.sender`がこのゾンビのオーナーであるかどうかを確認せよ（`createPseudoRandomZombie`関数を作成した時のやり方を参考にせよ）。

 > 注: 繰り返しで恐縮ですが、回答のチェッカーシステムがベーシックなもののため、`msg.sender`を最初に書かないとエラーになります。ここ以外でコードを書く場合には好きな順番で構いません。

3. ゾンビのDNAを手に入れる必要がある。そこで`myZombie`という名前のローカル`Zombie`（`storage`ポインタとする）を関数で宣言する必要がある。この変数を`zombies`配列内の`_zombieId`インデックスと同じにせよ。

この課題は`}`を含めて4行以内で記述すること。

次のチャプターでこの関数について続けていくぞ！

