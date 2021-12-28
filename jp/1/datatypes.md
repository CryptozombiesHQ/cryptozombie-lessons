---
title: 状態変数と整数
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // ここにdnaDigitsを定義するのだ

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

見事だ！コントラクトの骨組みを作りあげたから、次はSolidityが変数をどのように扱うかについて教えていくぞ。

**_状態変数_** はコントラクト内に永遠に保管され続けるものだ。要するにイーサリアムブロックチェーン上に記載されるということだ。まぁDB（データベース）に書き込むようなものだと思って良い。


##### 例:
```
contract Example {
  // この部分がブロックチェーン上に記載される
  uint myUnsignedInteger = 100;
}
```

この例では、`myUnsignedInteger`という名前の`uint`を作り、100に設定しているのだ。

## 符号なし整数: `uint`

`uint`というのは、符号なし整数のデータ型で、こいつは **負数ではない**ということを示しているのだ。この他に`int`という符号付整数もあるから覚えておくようにな。

> 注: Solidityでは、 `uint`は256ビットの符号なし整数である`uint256`のエイリアスです。 `uint8`、`uint16`、 `uint32`など、少ないビット数でuintを宣言することもできます。しかし、一般的には、後のレッスンで説明するような特定の場合を除いて、単に` uint`を使います。

# テストの実行

我々ゾンビのDNAは16桁の数字で決まる。

`dnaDigits`という`uint` を宣言し、それを`16`に設定せよ。
