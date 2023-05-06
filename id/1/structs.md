---
title: Structs
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

      }
---

Terkadang kita membutuhkan tipe data yang lebih kompleks. Untuk ini, Solidity menyediakan **_structs_**:

```
struct Person {
  uint age;
  string name;
}

```

Structs memungkinkan kamu membuat tipe data yang lebih rumit yang memiliki banyak properti.

> Perhatikan bahwa kita baru saja memperkenalkan tipe baru, `string`. String digunakan untuk data UTF-8 dengan panjang sewenang-wenang. Contoh. `string greeting = "Hello world!"`

# Kerjakan ini pada tes

Di aplikasi kita, kita ingin membuat beberapa zombie! Dan zombie akan memiliki banyak properti, jadi ini adalah kasus penggunaan yang sempurna untuk sebuah struct.

1. Buat sebuah `struct` dengan nama `Zombie`.

2. Struct `Zombie` kita akan memiliki 2 properti: `name` (`string`), dan `dna` (`uint`).
