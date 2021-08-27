---
title: 継承
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
              require(ownerZombieCount[msg.sender] == 0);
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }

      // ここから始めるのだ

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

      contract ZombieFeeding is ZombieFactory {

      }

---

ゲームコードがだいぶ長くなってきたな。コードはできるだけ短めにまとめたほうがいい。ロジック毎に分けて、後で見直したときにコードを理解しやすくしておきたい。

Solidityのコントラクトの**_継承_**:はこういう場合に使える機能の一つだ。下の例で説明するぞ：

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

`BabyDoge`は`Doge`から**_継承_**した例だ。この場合、コンパイルして`BabyDoge`を実行すれば、`catchphrase()` と `anotherCatchphrase()`の両方（それと`Doge`で定義した場合のpublic関数）にアクセスできるのだ。

これは論理的な継承に利用されている（例えば`猫`が`動物`のサブクラスといった具合だ）。しかし、それだけではなく、同じようなロジックを別々のコントラクトにまとめて、コードを整理するときに便利だから覚えておくといいだろう。

# それではテストだ

次のチャプターでは、ゾンビに餌を与えて増やす機能を実装したい。そこで`ZombieFactory`の全てのメソッドを継承させて、コントラクトにまとめたい。

1. `ZombieFactory`下に`ZombieFeeding`という名前のコントラクトを作成せよ。このコントラクトは`ZombieFactory`コントラクトを継承するものでなければならない。


