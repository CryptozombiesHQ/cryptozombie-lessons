---
title: 構造体
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // start here

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

      }
---

複雑なデータ型が必要になる場合がある。Solidityはそのために**_構造体_**を用意している:

```
struct Person {
  uint age;
  string name;
}

```

構造体を使えば、複数のプロパティを持つ複雑なデータ型を作成することができる。

> 新しいデータ型である`string`を導入しました。Stringは任意の長さのUTF-8データに使用されます。例：`string greeting = "Hello world!"`


# それではテストだ

私のアプリでいくつかのゾンビを作りたい！ゾンビは複数のプロパティを持せたいので、構造体を使用するちょうど良いテストだ。

1. `Zombie`という名前の`struct`を作成せよ。

2. `Zombie` 構造体にプロパティを2種類設定せよ：`name` (`string`)、と、`dna` (`uint`)だ。
