---
title: 配列
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

          // ここにzombiesというパブリックな配列を定義するのだ

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

      }
---

何かのコレクションを作りたければ、**_配列_**を利用するのだ。Solidityには2種類の配列が用意されている：**_固定長_**配列と**_可変長_**配列だ：

```
// 2要素の固定長の配列の場合：
uint[2] fixedArray;
// 別の固定長配列の例。5つの文字列を格納できる：
string[5] stringArray;
// 可変長配列 - 決まったサイズはないので、格納し続けることができるぞ：
uint[] dynamicArray;
```

**_構造体_**の配列も作れるぞ。前のチャプターの `Person` 構造体を例にすると：

```
Person[] people; // このように可変長配列で書ける。さらに追加し続けることもできるぞ。
```

状態変数は永久にブロックチェーン上に格納されると話したことを覚えているか？こういう構造体の可変長配列は、データベースのように使えるから、コントラクトの構造データを格納する時に便利だ。

## パブリックの配列

配列を`public`で宣言すれば、Solidityが自動的に**_getter_**メソッドを作成するぞ。コードの書き方はこうだ：

```
Person[] public people;
```

他のコントラクトもこの配列を読める（但し、書き込めない）ぞ。こういう性質を持っているから、コントラクトの公開データを格納するときに便利に使えるパターンとして覚えておくように。

# それではテストだ

私は自分のアプリにゾンビの軍隊を格納したいのだ。そして格納したゾンビを他のアプリに見せてやるために、公開したい。

1. パブリックな`Zombie`**_構造体_**の配列を作り、名前を`zombies`とせよ。
