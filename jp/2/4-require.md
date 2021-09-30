---
title: Require
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode: |
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
              // ここから始めるのだ
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
---

レッスン 1では、`createPseudoRandomZombie`を呼び出して名前を入力することで、新しいゾンビを作成したな。だが、これではゲームとしては何も面白くはない。誰でも簡単にゾンビ軍団をいくらでも増やせるからだ。

そこで、プレイヤーは1度しかこの関数を呼び出せないようにするのだ。ゲームを始めるときには、最低1体のゾンビを作る必要があるからな。

どうしたらこの関数を1度しかプレーヤーが呼び出せなくなるか、わかるか？

ここで`require`というものを使うのだ。`require`はある条件を満たさない場合はエラーを投げて実行を止めることができるものだ：

```
function sayHiToVitalik(string _name) public returns (string) {
  // まず_nameが"Vitalik"と同じかどうか比較する。真でなければエラーを吐いて終了させる。
  // （注：Solidityはネイティブで文字列比較ができない。そこで文字列の比較を
  // するためにkeccak256 を使ってハッシュ同士を比較する方法を使うのだ。
  require(keccak256(_name) == keccak256("Vitalik"));
  // もし真ならば、関数を処理する：
  return "Hi!";
}
```

`sayHiToVitalik("Vitalik")`でこの関数を呼び出せば、"Hi!"と返ってくる。それ以外で呼び出せばエラーを吐いて終了するはずだ。

この`require` は条件次第で関数を実行したいときにかなり使えるから覚えておくようにな。

# それではテストだ

`createPseudoRandomZombie`を繰り返し呼び出して、いくらでもゾンビを増やせるのは、ゲームとして面白くなさすぎだ。

そこで、`require`を使い、最初のゾンビを作るときだけこの関数が呼び出せるようにせよ。

1. `createPseudoRandomZombie`の最初に`require` ステートメントを記述せよ。この関数で`ownerZombieCount[msg.sender]` が `0`であるかを確認し、そうでなければエラーを投げるように設定せよ。

>注：Solidityでは、どの用語を最初に書いても問題はありません。しかしながら、システムのチェッカーがベーシックなものなので、1種類しか答えを判定することができません。そこで、`ownerZombieCount[msg.sender]` を先に書くようにしてください。

