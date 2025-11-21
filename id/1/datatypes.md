---
title: State Variables & Integers
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          //start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Kerja bagus! Sekarang setelah kita memiliki shell untuk contract kita, mari kita pelajari tentang bagaimana Solidity menangani variabel.

**_State variables_** disimpan secara permanen dalam penyimpanan contract. Ini berarti mereka ditulis ke blockchain Ethereum. Pikirkan mereka seperti menulis ke DB.

##### Contoh:
```
contract Example {
  // Ini akan disimpan secara permanen di blockchain
  uint myUnsignedInteger = 100;
}
```

Dalam contract contoh ini, kita membuat `uint` bernama `myUnsignedInteger` dan menetapkan sama dengan 100.

## Unsigned Integer: `uint`

Tipe data `uint` adalah sebuah unsigned integer, artinya **nilainya harus non-negatif (tidak boleh negatif)**. Ada juga tipe data `int` untuk signed integer.

> Catatan: Dalam Solidity, `uint` sebenarnya adalah alias dari `uint256`, sebuah bilangan 256-bit unsigned integer. Kamu dapat mendeklarasikan uint dengan bit yang lebih sedikit — `uint8`, `uint16`, `uint32`, dll.. Tetapi secara umum kamu hanya perlu menggunakan `uint` kecuali dalam kasus tertentu, yang akan kita bicarakan di pelajaran selanjutnya.

# Kerjakan ini pada tes

DNA Zombie kita akan ditentukan oleh angka 16 digit.

Deklarasikan sebuah `uint` bernama `dnaDigits`, dan tetapkan nilainya sama dengan `16`.
