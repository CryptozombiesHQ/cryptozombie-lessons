---
title: Msg.sender
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
              // ここから始めるのだ
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
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

さて、ゾンビのオーナーをトラックするマッピングができたな。それじゃあそれを使って`_createZombie`メソッドを更新していくぞ。

ここで使うのは、`msg.sender`というものだ。

## msg.sender

Solidityには全ての関数で利用できるグローバル変数が用意してある。`msg.sender`もその一つだ。これを使用すると、その関数を呼び出したユーザー（またはスマートコントラクト）の `address`を参照できるのだ。

> 注：Solidityは、常に外部の呼び出し元から関数を実行しなければならないという決まりがある。その関数を呼び出すまでは、コントラクトはブロックチェーン上で何もせずに、ただそこにあるだけなのだ。だから何かをするときには常に`msg.sender`を使用するのだ。

`msg.sender`の実際の使用例と`mapping`の更新を教えてやろう：

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // ここでは`favoriteNumber` mappingを更新して、`msg.sender`下に`_myNumber`を格納するぞ。
  favoriteNumber[msg.sender] = _myNumber;
  // mappingにデータを格納するのは、こう書くのだ
}

function whatIsMyNumber() public view returns (uint) {
  // 送信者のアドレスに格納されている値を受け取る
  // もし送信者が`setMyNumber`を呼び出さなかった場合は`0`だ
  return favoriteNumber[msg.sender];
}
```

この例は理解しやすいように簡単にしてあるから、誰でも`setMyNumber`を呼び出して、アドレスに紐づいた`uint`を我々のコントラクトに格納することができてしまう。そこで`whatIsMyNumber`を呼び出せば、格納した`uint`を戻すこともできるだろう。

`msg.sender`は、イーサリアムブロックチェーンにセキュリティをもたらすものだ。他人のデータを改変したいなら、イーサリアムアドレスに関連づけられている秘密鍵を盗む以外に方法がない状態にすることができるのだ。

# それではテストだ

レッスン1から使っている`_createZombie`メソッドを更新して、ゾンビのオーナーシップを関数を呼び出した奴に割り当てるようにしたい。

1. まず最初は、新しいゾンビの`id`を取得して、`id`下に`msg.sender`を格納して`zombieToOwner`マッピングを更新せよ。

2. 次に、この`msg.sender`で`ownerZombieCount`を増やせ。

Solidityでは、 `++`を使えば`uint`を増やせるぞ。JavaScriptと同じだ。

```
uint number = 0;
number++;
// `number` is now `1`
```
この課題は2行で作成せよ。
