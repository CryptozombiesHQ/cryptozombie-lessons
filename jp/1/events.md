---
title: イベント
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // イベントをここで宣言するのだ

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // ここでイベントを発生させるのだ
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
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

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

我々のコントラクトももう直ぐ完成だ！そこで、**_event_**を追加しよう。

**_Events_** は、ブロックチェーンで何かが生じたときに、コントラクトがアプリのフロントエンドに伝えることができるものだ。しかも特定のイベントを'listening'状態にして、何かあった時にアクションを起こすこともできるのだ。

例：

```
// イベントの宣言
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // 関数が呼ばれたことをアプリに伝えるためにイベントを発生させる：
  IntegersAdded(_x, _y, result);
  return result;
}
```

アプリのフロントエンドをリッスン（接続待ち）状態にできる。JavaScriptで実装すると次のように書けるのだ：

```
YourContract.IntegersAdded(function(error, result) { 
  // 結果について何らかの処理をする
}
```

# それではテストだ

新しいゾンビを作る毎にそれをフロントエンドに伝えて、アプリ上に表示させたい。

1. `NewZombie`という名前の`event`を宣言せよ。`zombieId` (`uint`)、 `name` (`string`)、 `dna` (`uint`)の値を渡すのだ。

2. `_createZombie`関数を編集し、`zombies`配列に新しいゾンビを追加したら `NewZombie`イベントが発生させよ。

3. ゾンビの`id`が必要だ。`array.push()`は新しい長さの`uint`配列を返し、配列の最初のインデックスは0であるから、`array.push() - 1` が追加したゾンビのインデックスだ。そこで、`zombies.push() - 1`結果を`id`という名前の`uint`に格納し、次の行で作成する`NewZombie`イベントで使用できるようにせよ。

