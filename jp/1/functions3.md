---
title: さらに関数を続けるぞ
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          // ここに_generatePseudoRandomDna関数を作成するのだ

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {

          }

      }
---

このチャプターでは、関数の **_戻り値_**と、修飾子について教えるぞ。

## 戻り値

関数から値を返すときは、次のように宣言するのだ：

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

Solidityでは関数の宣言に戻り値の型を含むから覚えておくように（ここでは `string`だ）。

## 関数の修飾子

上の関数はSolidity上では何も変更されないぞ。例えば値を変更したり、何かを書き込むこともない。

このケースでは**_view_**関数を宣言できる。これはつまりデータの読み取り専用で編集できないということだ：

```
function sayHello() public view returns (string) {
```

Solidityには**_pure_**関数がある。これを使うとアプリ内のデータにすらアクセスできない。次のコードを考えてみよう：

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

この関数はアプリから読み込むことすらできない。つまり戻り値が関数のパラメーターのみに依存することになる。この場合**_pure_**関数として宣言することができる。


> 注：どんなときに関数をpure/viewと修飾するか覚えるのは難しいかもしれません。幸い、Solidityのコンパイラは優秀なので、どちらの修飾子を使うべきか警告してくれます。


# それではテストだ

文字列からランダムなDNA番号を生成するヘルパー関数を作りたい。

1. `_generatePseudoRandomDna`という名前の`private`関数を作成せよ。パラメーターは `_str`(`string`)という名前で、戻り値を`uint`に設定せよ。

2. この関数はコントラクトの変数を読み込むことはあるが、編集することはない。そこで修飾子を`view`と設定せよ。

3. 関数の中身は空にせよ。中身は後で書き込むぞ。
