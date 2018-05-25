---
title: 関数の宣言
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
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // ここにcreateZombieという関数を定義するのだ

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

関数の宣言はsolidityでは次のようになる： 

```
function eatHamburgers(string _name, uint _amount) {

}
```

これは`string` と `uint`という2つのパラメーターを持つ、`eatHamburgers`というファンクションだ。関数の中身は今は空にしてある。

> 注：グローバル変数と区別をつけるために、関数パラメーター変数名はアンダースコア(`_`)をつけるのが通例（必須ではありません）です。このチュートリアルでは通例に従います。

この関数は次のように呼び出すことが可能だ：

```
eatHamburgers("vitalik", 100);
```

# それじゃあテストするぞ

アプリでゾンビを何体も作る必要がある。関数を使ってこれを実現したい。

1. `createZombie`という名前の関数を作成せよ。関数には、**__name_** (`string`)と、**__dna_** (`uint`)の、2つのパラメーターを設定せよ。

関数の中身は空で構わない - 後で中身を書いていくからな。

