---
title: 構造体と配列の操作
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

          function createZombie(string _name, uint _dna) {
              // ここから始めるのだ
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### 新しい構造体を作る

前回の例で使った`Person`構造体を覚えているか？

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

さて、今度は新しい`Person`を作成して、それを`people`配列に格納する方法を教えるぞ。

```
// 新しいPersonを作る：
Person satoshi = Person(172, "Satoshi");

// それを配列に格納する：
people.push(satoshi);
```

全部まとめて1行で書けば、さらにスッキリできるぞ：

```
people.push(Person(16, "Vitalik"));
```

`array.push()`は配列の**最後**に何かを追加するので、要素は追加した順番になります。次の例を参照してください：

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// 数字は [5, 10, 15]
```

# それではテストだ

createZombie関数を実際に動かすぞ！

1. 新しい`Zombie`を作れるように関数の中身を埋めて、それを `zombies` 配列に格納せよ。但し、新しいZombieの`name` と `dna`は関数の引数を使用せよ。
2. 書いたコードを1行で書き直してスッキリさせよ。
