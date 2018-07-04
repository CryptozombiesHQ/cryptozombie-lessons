---
title: Private / Public 関数
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
          
          // createZombie関数をprivateに変更するのだ
          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

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

      }
---

Solidityでは、関数はデフォルトで`public`になっている。要するに誰でも（別のコントラクトからでも）君のコントラクトの関数を呼び出して、実行できるということだ。 

これは当然愉快なことではないし、攻撃に対してコントラクトが脆弱になることになる。だから、自分が使う関数はデフォルトで`private`にして、公開しても構わない関数だけを`public`に設定するのだと、心がけておくように。

では、private関数の宣言方法を教えるぞ：

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```
このように書くと、この関数はコントラクト内の他の関数からだけ呼び出して、`numbers`配列に格納できる。

見ればわかる通り、関数名の後に `private`とつけるのだ。関数のパラメーターと同様に、アンダースコア(`_`)で始めるのが通例だから覚えておくように。

# それではテストだ

我々の`createZombie`関数はデフォルトでpublicになっている。つまりだれでもコントラクトから関数を呼び出してゾンビを作れるということだ！これはあってはならないことだから、privateに変えなければならない。

1. private関数になるように、`createZombie`を編集せよ。名付けの通例を忘れるなよ！
