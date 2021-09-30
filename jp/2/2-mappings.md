---
title: マッピング(Mapping)とアドレス（Addresses）
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

          // ここでマッピングを宣言するのだ

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

それじゃあ、データベースのゾンビをオーナーに与えるやり方でマルチプレーヤーゲームを作っていくから、しっかりついてこい。

まず、この作業には新しいデータ型が必要になる。 `mapping` と `address`だ。

## アドレス

イーサリアムのブロックチェーンが銀行口座と同じように**_アカウント（口座）_**で構成されているのは知っているな。このアカウント（口座）には、**_Ether（イーサ）_**の残高が記録されていて、Ether（イーサリアムブロックチェーンで使用される通貨）を送金したり受け取ったり、別のアカウントに支払うこともできるのだ。銀行口座から送金するのと全く同じだと思っていい。

それぞれのアカウントには`アドレス`がある。これは銀行口座番号だと思えばいい。これはアカウントのためのユニークな識別番号になっていて、次のような番号で表示されるのだ：

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(このアドレスはCryptoZombiesチームのものだ。CryptoZombiesが気に入ったら、Etherを送ってくれ! 😉 )

アドレスの一番重要な部分は後で説明してやるから、今は**アドレスは特定のユーザー（またはスマートコントラクトで）が所有するものだ**とだけ理解しておけばいい

つまり、この数字をゾンビの番号として使用することができるということだ。このアプリで新しいゾンビを作ったら、関数を呼び出して、イーサリアムのアドレスをそのゾンビに設定していくぞ。

## Mappings（マッピング）

レッスン 1では、**_構造体_** と **_配列_**を教えたな。 **_Mappings（マッピング）_**は、それと同じで、データを格納するときにSolidityで使える方法の一つだ。

 `mapping`は次のように定義するのだ：

```
// 金融系のアプリの場合、ユーザーのアカウントの残高にuintを格納する：
mapping (address => uint) public accountBalance;
// もしくは、ユーザーIdを基にユーザー名を参照・格納するために使用するぞ：
mapping (uint => string) userIdToName;
```

マッピングは本質的にはデータの保管と参照のためのキーバリューストアだ。最初の例で言えば、キーは`address` で、バリュー（値）は`uint`だ。２番目の例だと、キーは `uint` で、バリューは `string`だ。ここまで理解できたか？

# それではテストだ

ゾンビのオーナーシップを格納したいので、2つのマッピングを使用する：一つはゾンビを所有するアドレスをトラッキングし、もう一つはオーナーが持つゾンビをトラッキングするものだ。

1. `zombieToOwner`という名前のマッピングを作成せよ。キーは `uint`とし(idを基にゾンビを参照・保管するぞ）、バリューは`address`とする。マッピングは`public`で作成せよ。

2. `ownerZombieCount`という名前のマッピングを作成し、キーは`address`、バリューは`uint`を設定せよ。
