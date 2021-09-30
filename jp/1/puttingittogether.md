---
title: 統合
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          // ここから始めるのだ

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
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

ここまできたらゾンビ生成システムの完成まであと少しだ！全てを結合するpublic関数を作成しよう。

ゾンビの名前やユーザーの名前をインプットできて、ランダムなDNAでゾンビを作れるpublic関数を作成することにしよう。


# それではテストだ

1. `createPseudoRandomZombie`という名前の `public` 関数を作成せよ。そこに`_name` (`string`)というパラメーターを設定せよ。 _(注: `public` 関数を宣言する方法は、 `private`関数を宣言したのと同じです)_

2. 関数の最初の行で`_name`で`_generatePseudoRandomDna`を実行させ、それを`randDna`という名前で `uint`に格納せよ。

3. 次の行で、 `_createZombie` 関数を実行し、`_name`と`randDna`を引数として渡せ。

4. ソリューションは4行以内とする（関数を閉じる`}`を含む）。
